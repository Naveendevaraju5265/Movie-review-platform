import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaStar, FaCalendarAlt, FaUser, FaFilm } from 'react-icons/fa';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userReview, setUserReview] = useState(null);

  useEffect(() => {
    fetchMovie();
    if (user) {
      fetchUserReview();
    }
  }, [id, user]);

  const fetchMovie = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/movies/${id}`);
      setMovie(response.data);
    } catch (err) {
      setError('Failed to fetch movie details');
      console.error('Error fetching movie:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReview = async () => {
    try {
      const response = await axios.get(`/api/reviews/user/${user.id}/movie/${id}`);
      setUserReview(response.data.review);
    } catch (err) {
      // User hasn't reviewed this movie yet
      setUserReview(null);
    }
  };

  const handleReviewSubmit = () => {
    // Refresh user review after submission
    if (user) {
      fetchUserReview();
    }
    // Refresh movie data to update average rating
    fetchMovie();
  };

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

  if (loading) {
    return <LoadingSpinner message="Loading movie details..." />;
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          {error}
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container">
        <div className="empty-state">
          <h3>Movie not found</h3>
          <p>The movie you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-detail-page">
      <div className="container">
        <div className="movie-detail">
          <div className="movie-detail-header">
            <div className="movie-poster-container">
              <img
                src={movie.poster_url || 'https://via.placeholder.com/300x450/cccccc/666666?text=No+Image'}
                alt={movie.title}
                className="movie-detail-poster"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x450/cccccc/666666?text=No+Image';
                }}
              />
            </div>

            <div className="movie-detail-info">
              <h1 className="movie-detail-title">{movie.title}</h1>
              
              <div className="movie-detail-meta">
                <div className="meta-item">
                  <FaCalendarAlt className="meta-icon" />
                  {movie.year}
                </div>
                {movie.director && (
                  <div className="meta-item">
                    <FaUser className="meta-icon" />
                    {movie.director}
                  </div>
                )}
                {movie.genre && (
                  <div className="meta-item">
                    <FaFilm className="meta-icon" />
                    {movie.genre}
                  </div>
                )}
              </div>

              <div className="movie-detail-rating">
                <div className="rating-stars">
                  {renderStars(movie.average_rating || movie.imdb_rating || 0)}
                </div>
                <div className="rating-info">
                  <span className="rating-value">
                    {(movie.average_rating || movie.imdb_rating || 0).toFixed(1)}
                  </span>
                  <span className="rating-label">
                    {movie.review_count > 0 
                      ? `(${movie.review_count} review${movie.review_count !== 1 ? 's' : ''})`
                      : 'No reviews yet'
                    }
                  </span>
                </div>
              </div>

              {movie.description && (
                <div className="movie-detail-description">
                  <h3>Description</h3>
                  <p>{movie.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {user && (
          <ReviewForm
            movieId={movie.id}
            userReview={userReview}
            onReviewSubmit={handleReviewSubmit}
          />
        )}

        <ReviewList movieId={movie.id} />
      </div>
    </div>
  );
};

export default MovieDetail;
