const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const pointRoutes = require('./routes/pointRoutes');
const { getIo } = require('./socket');

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:3000", // local dev
  "https://leaderboard-app-ochre-omega.vercel.app",
  process.env.FRONTEND_ORIGIN // your deployed frontend
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Database connection
connectDB();

// Add io to request object
app.use((req, res, next) => {
  req.io = getIo();
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/points', pointRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

module.exports = app;