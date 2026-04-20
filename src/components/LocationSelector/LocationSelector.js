import React, { useState, useEffect } from 'react';
import WORLD_LOCATIONS from '../../data/worldLocations';

const LocationSelector = ({ onSelect, defaultCountry = '', defaultState = '', defaultCity = '' }) => {
  const [country, setCountry] = useState(defaultCountry);
  const [state, setState] = useState(defaultState);
  const [city, setCity] = useState(defaultCity);

  const countries = Object.keys(WORLD_LOCATIONS).sort();
  const states = country ? Object.keys(WORLD_LOCATIONS[country] || {}).sort() : [];
  const cities = (country && state) ? (WORLD_LOCATIONS[country]?.[state] || []).sort() : [];

  useEffect(() => {
    if (onSelect) onSelect({ country, state, city });
  }, [country, state, city]);

  const handleCountry = (e) => {
    setCountry(e.target.value);
    setState('');
    setCity('');
  };

  const handleState = (e) => {
    setState(e.target.value);
    setCity('');
  };

  return (
    <div className="row">
      <div className="col-md-4 mb-3">
        <label className="form-label fw-semibold">Country</label>
        <select className="form-select" value={country} onChange={handleCountry}>
          <option value="">Select Country</option>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="col-md-4 mb-3">
        <label className="form-label fw-semibold">State / Province</label>
        <select className="form-select" value={state} onChange={handleState} disabled={!country}>
          <option value="">Select State</option>
          {states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="col-md-4 mb-3">
        <label className="form-label fw-semibold">City</label>
        <select className="form-select" value={city} onChange={e => setCity(e.target.value)} disabled={!state}>
          <option value="">Select City</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
    </div>
  );
};

export default LocationSelector;