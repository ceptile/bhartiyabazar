import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { listAllSuppliers } from '../../actions/supplierProduct';

const HyperlocalSearch = ({ onResults }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [radius, setRadius] = useState(5);
  const [error, setError] = useState('');

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        dispatch(listAllSuppliers({ lat: latitude, lng: longitude, radius }));
        setLoading(false);
        if (onResults) onResults({ lat: latitude, lng: longitude, radius });
      },
      () => {
        setError('Unable to get your location. Please enable location access.');
        setLoading(false);
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="d-flex align-items-center gap-2 flex-wrap">
      <button className="btn btn-outline-primary d-flex align-items-center gap-2" onClick={handleNearMe} disabled={loading}>
        {loading
          ? <><span className="spinner-border spinner-border-sm"></span> Locating...</>
          : <><i className="fas fa-crosshairs"></i> Near Me</>}
      </button>
      <div className="d-flex align-items-center gap-2">
        <label style={{ fontSize: '13px', whiteSpace: 'nowrap', marginBottom: 0 }}>
          <i className="fas fa-map-marker-alt text-danger me-1"></i>Radius:
        </label>
        <select className="form-select form-select-sm" value={radius} onChange={e => setRadius(Number(e.target.value))} style={{ width: 'auto' }}>
          {[1, 2, 5, 10, 25, 50].map(r => <option key={r} value={r}>{r} km</option>)}
        </select>
      </div>
      {error && <span className="text-danger" style={{ fontSize: '12px' }}><i className="fas fa-exclamation-triangle me-1"></i>{error}</span>}
    </div>
  );
};

export default HyperlocalSearch;