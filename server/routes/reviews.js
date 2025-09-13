const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../database');
const { verifyToken } = require('./auth');

const router = express.Router();

// Get reviews for a movie
router.get('/movie/:movieId', async (req, res) => {
  try {
    const { movieId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const reviews = await new Promise((resolve, reject) => {
      db.all(`
        SELECT r.*, u.username 
        FROM reviews r 
        JOIN users u ON r.user_id = u.id 
        WHERE r.movie_id = ? 
        ORDER BY r.created_at DESC 
        LIMIT ? OFFSET ?
      `, [movieId, parseInt(limit), offset], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    // Get total count
    const totalCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM reviews WHERE movie_id = ?', [movieId], (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    res.json({ 
      reviews, 
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's reviews
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const reviews = await new Promise((resolve, reject) => {
      db.all(`
        SELECT r.*, m.title, m.poster_url 
        FROM reviews r 
        JOIN movies m ON r.movie_id = m.id 
        WHERE r.user_id = ? 
        ORDER BY r.created_at DESC 
        LIMIT ? OFFSET ?
      `, [userId, parseInt(limit), offset], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    // Get total count
    const totalCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM reviews WHERE user_id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    res.json({ 
      reviews, 
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or update review
router.post('/', verifyToken, [
  body('movieId').isInt().withMessage('Movie ID must be a number'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('reviewText').optional().isLength({ max: 1000 }).withMessage('Review text must be less than 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { movieId, rating, reviewText } = req.body;
    const userId = req.user.userId;

    // Check if movie exists
    const movie = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM movies WHERE id = ?', [movieId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Check if review already exists
    const existingReview = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM reviews WHERE movie_id = ? AND user_id = ?', [movieId, userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (existingReview) {
      // Update existing review
      const result = await new Promise((resolve, reject) => {
        db.run(`
          UPDATE reviews 
          SET rating = ?, review_text = ?, created_at = CURRENT_TIMESTAMP 
          WHERE movie_id = ? AND user_id = ?
        `, [rating, reviewText, movieId, userId], function(err) {
          if (err) reject(err);
          else resolve({ changes: this.changes });
        });
      });

      res.json({ message: 'Review updated successfully' });
    } else {
      // Create new review
      const result = await new Promise((resolve, reject) => {
        db.run(`
          INSERT INTO reviews (movie_id, user_id, rating, review_text) 
          VALUES (?, ?, ?, ?)
        `, [movieId, userId, rating, reviewText], function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID });
        });
      });

      res.status(201).json({ message: 'Review created successfully' });
    }
  } catch (error) {
    console.error('Create/update review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete review
router.delete('/:movieId', verifyToken, async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.userId;

    const result = await new Promise((resolve, reject) => {
      db.run('DELETE FROM reviews WHERE movie_id = ? AND user_id = ?', [movieId, userId], function(err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    });

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's review for a specific movie
router.get('/user/:userId/movie/:movieId', async (req, res) => {
  try {
    const { userId, movieId } = req.params;

    const review = await new Promise((resolve, reject) => {
      db.get(`
        SELECT r.*, u.username 
        FROM reviews r 
        JOIN users u ON r.user_id = u.id 
        WHERE r.movie_id = ? AND r.user_id = ?
      `, [movieId, userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ review });
  } catch (error) {
    console.error('Get user review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
