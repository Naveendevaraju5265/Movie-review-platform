const express = require('express');
const cors = require('cors');
const { db, initDatabase } = require('./database');
const { router: authRoutes } = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const reviewRoutes = require('./routes/reviews');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Initialize database and start server
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
