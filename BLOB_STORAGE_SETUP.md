# Vercel Blob Storage Setup Guide

## Error: "Vercel Blob: No token found"

This error occurs when the `BLOB_READ_WRITE_TOKEN` environment variable is not configured.

## Quick Setup Steps

### Option 1: Use Vercel Blob (Recommended for Production)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project: `Ai-hackathon` (or your project name)

2. **Create Blob Store**
   - Go to **Storage** tab
   - Click **Create Database** → **Blob**
   - Give it a name (e.g., "learning-materials")
   - Click **Create**

3. **Get the Token**
   - After creating the Blob store, go to **Settings** → **Environment Variables**
   - Look for `BLOB_READ_WRITE_TOKEN`
   - Copy the token value

4. **Add to Local Development**
   - Open your `.env.local` file
   - Add the line:
     ```bash
     BLOB_READ_WRITE_TOKEN=vercel_blob_xxxxx_xxxxx_xxxxx
     ```
   - Replace `vercel_blob_xxxxx_xxxxx_xxxxx` with your actual token

5. **Add to Vercel Project**
   - In Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
   - Add `BLOB_READ_WRITE_TOKEN` with your token value
   - Enable for: **Production**, **Preview**, **Development**
   - Click **Save**

6. **Restart Dev Server**
   ```bash
   # Stop your dev server (Ctrl+C)
   npm run dev
   ```

### Option 2: Use Local File Storage (For Development Only)

If you want to test locally without Vercel Blob, you can modify the upload route to use local file storage. However, this is **NOT recommended for production**.

## Verify Setup

After adding the token:

1. Restart your dev server
2. Try uploading a file again
3. The upload should work without the token error

## Troubleshooting

### Token Not Working?
- Make sure you copied the **entire** token (it's long)
- Check there are no extra spaces or quotes
- Verify the token is in `.env.local` (not just `.env`)
- Restart the dev server after adding the token

### Still Getting Errors?
- Check Vercel Dashboard → Storage → Your Blob store is active
- Verify the token has read/write permissions
- Check server logs for more detailed error messages

## Important Notes

- **Never commit `.env.local`** - It's already in `.gitignore`
- **Token is sensitive** - Don't share it publicly
- **Production**: Always set the token in Vercel environment variables
- **Local Development**: Use `.env.local` file

