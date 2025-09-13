import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaCalendarAlt, FaUser } from 'react-icons/fa';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star full" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="star half" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="star empty" />);
    }

    return stars;
  };

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <div className="movie-poster-container">
        <img
          src={movie.poster_url || 'https://via.placeholder.com/300x450/cccccc/666666?text=No+Image'}
          alt={movie.title}
          className="movie-poster"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x450/cccccc/666666?text=No+Image';
          }}
        />
        <div className="movie-overlay">
          <div className="movie-rating">
            {renderStars(movie.average_rating || movie.imdb_rating || 0)}
            <span className="rating-text">
              {(movie.average_rating || movie.imdb_rating || 0).toFixed(1)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        
        <div className="movie-meta">
          <div className="movie-year">
            <FaCalendarAlt className="meta-icon" />
            {movie.year}
          </div>
          {movie.director && (
            <div className="movie-director">
              <FaUser className="meta-icon" />
              {movie.director}
            </div>
          )}
        </div>

        {movie.genre && (
          <div className="movie-genre">
            {movie.genre}
          </div>
        )}

        {movie.description && (
          <p className="movie-description">
            {movie.description.length > 120 
              ? `${movie.description.substring(0, 120)}...` 
              : movie.description
            }
          </p>
        )}

        {movie.review_count > 0 && (
          <div className="movie-review-count">
            {movie.review_count} review{movie.review_count !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </Link>
  );
};

export default MovieCard;
