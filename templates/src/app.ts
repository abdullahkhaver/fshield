// src/app.ts
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import cors, { CorsOptionsDelegate } from 'cors';
import morgan from 'morgan';
import csrf from 'csurf';
import { ApiError } from './utils/apiError';
import { errorHandler } from './middlewares/error.middleware';
import { ApiResponse } from './utils/apiResponse';

const app = express();

// Logging
app.use(morgan('tiny'));

// Security Headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Cookie parsing
app.use(cookieParser());

// CORS setup
const whitelist = [process.env.ORIGIN || 'http://localhost:5173'];
const corsOptions: CorsOptionsDelegate = (origin, callback) => {
  if (!origin || whitelist.includes(origin)) {
    callback(null, true);
  } else {
    callback(new Error('CORS not allowed'));
  }
};
app.use(cors({ origin: corsOptions, credentials: true }));

// CSRF Protection (optional)
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  },
});

// CSRF Token endpoint
app.get('/api/csrf-token', csrfProtection, (req: Request, res: Response) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Routes
app.get('/api/healthcheck', (req: Request, res: Response) => {
  return res.status(200).json(new ApiResponse(200, 'API is healthy'));
});

// 404 handler
app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(404, 'Route not found'));
});

// Global Error handler
app.use(errorHandler);

export default app;
