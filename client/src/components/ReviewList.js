import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReviewCard from './ReviewCard';
import LoadingSpinner from './LoadingSpinner';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './ReviewList.css';

const ReviewList = ({ movieId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [movieId, currentPage]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/reviews/movie/${movieId}?page=${currentPage}&limit=10`);
      setReviews(response.data.reviews);
      setTotalPages(response.data.pagination.pages);
      setTotalReviews(response.data.pagination.total);
    } catch (err) {
      setError('Failed to fetch reviews');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <LoadingSpinner message="Loading reviews..." />;
  }

  if (error) {
    return (
      <div className="error">
        {error}
      </div>
    );
  }

  return (
    <div className="review-list">
      <div className="review-list-header">
        <h3>Reviews ({totalReviews})</h3>
        {totalReviews > 0 && (
          <div className="review-stats">
            Showing {((currentPage - 1) * 10) + 1}-{Math.min(currentPage * 10, totalReviews)} of {totalReviews} reviews
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="empty-reviews">
          <h4>No reviews yet</h4>
          <p>Be the first to review this movie!</p>
        </div>
      ) : (
        <>
          <div className="reviews-container">
            {reviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-button prev-button"
              >
                <FaChevronLeft className="button-icon" />
                Previous
              </button>

              <div className="pagination-numbers">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`pagination-button number-button ${
                        currentPage === pageNumber ? 'active' : ''
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-button next-button"
              >
                Next
                <FaChevronRight className="button-icon" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewList;
