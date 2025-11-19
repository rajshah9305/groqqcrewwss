# Vercel Environment Variables Configuration

This document outlines all environment variables required for deploying this project to Vercel.

## Required Environment Variables

### 1. `DATABASE_URL`
**Type:** Production, Preview, Development  
**Description:** PostgreSQL database connection string  
**Format:** `postgresql://user:password@host:port/database?sslmode=require`  
**Example:**
```
postgresql://neondb_owner:password@ep-soft-snow-ahu9ir08-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```
**Note:** This is required for database operations. Use your Neon PostgreSQL connection string.

### 2. `GROQ_API_KEY`
**Type:** Production, Preview, Development  
**Description:** API key for Groq service (used by CrewAI)  
**Format:** `gsk_...`  
**Example:**
```
gsk_YOUR_GROQ_API_KEY_HERE
```
**Note:** Required for CrewAI NLP task processing. Get your key from [Groq Console](https://console.groq.com/).

## Optional Environment Variables

### 3. `OPENAI_API_KEY`
**Type:** Production, Preview, Development  
**Description:** Dummy OpenAI API key to prevent CrewAI from defaulting to OpenAI  
**Value:** `dummy-key-to-disable-openai`  
**Note:** This prevents CrewAI from trying to use OpenAI as a fallback. You can set this to any dummy value.

### 4. `NODE_ENV`
**Type:** Automatically set by Vercel  
**Description:** Node.js environment  
**Value:** `production` (automatically set)  
**Note:** Vercel automatically sets this to `production` during builds.

### 5. `BUILT_IN_FORGE_API_URL` (Optional)
**Type:** Production, Preview, Development  
**Description:** Alternative LLM API URL  
**Note:** Only needed if using the built-in Forge API instead of Groq.

### 6. `BUILT_IN_FORGE_API_KEY` (Optional)
**Type:** Production, Preview, Development  
**Description:** Alternative LLM API key  
**Note:** Only needed if using the built-in Forge API instead of Groq.

### 7. `VITE_APP_TITLE` (Optional)
**Type:** Production, Preview, Development  
**Description:** Application title displayed in the UI  
**Default:** `"App"`  
**Example:**
```
Groq CrewAI Platform
```

## How to Set Environment Variables in Vercel

### Via Vercel Dashboard:

1. Go to your project on [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - **Key:** Variable name (e.g., `DATABASE_URL`)
   - **Value:** Variable value
   - **Environment:** Select which environments to apply to:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
4. Click **Save**

### Via Vercel CLI:

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Set environment variables
vercel env add DATABASE_URL production
vercel env add GROQ_API_KEY production
vercel env add OPENAI_API_KEY production

# Pull environment variables to local .env file
vercel env pull .env.local
```

### Example Commands:

```bash
# Set DATABASE_URL for all environments
vercel env add DATABASE_URL

# Set GROQ_API_KEY for production only
vercel env add GROQ_API_KEY production

# Set OPENAI_API_KEY for all environments
vercel env add OPENAI_API_KEY
```

## Environment Variable Checklist

Before deploying, ensure you have:

- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `GROQ_API_KEY` - Groq API key for CrewAI
- [ ] `OPENAI_API_KEY` - Dummy key (optional but recommended)
- [ ] `NODE_ENV` - Automatically set by Vercel

## Security Notes

⚠️ **Important:**
- Never commit `.env` files to git
- Use Vercel's environment variables for sensitive data
- Rotate API keys regularly
- Use different keys for production, preview, and development environments
- The `.gitignore` file already excludes `.env` files

## Testing Environment Variables

After setting environment variables, you can verify they're working:

1. Deploy to a preview environment
2. Check the build logs for any missing variable errors
3. Test the application functionality:
   - Database connections
   - Groq API calls
   - CrewAI task execution

## Troubleshooting

### Error: "DATABASE_URL is required"
- Ensure `DATABASE_URL` is set in Vercel environment variables
- Check that it's enabled for the correct environment (Production/Preview/Development)
- Verify the connection string format is correct

### Error: "GROQ_API_KEY environment variable is required"
- Ensure `GROQ_API_KEY` is set in Vercel
- Verify the API key is valid and not expired
- Check that it's enabled for the correct environment

### Error: "Fallback to LiteLLM is not available"
- Ensure `OPENAI_API_KEY` is set (even as a dummy value)
- This prevents CrewAI from trying to use OpenAI as default

## Additional Resources

- [Vercel Environment Variables Documentation](https://vercel.com/docs/concepts/projects/environment-variables)
- [Groq API Documentation](https://console.groq.com/docs)
- [Neon PostgreSQL Documentation](https://neon.tech/docs)

