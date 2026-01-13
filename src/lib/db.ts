import { Pool } from "pg";

// Initialize database connection pool
let pool: Pool | null = null;
let schemaInitialized = false;

const getPool = (): Pool => {
  if (!pool) {
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    
    if (!connectionString) {
      const errorMsg = process.env.VERCEL 
        ? `Missing PostgreSQL connection string on Vercel.\n` +
          `Please set POSTGRES_URL or DATABASE_URL in Vercel project settings:\n` +
          `1. Go to your Vercel project\n` +
          `2. Settings → Environment Variables\n` +
          `3. Add POSTGRES_URL with your database connection string\n` +
          `4. Redeploy the application`
        : `Missing PostgreSQL connection string.\n` +
          `Please set POSTGRES_URL or DATABASE_URL in .env.local\n` +
          `Current env check: POSTGRES_URL=${!!process.env.POSTGRES_URL}, DATABASE_URL=${!!process.env.DATABASE_URL}`;
      
      throw new Error(errorMsg);
    }

    pool = new Pool({
      connectionString,
      ssl: connectionString.includes('sslmode=require') ? { rejectUnauthorized: false } : undefined,
      max: 10, // More connections for better concurrency
      min: 2, // Keep 2 connections ready
      idleTimeoutMillis: 30000, // 30 seconds idle timeout
      connectionTimeoutMillis: 30000, // 30 seconds to establish connection (increased for remote DBs)
      statement_timeout: 30000, // Query timeout - 30 seconds max per query
      keepAlive: true, // Keep connections alive
      keepAliveInitialDelayMillis: 10000, // Start keep-alive after 10 seconds
    });

    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  return pool;
};

// Create a sql template tag function similar to @vercel/postgres
export const sql = (strings: TemplateStringsArray, ...values: any[]) => {
  // Lazy get pool - only when query is executed
  let pool: Pool;
  try {
    pool = getPool();
  } catch (error) {
    // Return a rejected promise if pool can't be created
    return Promise.reject(error) as Promise<{ rows: any[]; rowCount: number }>;
  }
  
  const query = strings.reduce((acc, str, i) => {
    return acc + str + (i < values.length ? `$${i + 1}` : '');
  }, '');
  
  // Create a promise that executes the query with timeout handling
  const queryPromise = pool.query(query, values)
    .then(result => ({
      rows: result.rows,
      rowCount: result.rowCount,
    }))
    .catch((error) => {
      // Enhance error message for connection issues
      if (error instanceof Error) {
        if (error.message.includes('timeout') || 
            error.message.includes('ECONNREFUSED') || 
            error.message.includes('ENOTFOUND') ||
            error.message.includes('ETIMEDOUT')) {
          throw new Error(
            `Database connection failed: ${error.message}. ` +
            `Please check your POSTGRES_URL in .env.local and ensure the database is accessible. ` +
            `If using a remote database, verify network connectivity and firewall settings.`
          );
        }
      }
      throw error;
    });

  // Create a timeout promise
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error('Database query timeout after 30 seconds - connection may be slow or unavailable'));
    }, 30000); // 30 second timeout
  });

  // Race between query and timeout
  return Promise.race([queryPromise, timeoutPromise]) as Promise<{ rows: any[]; rowCount: number }>;
};

// Use a lock to prevent concurrent schema initialization
let schemaInitializing = false;
let schemaInitPromise: Promise<void> | null = null;

