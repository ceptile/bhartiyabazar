import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { compareSuppliers } from '../../actions/supplierProduct';
import TrustScoreBadge from '../TrustScore/TrustScoreBadge';

const CompareRow = ({ label, values, icon }) => (
  <tr>
    <td className="text-muted fw-semibold" style={{ fontSize: '13px', whiteSpace: 'nowrap' }}>
      <i className={`${icon} me-2`} style={{ fontSize: '12px', width: '16px' }}></i>{label}
    </td>
    {values.map((v, i) => (
      <td key={i} className="text-center fw-semibold" style={{ fontSize: '13px' }}>{v}</td>
    ))}
  </tr>
);

const BusinessComparison = ({ preselectedIds = [] }) => {
  const dispatch = useDispatch();
  const { suppliers = [], loading, error } = useSelector(s => s.supplierCompare || {});
  const [ids, setIds] = useState(preselectedIds);

  const handleCompare = () => {
    if (ids.length >= 2) dispatch(compareSuppliers(ids));
  };

  const getPriceLabel = (range) => {
    const map = { budget: 'Budget', moderate: 'Mid-Range', premium: 'Premium', luxury: 'Luxury' };
    return map[range] || 'N/A';
  };

  return (
    <div>
      {loading && <div className="text-center py-3"><div className="spinner-border text-primary" role="status"></div></div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {suppliers.length >= 2 && (
        <div className="table-responsive mt-3">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ width: '140px' }}>Criteria</th>
                {suppliers.map(s => (
                  <th key={s._id} className="text-center">
                    <div className="fw-bold" style={{ fontSize: '14px' }}>{s.businessName}</div>
                    <div className="text-muted" style={{ fontSize: '11px' }}>{s.city}, {s.category}</div>
                    {s.images?.[0] && (
                      <img src={s.images[0]} alt={s.businessName} width="48" height="48"
                        className="rounded mt-1" style={{ objectFit: 'cover' }} />
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-muted fw-semibold" style={{ fontSize: '13px' }}>
                  <i className="fas fa-shield-alt me-2" style={{ fontSize: '12px' }}></i>Trust Score
                </td>
                {suppliers.map(s => (
                  <td key={s._id} className="text-center">
                    <TrustScoreBadge score={s.trustScore} verificationStatus={s.verificationStatus} size="sm" />
                  </td>
                ))}
              </tr>
              <CompareRow label="Rating" values={suppliers.map(s => `${(s.rating || 0).toFixed(1)} ★ (${s.numReviews || 0})`)} icon="fas fa-star" />
              <CompareRow label="Price Range" values={suppliers.map(s => getPriceLabel(s.priceRange))} icon="fas fa-tag" />
              <CompareRow label="Response Rate" values={suppliers.map(s => `${s.responseRate || 0}%`)} icon="fas fa-reply" />
              <CompareRow label="Avg. Response" values={suppliers.map(s => s.responseTime > 0 ? `${s.responseTime} min` : 'N/A')} icon="fas fa-clock" />
              <CompareRow label="Location" values={suppliers.map(s => s.city || 'N/A')} icon="fas fa-map-marker-alt" />
              <tr>
                <td className="text-muted fw-semibold" style={{ fontSize: '13px' }}>
                  <i className="fas fa-phone me-2" style={{ fontSize: '12px' }}></i>Contact
                </td>
                {suppliers.map(s => (
                  <td key={s._id} className="text-center">
                    {s.phone && <a href={`tel:${s.phone}`} className="btn btn-sm btn-outline-primary me-1"><i className="fas fa-phone"></i></a>}
                    {s.whatsapp && <a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-success"><i className="fab fa-whatsapp"></i></a>}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BusinessComparison;