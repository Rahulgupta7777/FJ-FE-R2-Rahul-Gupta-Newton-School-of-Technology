const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rides', require('./routes/rideRoutes'));

// Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is running successfully!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Prevent process from exiting prematurely
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
});
