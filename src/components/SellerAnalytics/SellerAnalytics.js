import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSellerAnalytics } from '../../actions/supplierProduct';

const StatCard = ({ icon, label, value, color }) => (
  <div className="col-6 col-md-3 mb-3">
    <div className="card border-0 shadow-sm h-100 p-3 text-center">
      <i className={`${icon} mb-2`} style={{ fontSize: '24px', color }}></i>
      <div style={{ fontSize: '24px', fontWeight: 700, color }}>{value}</div>
      <div className="text-muted" style={{ fontSize: '12px' }}>{label}</div>
    </div>
  </div>
);

const SellerAnalytics = ({ supplierId }) => {
  const dispatch = useDispatch();
  const { loading, analytics, error } = useSelector(s => s.supplierAnalytics || {});

  useEffect(() => {
    if (supplierId) dispatch(getSellerAnalytics(supplierId));
  }, [dispatch, supplierId]);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!analytics) return null;

  const { totalViews, totalLeads, last30Days, last7Days, dailyViews, trustScore, rating, numReviews, responseRate } = analytics;
  const maxViews = Math.max(...(dailyViews || []).map(d => d.count), 1);

  return (
    <div>
      <h5 className="fw-bold mb-4">
        <i className="fas fa-chart-line me-2 text-primary"></i>Business Analytics
      </h5>
      <div className="row">
        <StatCard icon="fas fa-eye" label="Total Views" value={totalViews || 0} color="#3b82f6" />
        <StatCard icon="fas fa-user-plus" label="Total Leads" value={totalLeads || 0} color="#10b981" />
        <StatCard icon="fas fa-star" label="Rating" value={(rating || 0).toFixed(1)} color="#f59e0b" />
        <StatCard icon="fas fa-comments" label="Reviews" value={numReviews || 0} color="#8b5cf6" />
      </div>
      <div className="row mt-2">
        <StatCard icon="fas fa-calendar-week" label="Views (7 days)" value={last7Days?.views || 0} color="#06b6d4" />
        <StatCard icon="fas fa-calendar-alt" label="Views (30 days)" value={last30Days?.views || 0} color="#6366f1" />
        <StatCard icon="fas fa-phone-alt" label="Call Clicks (30d)" value={last30Days?.callClicks || 0} color="#ec4899" />
        <StatCard icon="fab fa-whatsapp" label="WhatsApp (30d)" value={last30Days?.whatsappClicks || 0} color="#16a34a" />
      </div>
      <div className="card border-0 shadow-sm p-4 mt-2">
        <h6 className="fw-bold mb-3">
          <i className="fas fa-chart-bar me-2 text-primary"></i>Daily Views — Last 30 Days
        </h6>
        <div className="d-flex align-items-end gap-1" style={{ height: '80px', overflowX: 'auto' }}>
          {(dailyViews || []).map((d, i) => (
            <div key={i} title={`${d.date}: ${d.count} views`} style={{
              flex: '1', minWidth: '8px',
              height: `${Math.max(2, (d.count / maxViews) * 80)}px`,
              background: '#3b82f6', borderRadius: '2px 2px 0 0',
              opacity: 0.7, cursor: 'default', transition: 'opacity 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}
            />
          ))}
        </div>
        <div className="d-flex justify-content-between mt-1">
          <span style={{ fontSize: '10px', color: '#9ca3af' }}>{dailyViews?.[0]?.date}</span>
          <span style={{ fontSize: '10px', color: '#9ca3af' }}>{dailyViews?.[dailyViews.length - 1]?.date}</span>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-3">
            <h6 className="fw-bold"><i className="fas fa-shield-alt me-2 text-primary"></i>Trust Score</h6>
            <div style={{ fontSize: '36px', fontWeight: 700, color: trustScore >= 70 ? '#16a34a' : trustScore >= 50 ? '#d97706' : '#dc2626' }}>
              {trustScore}
              <span style={{ fontSize: '14px', fontWeight: 400, color: '#6b7280' }}>/100</span>
            </div>
            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: 0 }}>Higher trust score = more visibility in search results</p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-3">
            <h6 className="fw-bold"><i className="fas fa-reply me-2 text-primary"></i>Response Rate</h6>
            <div style={{ fontSize: '36px', fontWeight: 700, color: responseRate >= 80 ? '#16a34a' : '#d97706' }}>
              {responseRate}%
            </div>
            <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '3px', marginTop: '8px' }}>
              <div style={{ height: '100%', width: `${responseRate}%`, background: responseRate >= 80 ? '#16a34a' : '#d97706', borderRadius: '3px' }} />
            </div>
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px', marginBottom: 0 }}>Faster responses earn higher trust scores</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerAnalytics;