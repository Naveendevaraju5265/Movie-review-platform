import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import './Home.css';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    genre: '',
    year: '',
    sortBy: 'title',
    order: 'ASC'
  });

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.genre) params.append('genre', filters.genre);
      if (filters.year) params.append('year', filters.year);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.order) params.append('order', filters.order);

      const response = await axios.get(`/api/movies?${params.toString()}`);
      setMovies(response.data.movies);
    } catch (err) {
      setError('Failed to fetch movies. Please try again.');
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    
    // Update URL params
    const newSearchParams = new URLSearchParams();
    if (newFilters.search) newSearchParams.set('search', newFilters.search);
    if (newFilters.genre) newSearchParams.set('genre', newFilters.genre);
    if (newFilters.year) newSearchParams.set('year', newFilters.year);
    if (newFilters.sortBy) newSearchParams.set('sortBy', newFilters.sortBy);
    if (newFilters.order) newSearchParams.set('order', newFilters.order);
    
    setSearchParams(newSearchParams);
  };

  const handleSearch = (searchTerm) => {
    handleFilterChange({ search: searchTerm });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="home">
      <div className="header">
        <div className="container">
          <h1>Discover Amazing Movies</h1>
          <p>Find, rate, and review your favorite films</p>
        </div>
      </div>

      <div className="container">
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {movies.length === 0 ? (
          <div className="empty-state">
            <h3>No movies found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="movies-grid">
            {movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
