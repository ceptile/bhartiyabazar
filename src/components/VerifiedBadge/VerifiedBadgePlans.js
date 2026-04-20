import React from 'react';

const plans = [
  { tier: 'basic', name: 'Verified', price: '₹499', period: '/month', color: '#3b82f6', icon: 'fas fa-check-circle', features: ['Verified Badge on listing', 'Priority in search results', 'Trust score +10 boost', 'Up to 10 images', 'Basic analytics'] },
  { tier: 'premium', name: 'Premium', price: '₹999', period: '/month', color: '#f59e0b', icon: 'fas fa-award', features: ['All Basic features', 'Featured listing (30 days)', 'Detailed analytics dashboard', 'Respond to reviews publicly', 'Up to 30 images', 'Trust score +20 boost'], popular: true },
  { tier: 'elite', name: 'Elite', price: '₹2499', period: '/month', color: '#8b5cf6', icon: 'fas fa-crown', features: ['All Premium features', 'Top placement in category', 'Elite badge (gold crown)', 'Priority customer support', 'Business comparison priority', 'Trust score +30 boost', 'Unlimited images'] },
];

const VerifiedBadgePlans = ({ onSelect }) => (
  <div className="row">
    {plans.map(plan => (
      <div key={plan.tier} className="col-md-4 mb-4">
        <div className={`card border-0 shadow-sm h-100 ${plan.popular ? 'border-warning border-2' : ''}`} style={{ position: 'relative' }}>
          {plan.popular && (
            <div className="position-absolute top-0 start-50 translate-middle">
              <span className="badge bg-warning text-dark" style={{ fontSize: '11px' }}>Most Popular</span>
            </div>
          )}
          <div className="card-body p-4 d-flex flex-column">
            <div className="text-center mb-3">
              <i className={`${plan.icon} mb-2`} style={{ fontSize: '32px', color: plan.color }}></i>
              <h5 className="fw-bold mb-1">{plan.name}</h5>
              <div style={{ fontSize: '28px', fontWeight: 700, color: plan.color }}>
                {plan.price}<span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 400 }}>{plan.period}</span>
              </div>
            </div>
            <ul className="list-unstyled mb-4 flex-grow-1">
              {plan.features.map((f, i) => (
                <li key={i} className="mb-2 d-flex align-items-start gap-2" style={{ fontSize: '13px' }}>
                  <i className="fas fa-check-circle mt-1" style={{ color: plan.color, fontSize: '12px', flexShrink: 0 }}></i>
                  {f}
                </li>
              ))}
            </ul>
            <button className="btn w-100 fw-semibold" style={{ background: plan.color, color: 'white', border: 'none' }}
              onClick={() => onSelect && onSelect(plan.tier)}>
              <i className="fas fa-arrow-right me-2"></i>Get {plan.name}
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default VerifiedBadgePlans;