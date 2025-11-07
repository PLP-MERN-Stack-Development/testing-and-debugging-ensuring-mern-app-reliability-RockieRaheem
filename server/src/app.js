// Express App Configuration

const express = require('express');
const cors = require('cors');
require('express-async-errors');

const { requestLogger, addStartTime, performanceMonitor } = require('./middleware/requestLogger');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging and monitoring
app.use(addStartTime);
app.use(requestLogger);
app.use(performanceMonitor);

// Health check route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
