import { useState, useEffect, useRef } from 'react';
import { geocodeAddress, findTreesNearLocation, getAddressSuggestions } from '../../utils/searchUtils';
import './AddressSearch.css';

function AddressSearch({ trees, onSearch }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    // Update suggestions when query changes
    if (query.length >= 2) {
      const newSuggestions = getAddressSuggestions(query, trees, 5);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, trees]);

  useEffect(() => {
    // Close suggestions when clicking outside
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery) => {
    setIsSearching(true);

    // Geocode the address
    const location = geocodeAddress(searchQuery, trees);

    if (location) {
      // Find trees near the location (within 1km)
      const nearbyTrees = findTreesNearLocation(
        trees,
        location.lat,
        location.lng,
        1
      );

      onSearch(nearbyTrees, [location.lat, location.lng]);
    } else {
      // No location found, show all trees
      onSearch([], null);
    }

    setIsSearching(false);
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      handleSearch(query);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch([], null);
  };

  return (
    <div className="search-container" ref={searchRef}>
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-wrapper">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search by district, neighborhood, or address..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          />
          {query && (
            <button
              type="button"
              className="clear-button"
              onClick={handleClear}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            type="submit"
            className="search-button"
            disabled={isSearching || !query.trim()}
          >
            Search
          </button>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}

export default AddressSearch;
