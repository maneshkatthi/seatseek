const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const trainRoutes = require('./routes/trainRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', trainRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'SeatSeek API is running' });
});

// Error Handling
app.use(errorHandler);

module.exports = app;
