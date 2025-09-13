const express = require('express');
const { db } = require('../database');

const router = express.Router();

// Get all movies with optional search and filter
router.get('/', async (req, res) => {
  try {
    const { search, genre, year, sortBy = 'title', order = 'ASC' } = req.query;
    
    let query = 'SELECT * FROM movies';
    let params = [];
    let conditions = [];

    // Add search condition
    if (search) {
      conditions.push('(title LIKE ? OR director LIKE ? OR description LIKE ?)');
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Add genre filter
    if (genre) {
      conditions.push('genre = ?');
      params.push(genre);
    }

    // Add year filter
    if (year) {
      conditions.push('year = ?');
      params.push(parseInt(year));
    }

    // Add WHERE clause if conditions exist
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Add ORDER BY clause
    const validSortFields = ['title', 'year', 'imdb_rating', 'created_at'];
    const validOrders = ['ASC', 'DESC'];
    
    if (validSortFields.includes(sortBy) && validOrders.includes(order.toUpperCase())) {
      query += ` ORDER BY ${sortBy} ${order.toUpperCase()}`;
    }

    const movies = await new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json({ movies });
  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get movie by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM movies WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Get average rating and review count
    const ratingStats = await new Promise((resolve, reject) => {
      db.get(`
        SELECT 
          AVG(rating) as average_rating, 
          COUNT(*) as review_count 
        FROM reviews 
        WHERE movie_id = ?
      `, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    res.json({ 
      ...movie, 
      average_rating: ratingStats.average_rating || 0,
      review_count: ratingStats.review_count || 0
    });
  } catch (error) {
    console.error('Get movie error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get unique genres
router.get('/genres/list', async (req, res) => {
  try {
    const genres = await new Promise((resolve, reject) => {
      db.all('SELECT DISTINCT genre FROM movies WHERE genre IS NOT NULL ORDER BY genre', (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map(row => row.genre));
      });
    });

    res.json({ genres });
  } catch (error) {
    console.error('Get genres error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get unique years
router.get('/years/list', async (req, res) => {
  try {
    const years = await new Promise((resolve, reject) => {
      db.all('SELECT DISTINCT year FROM movies WHERE year IS NOT NULL ORDER BY year DESC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map(row => row.year));
      });
    });

    res.json({ years });
  } catch (error) {
    console.error('Get years error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
