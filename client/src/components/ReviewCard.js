import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaCalendarAlt, FaUser, FaFilm } from 'react-icons/fa';
import './ReviewCard.css';

const ReviewCard = ({ review, showMovie = false }) => {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`star ${i <= rating ? 'active' : ''}`}
        />
      );
    }
    return stars;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-user-info">
          <div className="user-avatar">
            <FaUser className="avatar-icon" />
          </div>
          <div className="user-details">
            <div className="user-name">{review.username}</div>
            <div className="review-date">
              <FaCalendarAlt className="date-icon" />
              {formatDate(review.created_at)}
            </div>
          </div>
        </div>
        
        <div className="review-rating">
          {renderStars(review.rating)}
        </div>
      </div>

      {showMovie && review.title && (
        <div className="review-movie">
          <Link to={`/movie/${review.movie_id}`} className="movie-link">
            <FaFilm className="movie-icon" />
            {review.title}
          </Link>
        </div>
      )}

      {review.review_text && (
        <div className="review-content">
          <p>{review.review_text}</p>
        </div>
      )}

      {!review.review_text && (
        <div className="review-content">
          <p className="no-text">No written review provided</p>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
