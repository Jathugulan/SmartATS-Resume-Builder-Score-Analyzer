const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const env = require('./config/env');
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const resumeCrudRoutes = require('./routes/resumeCrudRoutes');
const profileRoutes = require('./routes/profileRoutes');
const builderRoutes = require('./routes/builderRoutes');
const templateRoutes = require('./routes/templateRoutes');
const intelligenceRoutes = require('./routes/intelligenceRoutes');
const versionRoutes = require('./routes/versionRoutes');
const { standardLimiter } = require('./middleware/rateLimiter');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const { successResponse } = require('./utils/response');

const app = express();

// Security HTTP Headers
app.use(helmet());

// Cross-Origin Resource Sharing
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parsing Middleware
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Global Rate Limiting
app.use('/api', standardLimiter);

// Health Check Endpoint (Public)
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  return successResponse(res, {
    status: 'ok',
    environment: env.NODE_ENV,
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeCrudRoutes);   // SmartATS Resume CRUD + Analysis
app.use('/api/profile', profileRoutes);       // SmartATS User Profile
app.use('/api/resume', resumeRoutes);
app.use('/api/builder', builderRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/intelligence', intelligenceRoutes);
app.use('/api/versions', versionRoutes);

// 404 Catch-all handler
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;
