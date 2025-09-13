import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import './FilterBar.css';

const FilterBar = ({ filters, onFilterChange, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const [genres, setGenres] = useState([]);
  const [years, setYears] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchGenres();
    fetchYears();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await axios.get('/api/movies/genres/list');
      setGenres(response.data.genres);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchYears = async () => {
    try {
      const response = await axios.get('/api/movies/years/list');
      setYears(response.data.years);
    } catch (error) {
      console.error('Error fetching years:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const clearFilters = () => {
    setSearchTerm('');
    onFilterChange({
      search: '',
      genre: '',
      year: '',
      sortBy: 'title',
      order: 'ASC'
    });
  };

  const hasActiveFilters = filters.genre || filters.year || filters.sortBy !== 'title' || filters.order !== 'ASC';

  return (
    <div className="filter-bar">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-container">
          {/* <FaSearch className="search-icon" /> */}
          <input
            type="text"
            placeholder="Search movies, directors, or descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>

      <div className="filter-controls">
        <button
          className={`filter-toggle ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter className="filter-icon" />
          Filters
          {hasActiveFilters && <span className="filter-badge"></span>}
        </button>

        {hasActiveFilters && (
          <button onClick={clearFilters} className="clear-filters">
            <FaTimes className="clear-icon" />
            Clear
          </button>
        )}
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label className="filter-label">Genre</label>
            <select
              value={filters.genre}
              onChange={(e) => handleFilterChange('genre', e.target.value)}
              className="filter-select"
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Year</label>
            <select
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              className="filter-select"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="filter-select"
            >
              <option value="title">Title</option>
              <option value="year">Year</option>
              <option value="imdb_rating">Rating</option>
              <option value="created_at">Date Added</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Order</label>
            <select
              value={filters.order}
              onChange={(e) => handleFilterChange('order', e.target.value)}
              className="filter-select"
            >
              <option value="ASC">Ascending</option>
              <option value="DESC">Descending</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
