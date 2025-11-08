import { useState, useEffect, useRef } from 'react';
import { geocodeAddress, findTreesNearLocation, getAddressSuggestions } from '../../utils/searchUtils';
import './AddressSearch.css';

function AddressSearch({ trees, onSearch, onRequestSupport }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');
  const searchRef = useRef(null);

  useEffect(() => {
    // Update suggestions when query changes
    if (query.length >= 1) {
      const newSuggestions = getAddressSuggestions(query, trees, 10);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
      setSearchMessage(''); // Clear any previous search messages
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSearchMessage('');
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
    setSearchMessage('');

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

      if (nearbyTrees.length > 0) {
        onSearch(nearbyTrees, [location.lat, location.lng]);
        setSearchMessage(`${nearbyTrees.length}개의 나무를 찾았습니다`);
      } else {
        onSearch([], [location.lat, location.lng]);
        setSearchMessage('해당 지역에서 나무를 찾을 수 없습니다');
      }
    } else {
      // No location found
      onSearch([], null);
      setSearchMessage('검색 결과가 없습니다');
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
    setSearchMessage('');
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
          <button
            type="button"
            className="request-button"
            onClick={onRequestSupport}
          >
            Request Support
          </button>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && (
          <div className="suggestions-dropdown">
            {suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
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
              ))
            ) : (
              query.length >= 1 && (
                <div className="no-suggestions">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                  <span>검색 결과가 없습니다</span>
                </div>
              )
            )}
          </div>
        )}

        {/* Search result message */}
        {searchMessage && (
          <div className={`search-message ${searchMessage.includes('없습니다') ? 'error' : 'success'}`}>
            {searchMessage}
          </div>
        )}
      </form>
    </div>
  );
}

export default AddressSearch;
