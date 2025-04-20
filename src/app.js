const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Routes
const authRouter = require('./routes/auth.route');
const categoryRouter = require('./routes/category.route');
const taskRouter = require('./routes/task.route');
const analyticsRouter = require('./routes/analytics.route');

// Swagger documentation
const swaggerDocs = require('./config/swagger');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// API Documentation
app.use('/api-docs', swaggerDocs.serve, swaggerDocs.setup);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/analytics', analyticsRouter);

// Error handling middleware
app.use((err, _req, res) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
