# Quick Vercel Environment Variables Setup

## Minimum Required Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

### 1. DATABASE_URL
```
postgresql://neondb_owner:YOUR_PASSWORD@ep-soft-snow-ahu9ir08-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```
Replace `YOUR_PASSWORD` with your actual Neon database password.

### 2. GROQ_API_KEY
```
gsk_YOUR_GROQ_API_KEY_HERE
```
Use your actual Groq API key from [Groq Console](https://console.groq.com/).

### 3. OPENAI_API_KEY (Optional but recommended)
```
dummy-key-to-disable-openai
```
This prevents CrewAI from trying to use OpenAI.

## Vercel CLI Commands

```bash
# Set all required variables
vercel env add DATABASE_URL
vercel env add GROQ_API_KEY
vercel env add OPENAI_API_KEY
```

Make sure to enable them for:
- ✅ Production
- ✅ Preview  
- ✅ Development

## After Setting Variables

1. Redeploy your project
2. Check build logs for any errors
3. Test the application functionality
