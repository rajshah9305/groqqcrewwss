# Deployment Guide

## Vercel Deployment

### Prerequisites
- Vercel account (https://vercel.com)
- GitHub repository connected to Vercel
- Environment variables configured

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rajshah9305/Groqcrewai)

### Manual Deployment Steps

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Environment Variables

Configure these in your Vercel project settings:

#### Required Variables
```env
# Database
DATABASE_URL=mysql://user:password@host:port/database

# Groq API
GROQ_API_KEY=your_groq_api_key

# Authentication (Manus OAuth)
JWT_SECRET=your_jwt_secret
OAUTH_SERVER_URL=https://api.manus.im
VITE_APP_ID=your_app_id
VITE_OAUTH_PORTAL_URL=https://auth.manus.im
OWNER_OPEN_ID=your_owner_open_id
OWNER_NAME=your_name

# Built-in Services
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your_forge_api_key
VITE_FRONTEND_FORGE_API_KEY=your_frontend_forge_key
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im

# App Configuration
VITE_APP_TITLE=CrewAI NLP Platform
VITE_APP_LOGO=/logo.svg
VITE_ANALYTICS_ENDPOINT=your_analytics_endpoint
VITE_ANALYTICS_WEBSITE_ID=your_website_id
```

### Build Configuration

Vercel will automatically detect the project configuration. The build process:

1. **Install dependencies**: `pnpm install`
2. **Build client**: `pnpm build` (builds React app)
3. **Start server**: Vercel serverless functions handle the backend

### Python Dependencies

For Python CrewAI service, add a `requirements.txt` in the project root:

```txt
crewai==0.1.0
crewai-tools==0.1.0
groq==0.4.0
```

Vercel will automatically install Python dependencies if detected.

### Domain Configuration

1. Go to your Vercel project settings
2. Navigate to **Domains**
3. Add your custom domain
4. Update DNS records as instructed

### Database Setup

1. Create a MySQL/TiDB database
2. Add `DATABASE_URL` to Vercel environment variables
3. Run migrations:
   ```bash
   pnpm db:push
   ```

### Monitoring

- **Logs**: View in Vercel dashboard under "Deployments"
- **Analytics**: Built-in Vercel Analytics
- **Errors**: Automatic error tracking in Vercel

### Troubleshooting

#### Build Fails
- Check environment variables are set
- Verify `pnpm-lock.yaml` is committed
- Review build logs in Vercel dashboard

#### Database Connection Issues
- Verify `DATABASE_URL` format
- Check database allows connections from Vercel IPs
- Enable SSL if required by your database

#### Python Service Issues
- Ensure `requirements.txt` is in project root
- Check Python version compatibility (3.11+)
- Verify Groq API key is valid

### Alternative Deployment Options

#### Docker Deployment
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Traditional VPS
1. Clone repository
2. Install dependencies: `pnpm install`
3. Set up environment variables
4. Build: `pnpm build`
5. Start with PM2: `pm2 start npm --name "crewai-nlp" -- start`

### Performance Optimization

- Enable Vercel Edge Network for faster global delivery
- Configure caching headers for static assets
- Use Vercel's Image Optimization for images
- Enable compression in production

### Security Checklist

- ✅ Environment variables stored securely in Vercel
- ✅ API keys never committed to repository
- ✅ HTTPS enabled by default on Vercel
- ✅ CORS configured properly
- ✅ Database credentials encrypted
- ✅ Rate limiting enabled

### Support

For deployment issues:
- Vercel Documentation: https://vercel.com/docs
- GitHub Issues: https://github.com/rajshah9305/Groqcrewai/issues
- Manus Support: https://help.manus.im
