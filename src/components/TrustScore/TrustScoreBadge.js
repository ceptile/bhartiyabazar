import React from 'react';

const TrustScoreBadge = ({ score, verificationStatus, hasVerifiedBadge, badgeTier, size = 'md' }) => {
  const getColor = (s) => {
    if (s >= 80) return '#16a34a';
    if (s >= 60) return '#d97706';
    if (s >= 40) return '#ea580c';
    return '#dc2626';
  };

  const getLabel = (s) => {
    if (s >= 80) return 'Highly Trusted';
    if (s >= 60) return 'Trusted';
    if (s >= 40) return 'Moderate';
    return 'New Listing';
  };

  const badgeSizes = { sm: { width: 48, fontSize: '10px' }, md: { width: 64, fontSize: '12px' }, lg: { width: 80, fontSize: '14px' } };
  const sz = badgeSizes[size] || badgeSizes.md;
  const color = getColor(score);
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="d-flex align-items-center gap-2 flex-wrap">
      <div style={{ width: sz.width, position: 'relative' }}>
        <svg viewBox="0 0 44 44" width={sz.width} height={sz.width}>
          <circle cx="22" cy="22" r="18" fill="none" stroke="#e5e7eb" strokeWidth="4" />
          <circle
            cx="22" cy="22" r="18"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 22 22)"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
          <text x="22" y="26" textAnchor="middle" fontSize="10" fontWeight="700" fill={color}>{score}</text>
        </svg>
      </div>
      <div>
        <div style={{ fontSize: sz.fontSize, fontWeight: 700, color }}>
          {getLabel(score)}
        </div>
        <div className="d-flex gap-1 flex-wrap mt-1">
          {verificationStatus === 'verified' && (
            <span className="badge" style={{ background: '#dbeafe', color: '#1d4ed8', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>
              <i className="fas fa-shield-alt me-1" style={{ fontSize: '9px' }}></i>Verified
            </span>
          )}
          {hasVerifiedBadge && (
            <span className="badge" style={{ background: '#fef3c7', color: '#92400e', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>
              <i className="fas fa-certificate me-1" style={{ fontSize: '9px' }}></i>
              {badgeTier === 'elite' ? 'Elite' : badgeTier === 'premium' ? 'Premium' : 'Verified'} Badge
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrustScoreBadge;