import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendContactMessage } from '../../actions/supplierProduct';
import { SUPPLIER_CONTACT_RESET } from '../../constants/supplierConstants';

const ContactForm = ({ supplierId, businessName }) => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector(s => s.supplierContact || {});
  const { userInfo } = useSelector(s => s.userLogin);

  const [form, setForm] = useState({ name: userInfo?.name || '', email: userInfo?.email || '', phone: '', message: '' });
  const [showPhone, setShowPhone] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(sendContactMessage(supplierId, { ...form, channel: 'platform' }));
  };

  if (success) return (
    <div className="alert alert-success d-flex align-items-center gap-2">
      <i className="fas fa-check-circle"></i>
      <div>
        <strong>Message sent!</strong> The business will respond to you here on the platform. 
        You will not receive unsolicited calls.
        <button className="btn btn-sm btn-link p-0 ms-2" onClick={() => dispatch({ type: SUPPLIER_CONTACT_RESET })}>
          Send another
        </button>
      </div>
    </div>
  );

  return (
    <div className="card border-0 shadow-sm p-4">
      <h6 className="fw-bold mb-1">
        <i className="fas fa-envelope me-2 text-primary"></i>
        Contact {businessName}
      </h6>
      <p className="text-muted mb-3" style={{ fontSize: '12px' }}>
        <i className="fas fa-lock me-1"></i>
        Anti-Spam Protected — Your contact details are never shared without consent
      </p>
      {error && <div className="alert alert-danger" style={{ fontSize: '13px' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Your Name *</label>
          <input type="text" className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Message *</label>
          <textarea className="form-control" rows={4} placeholder="Describe what you need..."
            value={form.message} onChange={e => setForm({...form, message: e.target.value})} required minLength={10}></textarea>
        </div>
        <div className="mb-3">
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="sharePhone" checked={showPhone}
              onChange={e => setShowPhone(e.target.checked)} />
            <label className="form-check-label" htmlFor="sharePhone" style={{ fontSize: '13px' }}>
              I consent to share my phone number for this inquiry
            </label>
          </div>
          {showPhone && (
            <input type="tel" className="form-control mt-2" placeholder="Your phone number (optional)"
              value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          )}
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Sending...</> :
            <><i className="fas fa-paper-plane me-2"></i>Send Message</>}
        </button>
        <p className="text-muted text-center mt-2 mb-0" style={{ fontSize: '11px' }}>
          <i className="fas fa-shield-alt me-1"></i>
          Max 3 messages per day per business. No cold calls. You control all contact.
        </p>
      </form>
    </div>
  );
};

export default ContactForm;