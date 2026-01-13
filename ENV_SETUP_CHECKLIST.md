# Environment Variables Setup Checklist for New AI Hackathon Project

## ⚠️ IMPORTANT: You MUST update these for your new project!

Since you copied this project from another hackathon, you need to update environment variables to avoid conflicts and ensure security.

## Required Environment Variables

### 1. Database Connection (CRITICAL - Must Change!)

**Option A: Use a NEW separate database (RECOMMENDED)**
- Create a new PostgreSQL database for this AI hackathon project
- Update `POSTGRES_URL` or `DATABASE_URL` with the new connection string
- Format: `postgres://user:password@host:port/database?sslmode=require`

**Option B: Use the same database (NOT RECOMMENDED)**
- If you use the same database, both projects will share the same data
- Teams, tasks, and submissions will be mixed between projects
- Only do this if you want to share data between both hackathons

### 2. Admin Credentials (MUST CHANGE for Security!)

**Local Development (.env.local):**
```bash
ADMIN_USERNAME=ai_admin
ADMIN_PASSWORD=your_secure_password_here
POSTGRES_URL=your_postgres_connection_string_here
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here
```

### 3. Vercel Blob Storage Token (REQUIRED for File Uploads)

**To get the token:**
1. Go to Vercel Dashboard → Your Project → Storage
2. Create a Blob store (if not exists)
3. Copy the `BLOB_READ_WRITE_TOKEN` from environment variables
4. Add it to `.env.local` and Vercel project settings

**Without this token, file uploads will fail!**

**Vercel Deployment:**
1. Go to Vercel project settings → Environment Variables
2. Update or add:
   - `ADMIN_USERNAME` (use different value than old project)
   - `ADMIN_PASSWORD` (use different value than old project)
   - `POSTGRES_URL` (point to new database or same if sharing)

### 4. Port Numbers (Already Updated)

✅ Port numbers have been changed in `package.json`:
- Development: Port **3004** (was 3003)
- Production: Port **3007** (was 3006)

This prevents conflicts if you run both projects simultaneously.

## Quick Setup Steps

### For Local Development:

1. **Create `.env.local` file** in the project root:
   ```bash
   ADMIN_USERNAME=ai_admin
   ADMIN_PASSWORD=your_secure_password_here
   POSTGRES_URL=postgres://user:password@host:port/database?sslmode=require
   BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here
   ```

2. **Clear old database files** (if using SQLite):
   ```bash
   rm -rf data/store.db*
   ```

3. **Start the dev server**:
   ```bash
   npm run dev
   ```
   Server will run on http://localhost:3004

### For Vercel Deployment:

1. **Create a new Vercel project** (or update existing)
   - Go to https://vercel.com/dashboard
   - Create new project or select existing

2. **Create Blob Store** (for file uploads):
   - Go to Storage tab
   - Create Database → Blob
   - Name it (e.g., "learning-materials")
   - Copy the `BLOB_READ_WRITE_TOKEN`

3. **Set Environment Variables**:
   - Settings → Environment Variables
   - Add/Update:
     - `POSTGRES_URL` (your database connection string)
     - `ADMIN_USERNAME` (different from old project)
     - `ADMIN_PASSWORD` (different from old project)
     - `BLOB_READ_WRITE_TOKEN` (from Blob store)
   - Enable for: Production, Preview, Development

4. **Redeploy**:
   - Go to Deployments tab
   - Click "..." → "Redeploy"

## What Has Been Updated Automatically

✅ `package.json` - Project name changed to "ai-hackathon-platform"
✅ `package.json` - Port numbers changed (3004 dev, 3007 prod)
✅ `src/app/layout.tsx` - Title and description updated
✅ `README.md` - Project description updated

## What You Still Need to Do

- [ ] Create `.env.local` with new environment variables
- [ ] Update Vercel environment variables (if deploying)
- [ ] Clear/reset database files in `data/` folder (if using SQLite)
- [ ] Create new PostgreSQL database (if using separate database)
- [ ] Test admin login with new credentials
- [ ] Verify database connection works

## Security Notes

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use strong passwords** - Especially for `ADMIN_PASSWORD`
3. **Use different credentials** - Don't reuse credentials from the old project
4. **Database isolation** - Use separate databases for each project if possible

## Testing

After setup, test these endpoints:

1. **Health check**: `http://localhost:3004/api/health`
   - Should show environment variables status
   - Should show database connection status

2. **Admin login**: Use new `ADMIN_USERNAME` and `ADMIN_PASSWORD`

3. **Database**: Verify new database is being used (check tables are created)

## Troubleshooting

### Database Connection Error?
- Verify `POSTGRES_URL` is correct
- Check if database requires SSL (`?sslmode=require`)
- Ensure database is accessible from your network

### Admin Login Not Working?
- Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD` are set correctly
- Check `.env.local` file exists and has correct format
- Restart dev server after changing `.env.local`

### Port Already in Use?
- The ports have been changed to 3004 (dev) and 3007 (prod)
- If still conflicts, change ports in `package.json`