const initializeSchema = async () => {
  if (schemaInitialized) {
    return;
  }

  // If initialization is in progress, wait for it
  if (schemaInitializing && schemaInitPromise) {
    return schemaInitPromise;
  }

  // Start initialization
  schemaInitializing = true;
  schemaInitPromise = (async () => {
    try {
    // Check if connection string exists before trying to connect
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('POSTGRES_URL or DATABASE_URL environment variable is not set');
    }

    const pool = getPool();
    
    // Create tenants table FIRST (before any foreign keys reference it)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tenants (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        "adminUsername" TEXT NOT NULL UNIQUE,
        "adminPassword" TEXT NOT NULL,
        "createdAt" TEXT NOT NULL,
        "updatedAt" TEXT NOT NULL
      )
    `);

    // Create teams table (without foreign key first)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        "createdAt" TEXT NOT NULL
      )
    `);

    // Add tenantId column if it doesn't exist (for existing databases)
    try {
      const columnExists = await pool.query(`
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='teams' AND column_name='tenantId'
      `);
      if (columnExists.rows.length === 0) {
        await pool.query(`ALTER TABLE teams ADD COLUMN "tenantId" TEXT`);
      }
    } catch (error) {
      // Ignore errors if column already exists
      console.log("Note: tenantId column may already exist in teams table");
    }

    // Add foreign key constraint if it doesn't exist (only after tenants table exists)
    try {
      const constraintExists = await pool.query(`
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'teams_tenantId_fkey' 
        AND table_name = 'teams'
      `);
      if (constraintExists.rows.length === 0) {
        await pool.query(`
          ALTER TABLE teams 
          ADD CONSTRAINT teams_tenantId_fkey 
          FOREIGN KEY("tenantId") REFERENCES tenants(id) ON DELETE CASCADE
        `);
      }
    } catch (error) {
      // Ignore errors if constraint already exists
      console.log("Note: teams_tenantId_fkey constraint may already exist");
    }

    // Create tasks table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        description TEXT NOT NULL,
        flag TEXT NOT NULL,
        points INTEGER NOT NULL,
        resources TEXT NOT NULL
      )
    `);

    // Create assignments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS assignments (
        id TEXT PRIMARY KEY,
        "teamId" TEXT NOT NULL,
        "taskId" TEXT NOT NULL,
        status TEXT NOT NULL,
        "lastUpdated" TEXT NOT NULL,
        UNIQUE("teamId", "taskId"),
        FOREIGN KEY("teamId") REFERENCES teams(id) ON DELETE CASCADE,
        FOREIGN KEY("taskId") REFERENCES tasks(id) ON DELETE CASCADE
      )
    `);

    // Create submissions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id TEXT PRIMARY KEY,
        "assignmentId" TEXT NOT NULL UNIQUE,
        "teamId" TEXT NOT NULL,
        plan TEXT NOT NULL,
        findings TEXT NOT NULL,
        flag TEXT NOT NULL,
        "createdAt" TEXT NOT NULL,
        "updatedAt" TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        "pointsAwarded" INTEGER DEFAULT 0,
        "adminNotes" TEXT DEFAULT '',
        "reviewedAt" TEXT,
        FOREIGN KEY("teamId") REFERENCES teams(id) ON DELETE CASCADE,
        FOREIGN KEY("assignmentId") REFERENCES assignments(id) ON DELETE CASCADE
      )
    `);

    // Create admin_sessions table (without new columns first)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        token TEXT PRIMARY KEY,
        "createdAt" TEXT NOT NULL
      )
    `);

    // Add adminType column if it doesn't exist
    try {
      const columnExists = await pool.query(`
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='admin_sessions' AND column_name='adminType'
      `);
      if (columnExists.rows.length === 0) {
        await pool.query(`ALTER TABLE admin_sessions ADD COLUMN "adminType" TEXT DEFAULT 'super'`);
      }
    } catch (error) {
      // Ignore errors if column already exists
      console.log("Note: adminType column may already exist in admin_sessions table");
    }

    // Add tenantId column if it doesn't exist
    try {
      const columnExists = await pool.query(`
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='admin_sessions' AND column_name='tenantId'
      `);
      if (columnExists.rows.length === 0) {
        await pool.query(`ALTER TABLE admin_sessions ADD COLUMN "tenantId" TEXT`);
      }
    } catch (error) {
      // Ignore errors if column already exists
      console.log("Note: tenantId column may already exist in admin_sessions table");
    }

    // Add foreign key constraint if it doesn't exist (only after tenants table exists)
    try {
      const constraintExists = await pool.query(`
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'admin_sessions_tenantId_fkey' 
        AND table_name = 'admin_sessions'
      `);
      if (constraintExists.rows.length === 0) {
        await pool.query(`
          ALTER TABLE admin_sessions 
          ADD CONSTRAINT admin_sessions_tenantId_fkey 
          FOREIGN KEY("tenantId") REFERENCES tenants(id) ON DELETE CASCADE
        `);
      }
    } catch (error) {
      // Ignore errors if constraint already exists
      console.log("Note: admin_sessions_tenantId_fkey constraint may already exist");
    }

    // Create hackathon_status table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hackathon_status (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        "isActive" INTEGER DEFAULT 0,
        "startTime" TEXT,
        "endTime" TEXT,
        "createdAt" TEXT NOT NULL,
        "updatedAt" TEXT NOT NULL
      )
    `);

    // Create hackathon_tasks table to store selected tasks for the hackathon
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hackathon_tasks (
        "taskId" TEXT PRIMARY KEY,
        "createdAt" TEXT NOT NULL,
        FOREIGN KEY("taskId") REFERENCES tasks(id) ON DELETE CASCADE
      )
    `);

    // Create learning_materials table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS learning_materials (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        module TEXT NOT NULL,
        "fileUrl" TEXT NOT NULL,
        "fileName" TEXT NOT NULL,
        "fileType" TEXT NOT NULL,
        "fileSize" INTEGER,
        "uploadedBy" TEXT,
        "createdAt" TEXT NOT NULL,
        "updatedAt" TEXT NOT NULL
      )
    `);

    // Create indexes for better query performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_submissions_teamId ON submissions("teamId");
      CREATE INDEX IF NOT EXISTS idx_submissions_assignmentId ON submissions("assignmentId");
      CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
      CREATE INDEX IF NOT EXISTS idx_assignments_teamId ON assignments("teamId");
      CREATE INDEX IF NOT EXISTS idx_assignments_taskId ON assignments("taskId");
      CREATE INDEX IF NOT EXISTS idx_hackathon_tasks_taskId ON hackathon_tasks("taskId");
      CREATE INDEX IF NOT EXISTS idx_teams_tenantId ON teams("tenantId");
      CREATE INDEX IF NOT EXISTS idx_learning_materials_module ON learning_materials(module);
      CREATE INDEX IF NOT EXISTS idx_admin_sessions_tenantId ON admin_sessions("tenantId");
    `).catch(() => {
      // Ignore errors if indexes already exist
    });

    // Initialize hackathon_status if it doesn't exist (use INSERT ... ON CONFLICT for atomicity)
    const now = new Date().toISOString();
    await pool.query(
      `INSERT INTO hackathon_status (id, "isActive", "startTime", "endTime", "createdAt", "updatedAt")
       VALUES (1, 0, NULL, NULL, $1, $2)
       ON CONFLICT (id) DO NOTHING`,
      [now, now]
    ).catch(() => {
      // Ignore errors - table might not exist yet or already initialized
    });

      schemaInitialized = true;
      schemaInitializing = false;
      console.log("✅ Database schema initialized successfully");
    } catch (error) {
      schemaInitializing = false;
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      
      // Check if it's a constraint/duplicate error that we can ignore
      if (errorMessage.includes("duplicate key") || 
          errorMessage.includes("already exists") ||
          errorMessage.includes("pg_type_typname_nsp_index")) {
        console.log("⚠️ Schema modification conflict detected (likely concurrent initialization), but continuing...");
        // Mark as initialized anyway - tables likely exist
        schemaInitialized = true;
        schemaInitializing = false;
        return;
      }
      
      console.error("Database schema initialization error:", error);
      console.error("Error details:", { errorMessage, errorStack });
      
      throw new Error(
        `Database connection failed: ${errorMessage}\n` +
        `Make sure:\n` +
        `1. .env.local file exists with POSTGRES_URL\n` +
        `2. Dev server was restarted after creating .env.local\n` +
        `3. Connection string is correct\n` +
        `Original error: ${errorMessage}`
      );
    }
  })();

  return schemaInitPromise;
};

// Cache initialization to avoid repeated schema checks
let dbInitialized = false;
let dbInitializationError: Error | null = null;

export const getDb = async () => {
  if (!dbInitialized && !dbInitializationError) {
    try {
      // Test connection first
      const pool = getPool();
      try {
        await pool.query('SELECT 1');
      } catch (connError) {
        throw new Error(
          `Database connection test failed: ${connError instanceof Error ? connError.message : String(connError)}. ` +
          `Please verify your POSTGRES_URL in .env.local is correct and the database is accessible.`
        );
      }
      
      await initializeSchema();
      dbInitialized = true;
    } catch (error) {
      dbInitializationError = error instanceof Error ? error : new Error(String(error));
      // Don't throw here - let individual queries handle the error
      console.error('Database initialization failed (non-fatal):', dbInitializationError);
      // Don't mark as initialized so we can retry later
      dbInitialized = false;
    }
  }
  
  // If initialization failed, throw on first query attempt
  // But only if we're sure it failed (not just not initialized yet)
  if (dbInitializationError) {
    // Re-throw the error so queries can handle it
    throw dbInitializationError;
  }
  
  // Return sql template tag function
  return sql;
};
