import React from 'react';

const TrustScoreDetail = ({ trustData }) => {
  if (!trustData) return null;
  const { trustScore, breakdown, verificationStatus, responseRate, responseTime } = trustData;

  const bars = [
    { label: 'Verification', value: breakdown?.verificationScore || 0, max: 30, icon: 'fas fa-shield-alt', color: '#3b82f6' },
    { label: 'Review Quality', value: breakdown?.reviewScore || 0, max: 25, icon: 'fas fa-star', color: '#f59e0b' },
    { label: 'Response Speed', value: breakdown?.responseScore || 0, max: 25, icon: 'fas fa-bolt', color: '#10b981' },
    { label: 'Profile Complete', value: Math.min(20, 20 - (breakdown?.spamPenalty || 0)), max: 20, icon: 'fas fa-user-check', color: '#8b5cf6' },
  ];

  return (
    <div className="card border-0 shadow-sm p-3">
      <h6 className="fw-bold mb-3">
        <i className="fas fa-chart-bar me-2" style={{ color: '#3b82f6' }}></i>
        Trust Score Breakdown
      </h6>
      {bars.map(b => (
        <div key={b.label} className="mb-3">
          <div className="d-flex justify-content-between mb-1">
            <span style={{ fontSize: '13px' }}>
              <i className={`${b.icon} me-1`} style={{ color: b.color, fontSize: '12px' }}></i>
              {b.label}
            </span>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>{b.value}/{b.max}</span>
          </div>
          <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${(b.value / b.max) * 100}%`,
                background: b.color,
                borderRadius: '3px',
                transition: 'width 0.8s ease',
              }}
            />
          </div>
        </div>
      ))}
      <div className="d-flex gap-3 mt-2 pt-2 border-top flex-wrap">
        <div style={{ fontSize: '12px' }}>
          <i className="fas fa-reply me-1 text-muted"></i>
          Response Rate: <strong>{responseRate || 0}%</strong>
        </div>
        <div style={{ fontSize: '12px' }}>
          <i className="fas fa-clock me-1 text-muted"></i>
          Avg. Response: <strong>{responseTime > 0 ? `${responseTime} min` : 'N/A'}</strong>
        </div>
        <div style={{ fontSize: '12px' }}>
          <i className="fas fa-check-circle me-1 text-muted"></i>
          Status: <strong style={{ textTransform: 'capitalize' }}>{verificationStatus}</strong>
        </div>
      </div>
    </div>
  );
};

export default TrustScoreDetail;