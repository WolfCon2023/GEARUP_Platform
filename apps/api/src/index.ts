import express, { type Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import moduleRoutes from './routes/modules.js';
import assignmentRoutes from './routes/assignments.js';
import progressRoutes from './routes/progress.js';
import alertRoutes from './routes/alerts.js';
import dashboardRoutes from './routes/dashboards.js';
import reportRoutes from './routes/reports.js';

dotenv.config();

const app: Express = express();
const port = Number(process.env.PORT ?? 3000);

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// Start server first (Railway expects us to listen on $PORT)
app.listen(port, '0.0.0.0', () => {
  console.log(`API listening on ${port}`);
});

// Connect to MongoDB (retry instead of crashing the process)
const MONGODB_URI = process.env.MONGODB_URI;
async function connectWithRetry() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not set. API will run but DB-backed routes will fail until it is configured.');
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error (will retry in 5s):', error);
    setTimeout(connectWithRetry, 5000);
  }
}
connectWithRetry();

export default app;



