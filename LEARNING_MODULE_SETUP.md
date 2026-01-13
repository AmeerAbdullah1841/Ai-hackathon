# Learning Module with Multi-Tenant Support - Setup Guide

## Overview

The system now supports:
- **Super Admin**: Creates tenants/schools, uploads learning materials (PDFs/DOCs) to AI and Cyber Security modules
- **Tenant Admins**: Login with assigned credentials, view learning materials, manage their tenant's teams
- **Students/Users**: Access learning materials and challenges via tabs (Learning | Challenges)

## Environment Variables

### Required for File Upload (Vercel Blob)

Add to your `.env.local` and Vercel environment variables:

```bash
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

**To get the token:**
1. Go to Vercel Dashboard → Your Project → Storage
2. Create a Blob store (if not exists)
3. Copy the `BLOB_READ_WRITE_TOKEN` from the environment variables
4. Add it to your `.env.local` and Vercel project settings

### Existing Variables (Still Required)

```bash
POSTGRES_URL=your_postgres_connection_string
ADMIN_USERNAME=your_super_admin_username
ADMIN_PASSWORD=your_super_admin_password
```

## Database Schema

The following tables have been added/updated:

### New Tables
- `tenants` - Stores tenant/school information with admin credentials
- `learning_materials` - Stores learning material metadata (PDFs, DOCs)

### Updated Tables
- `teams` - Added `tenantId` column (nullable, for backward compatibility)
- `admin_sessions` - Added `adminType` ('super' or 'tenant') and `tenantId` columns

The schema will be automatically created on first database connection.

## User Flows

### Super Admin Flow

1. **Login**: Use `ADMIN_USERNAME` and `ADMIN_PASSWORD` at `/signin`
2. **Create Tenants**: 
   - Navigate to "Tenants" in sidebar
   - Create new tenant/school
   - System auto-generates admin credentials
   - Share credentials with tenant admin
3. **Upload Learning Materials**:
   - Navigate to "Learning Materials" in sidebar
   - Upload PDF/DOC/DOCX files
   - Select module: AI or Cyber Security
   - Files are stored in Vercel Blob

### Tenant Admin Flow

1. **Login**: Use tenant admin credentials (provided by super admin) at `/signin`
2. **View Learning Materials**: Can view all learning materials (read-only)
3. **Manage Teams**: 
   - Create teams for their tenant
   - Teams are automatically associated with their tenant
   - Can only see/manage their tenant's teams

### Student/User Flow

1. **Login**: Use team credentials at `/signin` (Team tab)
2. **Access Dashboard**: Navigate to team dashboard
3. **Tabs Available**:
   - **Challenges**: View and work on assigned challenges (existing functionality)
   - **Learning**: View learning materials organized by AI and Cyber Security modules
4. **Learning Materials**:
   - Filter by module (All, AI, Cyber Security)
   - View PDFs in browser
   - Download DOC/DOCX files

## API Routes

### Super Admin Only
- `GET /api/tenants` - List all tenants
- `POST /api/tenants` - Create tenant
- `GET /api/tenants/[tenantId]` - Get tenant details
- `DELETE /api/tenants/[tenantId]` - Delete tenant
- `POST /api/learning/upload` - Upload learning material
- `DELETE /api/learning/[materialId]` - Delete learning material

### All Authenticated Users
- `GET /api/learning` - List learning materials (optionally filtered by module)
- `GET /api/learning?module=ai` - List AI materials
- `GET /api/learning?module=cybersecurity` - List Cyber Security materials

### Tenant Admin
- `POST /api/tenant/login` - Tenant admin login
- `GET /api/teams` - List teams (filtered by tenant for tenant admin)
- `POST /api/teams` - Create team (auto-assigned to tenant for tenant admin)

## File Storage

- **Storage Provider**: Vercel Blob Storage
- **Supported Formats**: PDF, DOC, DOCX
- **Max File Size**: 10MB
- **Access**: Public URLs stored in database

## Migration Notes

- Existing teams will have `tenantId = NULL` (can be assigned later)
- Existing admin becomes super admin
- Database schema updates automatically on first connection

## Testing Checklist

- [ ] Super admin can create tenants
- [ ] Tenant admin can login with assigned credentials
- [ ] Tenant admin can create teams (auto-assigned to tenant)
- [ ] Tenant admin can only see their tenant's teams
- [ ] Super admin can upload learning materials
- [ ] All users can view learning materials
- [ ] Students can access Learning tab in dashboard
- [ ] Students can filter learning materials by module
- [ ] PDFs open in browser, DOC/DOCX download correctly

## Troubleshooting

### File Upload Fails
- Check `BLOB_READ_WRITE_TOKEN` is set correctly
- Verify file size is under 10MB
- Check file type is PDF, DOC, or DOCX

### Tenant Admin Can't See Teams
- Verify tenant admin is logged in (check session)
- Check teams have correct `tenantId`
- Verify API route is filtering correctly

### Learning Materials Not Showing
- Check database has `learning_materials` table
- Verify files were uploaded successfully
- Check API route returns data correctly


