import React, { useState } from 'react';
import axios from 'axios';
import { FaStar, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import './ReviewForm.css';

const ReviewForm = ({ movieId, userReview, onReviewSubmit }) => {
  const [rating, setRating] = useState(userReview?.rating || 0);
  const [reviewText, setReviewText] = useState(userReview?.review_text || '');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleStarClick = (starRating) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating) => {
    setHoveredStar(starRating);
  };

  const handleStarLeave = () => {
    setHoveredStar(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('/api/reviews', {
        movieId: parseInt(movieId),
        rating,
        reviewText: reviewText.trim()
      });

      setSuccess(userReview ? 'Review updated successfully!' : 'Review submitted successfully!');
      onReviewSubmit();
      
      // Clear form if it's a new review
      if (!userReview) {
        setRating(0);
        setReviewText('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!userReview) return;
    
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.delete(`/api/reviews/${movieId}`);
      setSuccess('Review deleted successfully!');
      onReviewSubmit();
      
      // Clear form
      setRating(0);
      setReviewText('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete review');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    const displayRating = hoveredStar || rating;

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`star ${i <= displayRating ? 'active' : ''}`}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarHover(i)}
          onMouseLeave={handleStarLeave}
        />
      );
    }

    return stars;
  };

  return (
    <div className="review-form">
      <div className="review-form-header">
        <h3>
          {userReview ? (
            <>
              <FaEdit className="header-icon" />
              Edit Your Review
            </>
          ) : (
            'Write a Review'
          )}
        </h3>
        {userReview && (
          <button
            onClick={handleDelete}
            className="delete-button"
            disabled={loading}
          >
            <FaTimes className="button-icon" />
            Delete Review
          </button>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="review-form-content">
        <div className="rating-section">
          <label className="rating-label">Your Rating</label>
          <div className="star-rating">
            {renderStars()}
            <span className="rating-text">
              {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'No rating'}
            </span>
          </div>
        </div>

        <div className="review-text-section">
          <label htmlFor="reviewText" className="review-text-label">
            Your Review (Optional)
          </label>
          <textarea
            id="reviewText"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="review-textarea"
            placeholder="Share your thoughts about this movie..."
            rows="4"
            maxLength="1000"
          />
          <div className="character-count">
            {reviewText.length}/1000 characters
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={loading || rating === 0}
          >
            {loading ? (
              <div className="button-spinner"></div>
            ) : (
              <>
                <FaSave className="button-icon" />
                {userReview ? 'Update Review' : 'Submit Review'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
