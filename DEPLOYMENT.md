# Deployment Guide

## Railway Deployment

### Prerequisites
- Railway account (https://railway.app)
- GitHub repository connected to Railway
- MongoDB instance (Railway MongoDB service or MongoDB Atlas)

### Step 1: Deploy Backend API

1. Create a new Railway project
2. Add MongoDB service:
   - Option A: Use Railway's MongoDB service (recommended for simplicity)
   - Option B: Use MongoDB Atlas (get connection string)
3. Add a new service from GitHub repository
4. Set root directory to `apps/api`
5. Configure environment variables:
   ```
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<generate-a-secure-random-string>
   PORT=3001
   ```
6. Railway will automatically:
   - Install dependencies (`pnpm install`)
   - Build the project (`pnpm build`)
   - Start the server (`pnpm start`)

### Step 2: Deploy Frontend

1. In the same Railway project, add another service
2. Set root directory to `apps/web`
3. Configure environment variables:
   ```
   VITE_API_URL=https://your-api-service.railway.app/api
   ```
4. Railway will build and deploy the frontend

### Step 3: Seed Database

After deployment, you can seed the database by:

1. SSH into the backend service (Railway provides this)
2. Run: `pnpm seed`

Or use Railway's CLI:
```bash
railway run --service api pnpm seed
```

### Step 4: Configure Custom Domains (Optional)

1. In Railway dashboard, go to your service
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Railway will provide DNS records to configure

## Environment Variables Reference

### Backend (`apps/api`)
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | Secret for JWT token signing | Yes | - |
| `PORT` | Server port | No | 3001 |

### Frontend (`apps/web`)
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API URL | Yes (production) | `/api` (dev) |

## Troubleshooting

### Backend Issues

**MongoDB Connection Failed**
- Verify `MONGODB_URI` is correct
- Check MongoDB service is running
- Ensure IP whitelist allows Railway IPs (if using MongoDB Atlas)

**Build Fails**
- Check Node.js version (should be 18+)
- Verify all dependencies are in `package.json`
- Check build logs for specific errors

### Frontend Issues

**API Calls Fail**
- Verify `VITE_API_URL` points to correct backend URL
- Check CORS settings in backend
- Verify backend is running and accessible

**Build Fails**
- Check for TypeScript errors: `pnpm build` locally first
- Verify all environment variables are set

## Monitoring

Railway provides:
- Real-time logs
- Metrics dashboard
- Error tracking
- Automatic restarts on failure

## Scaling

Railway automatically scales based on traffic. For production:
- Consider using Railway's Pro plan for better performance
- Set up monitoring alerts
- Configure backup strategies for MongoDB



