import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReviewCard from '../components/ReviewCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaUser, FaCalendarAlt, FaStar, FaSignOutAlt } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUserReviews();
  }, [user, navigate, currentPage]);

  const fetchUserReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/reviews/user/${user.id}?page=${currentPage}&limit=10`);
      setReviews(response.data.reviews);
      setTotalPages(response.data.pagination.pages);
    } catch (err) {
      setError('Failed to fetch your reviews');
      console.error('Error fetching user reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-info">
            <div className="profile-avatar">
              <FaUser className="avatar-icon" />
            </div>
            <div className="profile-details">
              <h1 className="profile-username">{user.username}</h1>
              <p className="profile-email">{user.email}</p>
              <div className="profile-meta">
                <div className="meta-item">
                  <FaCalendarAlt className="meta-icon" />
                  Joined {new Date(user.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-button">
            <FaSignOutAlt className="button-icon" />
            Logout
          </button>
        </div>

        <div className="profile-content">
          <div className="reviews-section">
            <h2 className="section-title">Your Reviews</h2>
            
            {loading ? (
              <LoadingSpinner message="Loading your reviews..." />
            ) : error ? (
              <div className="error">
                {error}
              </div>
            ) : reviews.length === 0 ? (
              <div className="empty-state">
                <h3>No reviews yet</h3>
                <p>Start reviewing movies to see them here!</p>
              </div>
            ) : (
              <>
                <div className="reviews-grid">
                  {reviews.map(review => (
                    <ReviewCard key={review.id} review={review} showMovie={true} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="pagination-button"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="pagination-button"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
