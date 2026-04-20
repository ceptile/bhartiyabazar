import React, { useState, useRef, useEffect } from 'react';

const PROBLEM_SUGGESTIONS = [
  "AC not cooling", "water pipe leaking", "door lock broken", "laptop screen cracked",
  "car battery dead", "tooth pain", "back pain physiotherapy", "need wedding photographer",
  "logo design needed", "tax filing help", "visa application", "laptop not starting",
  "roof leaking", "furniture repair", "clothes tailoring", "catering for 200 people",
  "eye checkup near me", "baby vaccination", "blood test at home", "courier same day",
];

const SmartSearch = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const inputRef = useRef();

  useEffect(() => {
    if (query.length > 1) {
      setFiltered(PROBLEM_SUGGESTIONS.filter(s => s.toLowerCase().includes(query.toLowerCase())).slice(0, 6));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [query]);

  const handleSearch = (val) => {
    const q = val || query;
    setQuery(q);
    setShowSuggestions(false);
    if (onSearch) onSearch(q);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div className="input-group input-group-lg">
        <span className="input-group-text bg-white border-end-0">
          <i className="fas fa-search text-muted"></i>
        </span>
        <input
          ref={inputRef}
          type="text"
          className="form-control border-start-0 ps-0"
          placeholder='Describe your problem — "AC not cooling", "need a dentist"...'
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          onFocus={() => query.length > 1 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          autoComplete="off"
        />
        <button className="btn btn-primary px-4" onClick={() => handleSearch()}>
          Search
        </button>
      </div>
      {showSuggestions && filtered.length > 0 && (
        <div className="position-absolute w-100 bg-white border rounded shadow mt-1 z-3" style={{ zIndex: 1000 }}>
          {filtered.map((s, i) => (
            <div
              key={i}
              className="px-3 py-2 d-flex align-items-center gap-2"
              style={{ cursor: 'pointer', fontSize: '14px', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f8f9fa'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}
              onMouseDown={() => handleSearch(s)}
            >
              <i className="fas fa-lightbulb text-warning" style={{ fontSize: '12px' }}></i>
              {s}
            </div>
          ))}
          <div className="px-3 py-2 border-top" style={{ fontSize: '12px', color: '#6b7280' }}>
            <i className="fas fa-info-circle me-1"></i>
            Describe your problem — we find the right business for you
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartSearch;