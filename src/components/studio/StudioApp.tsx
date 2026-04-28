'use client';
import { useState, useEffect, useCallback } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import {
  collection, doc, getDoc, setDoc, getDocs, addDoc,
  deleteDoc, updateDoc, serverTimestamp, query, orderBy, limit
} from 'firebase/firestore';

const ADMIN_EMAIL = 'ceptile.com@gmail.com';

// ─── Default page content (sourced directly from current codebase) ─────────
const PAGE_DEFAULTS: Record<string, { title: string; sections: { heading: string; body: string }[] }> = {
  about: {
    title: 'About BhartiyaBazar',
    sections: [
      { heading: 'Hero Headline', body: "Connecting India's businesses with the people who need them" },
      { heading: 'Hero Subtext', body: "BhartiyaBazar is India's most trusted local business discovery platform. We help millions of Indians find verified businesses nearby — and help local businesses build their digital presence." },
      { heading: 'Stat — Businesses Listed', body: '50,000+' },
      { heading: 'Stat — Monthly Users', body: '12 Lakh+' },
      { heading: 'Stat — Cities Covered', body: '500+' },
      { heading: 'Stat — Average Rating', body: '4.7' },
      { heading: 'Mission Heading', body: 'Making local commerce accessible to everyone' },
      { heading: 'Mission Para 1', body: 'India has over 63 million small and medium businesses, yet most of them remain invisible online. BhartiyaBazar bridges this gap by giving every local business — regardless of size or technical know-how — a professional, discoverable presence on the internet.' },
      { heading: 'Mission Para 2', body: 'At the same time, we empower consumers with verified reviews, accurate information, and direct contact options so they can make confident decisions about where to spend their money locally.' },
      { heading: 'Value — Trust & Verification', body: 'Every business listing undergoes a manual verification process before going live. We ensure accuracy, authenticity, and accountability at every step.' },
      { heading: 'Value — Community First', body: "We exist to serve India's local business ecosystem — from a kirana store in Bhiwadi to a tech company in Bangalore. Every voice matters on our platform." },
      { heading: 'Value — Speed & Simplicity', body: 'Finding or listing a business should take minutes, not days. Our platform is built for speed, clarity, and ease of use across all devices.' },
      { heading: 'Value — Fair & Open', body: 'No paid placements in organic results. Rankings are driven by ratings, reviews, and relevance — not advertising spend. Fairness is built into the algorithm.' },
      { heading: 'Timeline — 2018', body: 'BhartiyaBazar founded in Delhi with 50 pilot businesses.' },
      { heading: 'Timeline — 2019', body: 'Expanded to 10 cities. Reached 1,000 verified listings.' },
      { heading: 'Timeline — 2020', body: 'Launched mobile-first platform. 50,000 monthly users.' },
      { heading: 'Timeline — 2021', body: 'Crossed 10,000 business listings. Introduced review verification.' },
      { heading: 'Timeline — 2022', body: 'Series A funding. Expanded to 200+ cities across India.' },
      { heading: 'Timeline — 2023', body: 'Launched business dashboard and analytics tools.' },
      { heading: 'Timeline — 2024', body: '50,000+ businesses. 12 lakh monthly active users.' },
      { heading: 'Team — Arjun Mehta', body: 'Co-Founder & CEO · Delhi' },
      { heading: 'Team — Priya Sharma', body: 'Co-Founder & CTO · Bangalore' },
      { heading: 'Team — Rahul Gupta', body: 'Head of Growth · Mumbai' },
      { heading: 'Team — Sneha Verma', body: 'Head of Trust & Safety · Hyderabad' },
      { heading: 'Team — Karan Joshi', body: 'Lead Engineer · Pune' },
      { heading: 'Team — Anita Patel', body: 'Head of Customer Success · Ahmedabad' },
      { heading: 'CTA Heading', body: 'Ready to grow your business?' },
      { heading: 'CTA Subtext', body: 'Join 50,000+ businesses already listed on BhartiyaBazar. Get discovered, collect reviews, and connect with customers in your city.' },
    ],
  },
  contact: {
    title: 'Contact Page',
    sections: [
      { heading: 'Hero Headline', body: "We're here to help" },
      { heading: 'Hero Subtext', body: 'Have a question, need support, or want to explore a partnership? Send us a message and we will get back to you within one business day.' },
      { heading: 'Contact — Email', body: 'support@bhartiyabazar.in' },
      { heading: 'Contact — Email Sub', body: 'Response within 24 hours' },
      { heading: 'Contact — Phone', body: '+91 11 4567 8900' },
      { heading: 'Contact — Phone Sub', body: 'Mon–Sat, 9 AM – 6 PM IST' },
      { heading: 'Contact — Office', body: 'DLF Cyber City, Gurgaon' },
      { heading: 'Contact — Office Sub', body: 'Haryana — 122 002' },
      { heading: 'Hours — Mon–Fri', body: '9:00 AM – 7:00 PM IST' },
      { heading: 'Hours — Saturday', body: '10:00 AM – 5:00 PM IST' },
      { heading: 'Hours — Sunday', body: 'Closed' },
      { heading: 'Form Title', body: 'Send a message' },
      { heading: 'Success Message', body: 'Thank you for reaching out. A member of our team will respond to your message within one business day.' },
    ],
  },
  pricing: {
    title: 'Pricing Page',
    sections: [
      { heading: 'Hero Headline', body: 'Simple, transparent pricing' },
      { heading: 'Hero Subtext', body: 'Start free. Upgrade when you are ready to grow. No hidden charges, no lock-ins.' },
      { heading: 'Plan — Free Name', body: 'Free' },
      { heading: 'Plan — Free Tagline', body: 'For individuals getting started' },
      { heading: 'Plan — Free Monthly Price', body: '0' },
      { heading: 'Plan — Free Features (one per line)', body: '1 business listing\nBasic business profile\nCustomer reviews\nGoogle Maps integration\nContact details displayed' },
      { heading: 'Plan — Pro Name', body: 'Pro' },
      { heading: 'Plan — Pro Tagline', body: 'For growing local businesses' },
      { heading: 'Plan — Pro Monthly Price', body: '499' },
      { heading: 'Plan — Pro Annual Price', body: '399' },
      { heading: 'Plan — Pro Features (one per line)', body: '1 business listing\nFull business profile\nCustomer reviews\nGoogle Maps integration\nContact details displayed\nPriority search placement\nAnalytics dashboard\nUnlimited photos\nFeatured badge' },
      { heading: 'Plan — Business Name', body: 'Business' },
      { heading: 'Plan — Business Tagline', body: 'For established brands scaling up' },
      { heading: 'Plan — Business Monthly Price', body: '1199' },
      { heading: 'Plan — Business Annual Price', body: '999' },
      { heading: 'Plan — Business Features (one per line)', body: 'Up to 5 business listings\nFull business profile\nCustomer reviews\nGoogle Maps integration\nContact details displayed\nPriority search placement\nAdvanced analytics dashboard\nUnlimited photos\nFeatured badge\nDirect message inbox\nCustom business URL\nPriority support' },
      { heading: 'FAQ 1 — Question', body: 'Can I list my business for free?' },
      { heading: 'FAQ 1 — Answer', body: 'Yes. The Free plan lets you create one business listing with all essential information. No credit card required. Upgrade any time to unlock premium features.' },
      { heading: 'FAQ 2 — Question', body: 'What payment methods do you accept?' },
      { heading: 'FAQ 2 — Answer', body: 'We accept all major UPI apps (PhonePe, GPay, Paytm), net banking, debit and credit cards (Visa, Mastercard, RuPay), and EMI options for annual plans.' },
      { heading: 'FAQ 3 — Question', body: 'Can I cancel my subscription at any time?' },
      { heading: 'FAQ 3 — Answer', body: 'Yes, you can cancel at any time from your dashboard. Your plan remains active until the end of the billing period. We do not charge cancellation fees.' },
      { heading: 'FAQ 4 — Question', body: 'Is there a refund policy?' },
      { heading: 'FAQ 4 — Answer', body: 'We offer a full refund within 7 days of purchase if you are not satisfied. Annual plan refunds are prorated after the 7-day window.' },
      { heading: 'CTA Heading', body: 'Still have questions?' },
      { heading: 'CTA Subtext', body: 'Our team is happy to walk you through the right plan for your business. Reach out any time.' },
    ],
  },
  terms: {
    title: 'Terms of Service',
    sections: [
      { heading: 'Last Updated', body: '1 January 2024' },
      { heading: 'Acceptance of Terms', body: 'By accessing or using BhartiyaBazar ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, please discontinue use immediately. These terms apply to all users, including business owners, consumers, and visitors.' },
      { heading: 'Use of the Platform', body: 'You may use the Platform for lawful purposes only. You agree not to post false, misleading, or defamatory content; impersonate any person or business; attempt to gain unauthorised access to any part of the Platform; or use automated tools to scrape or harvest data without prior written consent.' },
      { heading: 'Business Listings', body: 'Business owners are responsible for the accuracy of their listing information. BhartiyaBazar reserves the right to remove or modify any listing that violates these terms, contains false information, or is reported by users as misleading. Verified badges are granted after manual review and may be revoked at any time.' },
      { heading: 'Reviews and Content', body: 'Users may submit reviews and ratings for businesses. Reviews must be based on genuine first-hand experience. BhartiyaBazar does not endorse any review and is not liable for user-generated content. We reserve the right to remove reviews that violate our content policy.' },
      { heading: 'Intellectual Property', body: 'All content on the Platform — including logos, design, code, and data — is owned by or licensed to BhartiyaBazar. You may not reproduce, distribute, or create derivative works without express written permission.' },
      { heading: 'Limitation of Liability', body: 'BhartiyaBazar provides the Platform on an "as is" basis. We make no warranties regarding accuracy, availability, or fitness for a particular purpose. To the maximum extent permitted by Indian law, BhartiyaBazar shall not be liable for indirect, incidental, or consequential damages.' },
      { heading: 'Governing Law', body: 'These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Gurgaon, Haryana.' },
      { heading: 'Changes to Terms', body: 'We may update these Terms from time to time. Continued use of the Platform after changes constitutes acceptance of the revised Terms. We will notify users of material changes via email or on-platform notice.' },
      { heading: 'Footer Note', body: 'Questions about these Terms? Contact us via the contact page.' },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    sections: [
      { heading: 'Last Updated', body: '1 January 2024' },
      { heading: 'Information We Collect', body: 'We collect information you provide directly — such as your name, email address, phone number, and business details when you register or create a listing. We also collect usage data including pages visited, search queries, and device information to improve the Platform.' },
      { heading: 'How We Use Your Information', body: 'Your information is used to operate and improve the Platform, verify business listings, send transactional communications, provide customer support, and comply with legal obligations. We do not sell your personal information to third parties.' },
      { heading: 'Cookies and Tracking', body: 'We use cookies and similar technologies to maintain sessions, analyse traffic, and personalise your experience. You can disable cookies in your browser settings, though some features may not function correctly as a result.' },
      { heading: 'Data Sharing', body: 'We may share your data with trusted third-party service providers who assist us in operating the Platform (such as hosting, analytics, and payment processing) under strict confidentiality agreements. We may also disclose information when required by law.' },
      { heading: 'Data Retention', body: 'We retain your personal information for as long as your account is active or as needed to provide the service. You may request deletion of your account and associated data by contacting us at privacy@bhartiyabazar.in.' },
      { heading: 'Security', body: 'We implement industry-standard security measures including encryption in transit (TLS), secure data storage, and access controls. However, no system is completely secure and we cannot guarantee absolute security.' },
      { heading: 'Your Rights', body: 'Under applicable Indian data protection laws, you have the right to access, correct, or delete your personal information. To exercise these rights, contact us at privacy@bhartiyabazar.in. We will respond within 30 days.' },
      { heading: "Children's Privacy", body: 'The Platform is not directed to children under the age of 13. We do not knowingly collect personal information from minors. If you believe a minor has provided us with personal information, please contact us immediately.' },
      { heading: 'Changes to This Policy', body: 'We may update this Privacy Policy periodically. We will notify you of significant changes via email or a prominent notice on the Platform. Continued use after changes constitutes acceptance of the revised policy.' },
      { heading: 'Footer Note', body: 'Privacy questions? Email us at privacy@bhartiyabazar.in' },
    ],
  },
};

// ─── Icon ────────────────────────────────────────────────────────────────────
function Icon({ d, size = 16 }: { d: string | string[]; size?: number }) {
  const paths = Array.isArray(d) ? d : [d];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV = [
  { id: 'overview',      label: 'Overview',          icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  { id: 'users',         label: 'Users',              icon: ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', 'M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75'] },
  { id: 'businesses',    label: 'Businesses',         icon: ['M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10'] },
  { id: 'contacts',      label: 'Contacts',           icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 4.9 2 2 0 0 1 3.59 2.72h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.09a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17.5z' },
  { id: 'announcements', label: 'Announcements',      icon: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0' },
  { id: 'media',         label: 'Media & Slider',     icon: ['M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z', 'M4 22v-7'] },
  { id: 'pricing',       label: 'Pricing & Coupons',  icon: ['M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z', 'M7 7h.01'] },
  { id: 'pages',         label: 'Page Editor',        icon: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8', 'M10 9H8'] },
  { id: 'seo',           label: 'SEO & Meta',         icon: 'M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z' },
  { id: 'settings',      label: 'Site Settings',      icon: ['M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z'] },
];

// ─── Shared UI ───────────────────────────────────────────────────────────────
function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>{title}</h2>
      {sub && <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{sub}</p>}
    </div>
  );
}

function StatCard({ label, value, sub, accent = false }: { label: string; value: string | number; sub?: string; accent?: boolean }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '20px 24px', flex: 1, minWidth: 160 }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 700, color: accent ? 'var(--amber)' : 'var(--text-primary)', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function FieldInput({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
      <input {...props} style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', boxSizing: 'border-box', ...props.style }} />
    </div>
  );
}

function FieldTextarea({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
      <textarea {...props} style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', minHeight: 100, resize: 'vertical', boxSizing: 'border-box', ...props.style }} />
    </div>
  );
}

function Btn({ children, onClick, variant = 'primary', small, disabled, style: s }: {
  children: React.ReactNode; onClick?: () => void;
  variant?: 'primary' | 'danger' | 'ghost'; small?: boolean;
  disabled?: boolean; style?: React.CSSProperties;
}) {
  return (
    <button disabled={disabled} onClick={onClick} style={{
      padding: small ? '6px 14px' : '9px 18px',
      borderRadius: 'var(--r-md)', fontSize: small ? 12 : 13, fontWeight: 600,
      cursor: disabled ? 'not-allowed' : 'pointer', border: 'none',
      display: 'inline-flex', alignItems: 'center', gap: 6,
      opacity: disabled ? 0.6 : 1,
      background: variant === 'primary' ? 'var(--amber)' : variant === 'danger' ? 'var(--crimson)' : 'var(--surface)',
      color: variant === 'ghost' ? 'var(--text-secondary)' : '#fff',
      outline: variant === 'ghost' ? '1px solid var(--border)' : 'none',
      ...s,
    }}>{children}</button>
  );
}

function Card({ children, style: s }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 24, ...s }}>
      {children}
    </div>
  );
}

function TableWrap({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
            {headers.map(h => (
              <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function Toast({ msg, type, onClose }: { msg: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3200); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
      padding: '12px 18px', borderRadius: 'var(--r-lg)',
      background: type === 'success' ? '#166534' : '#991b1b',
      color: '#fff', fontSize: 13, fontWeight: 600,
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <Icon d={type === 'success' ? 'M20 6L9 17l-5-5' : 'M18 6L6 18M6 6l12 12'} size={15} />
      {msg}
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: 6, padding: 0 }}>✕</button>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function StudioApp() {
  const [authed,   setAuthed]   = useState(false);
  const [checking, setChecking] = useState(true);
  const [email,    setEmail]    = useState('');
  const [pass,     setPass]     = useState('');
  const [loginErr, setLoginErr] = useState('');
  const [active,   setActive]   = useState('overview');
  const [sideOpen, setSideOpen] = useState(true);
  const [toast,    setToast]    = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
  }, []);

  useEffect(() => {
    return onAuthStateChanged(auth, u => {
      setAuthed(!!(u && u.email === ADMIN_EMAIL));
      setChecking(false);
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErr('');
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      if (cred.user.email !== ADMIN_EMAIL) {
        await signOut(auth);
        setLoginErr('Access denied. Admin only.');
      }
    } catch {
      setLoginErr('Invalid email or password.');
    }
  };

  if (checking) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading Studio…</div>
    </div>
  );

  if (!authed) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <form onSubmit={handleLogin} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: 40, width: 360, boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ marginBottom: 32 }}>
          {/* Studio logo — NOT BhartiyaBazar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            <span style={{ fontFamily: 'var(--font-body, sans-serif)', fontWeight: 800, fontSize: 20, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Studio<span style={{ color: 'var(--amber)' }}>.</span>
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Admin access only · BhartiyaBazar</p>
        </div>
        {loginErr && (
          <div style={{ background: 'rgba(180,30,45,0.08)', color: 'var(--crimson)', padding: '10px 14px', borderRadius: 'var(--r-md)', fontSize: 13, marginBottom: 16, border: '1px solid rgba(180,30,45,0.2)' }}>
            {loginErr}
          </div>
        )}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
            style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} required
            style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: 12, borderRadius: 'var(--r-md)', background: 'var(--amber)', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>
          Enter Studio
        </button>
      </form>
    </div>
  );

  const renderSection = () => {
    const props = { showToast };
    switch (active) {
      case 'overview':      return <OverviewSection />;
      case 'users':         return <UsersSection {...props} />;
      case 'businesses':    return <BusinessesSection {...props} />;
      case 'contacts':      return <ContactsSection {...props} />;
      case 'announcements': return <AnnouncementsSection {...props} />;
      case 'media':         return <MediaSection {...props} />;
      case 'pricing':       return <PricingSection {...props} />;
      case 'pages':         return <PageEditorSection {...props} />;
      case 'seo':           return <SeoSection {...props} />;
      case 'settings':      return <SettingsSection {...props} />;
      default:              return null;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)', fontFamily: 'var(--font-body, sans-serif)' }}>

      {/* Sidebar */}
      <aside style={{
        width: sideOpen ? 232 : 56, flexShrink: 0,
        background: 'var(--surface)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', transition: 'width 0.2s ease', overflow: 'hidden',
      }}>
        {/* Studio logo header — NOT BhartiyaBazar */}
        <div style={{ height: 60, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <button onClick={() => setSideOpen(o => !o)}
            style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', border: '1px solid var(--border-hover)', background: 'transparent', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <Icon d="M4 6h16M4 12h16M4 18h16" />
          </button>
          {sideOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
              <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)', whiteSpace: 'nowrap', letterSpacing: '-0.02em' }}>
                Studio<span style={{ color: 'var(--amber)' }}>.</span>
              </span>
            </div>
          )}
        </div>

        <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setActive(n.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 10px', borderRadius: 'var(--r-md)', border: 'none', cursor: 'pointer',
              marginBottom: 2, textAlign: 'left', whiteSpace: 'nowrap', fontSize: 13,
              fontWeight: active === n.id ? 600 : 400,
              background: active === n.id ? 'var(--amber-subtle)' : 'transparent',
              color: active === n.id ? 'var(--amber)' : 'var(--text-secondary)',
              outline: active === n.id ? '1px solid var(--amber-glow)' : 'none',
            }}>
              <span style={{ flexShrink: 0 }}><Icon d={n.icon} size={15} /></span>
              {sideOpen && n.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '10px 8px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
          <button onClick={() => signOut(auth)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px', borderRadius: 'var(--r-md)', border: 'none',
            cursor: 'pointer', background: 'transparent', color: 'var(--crimson)',
            fontSize: 13, whiteSpace: 'nowrap',
          }}>
            <Icon d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" size={15} />
            {sideOpen && 'Sign Out'}
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, overflowY: 'auto', padding: '36px 40px' }}>
        {renderSection()}
      </main>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTIONS
// ═══════════════════════════════════════════════════════════════════════════════

type SectionProps = { showToast: (msg: string, type?: 'success' | 'error') => void };

// ── Overview ─────────────────────────────────────────────────────────────────
function OverviewSection() {
  const [stats, setStats] = useState({ users: 0, businesses: 0, contacts: 0, announcements: 0 });
  useEffect(() => {
    (async () => {
      const [u, b, c, a] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'businesses')),
        getDocs(collection(db, 'contacts')),
        getDocs(collection(db, 'announcements')),
      ]);
      setStats({ users: u.size, businesses: b.size, contacts: c.size, announcements: a.size });
    })();
  }, []);
  return (
    <div>
      <SectionHeader title="Overview" sub="Real-time snapshot of your platform" />
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
        <StatCard label="Total Users"       value={stats.users}         sub="Registered accounts"  accent />
        <StatCard label="Businesses"        value={stats.businesses}    sub="Listed on platform" />
        <StatCard label="Contact Messages"  value={stats.contacts}      sub="Received inquiries" />
        <StatCard label="Announcements"     value={stats.announcements} sub="Active circulars" />
      </div>
      <Card>
        <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quick Navigation</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: 10 }}>
          {NAV.filter(n => n.id !== 'overview').map(n => (
            <div key={n.id} style={{ padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'var(--surface-2)', border: '1px solid var(--border)', fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon d={n.icon} size={14} />{n.label}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── Users ─────────────────────────────────────────────────────────────────────
function UsersSection({ showToast }: SectionProps) {
  const [users,   setUsers]   = useState<{ id: string; name: string; email: string; role: string; joinedAt: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');

  useEffect(() => {
    getDocs(query(collection(db, 'users'), orderBy('joinedAt', 'desc'), limit(200)))
      .then(snap => { setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() } as never))); setLoading(false); })
      .catch(() => { showToast('Failed to load users', 'error'); setLoading(false); });
  }, [showToast]);

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <SectionHeader title="Users" sub={`${users.length} registered accounts`} />
      <input placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)}
        style={{ padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)', fontSize: 13, outline: 'none', marginBottom: 20, width: 280 }} />
      {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading…</p> : (
        <TableWrap headers={['Name', 'Email', 'Role', 'Joined']}>
          {filtered.map(u => (
            <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '11px 16px', fontWeight: 500, color: 'var(--text-primary)' }}>{u.name || '—'}</td>
              <td style={{ padding: '11px 16px', color: 'var(--text-muted)' }}>{u.email}</td>
              <td style={{ padding: '11px 16px' }}>
                <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                  background: u.role === 'business' ? 'rgba(16,185,129,0.1)' : 'rgba(99,102,241,0.1)',
                  color: u.role === 'business' ? '#10b981' : '#6366f1' }}>
                  {u.role || 'user'}
                </span>
              </td>
              <td style={{ padding: '11px 16px', color: 'var(--text-muted)', fontSize: 12 }}>
                {u.joinedAt ? new Date(u.joinedAt).toLocaleDateString('en-IN') : '—'}
              </td>
            </tr>
          ))}
        </TableWrap>
      )}
    </div>
  );
}

// ── Businesses ────────────────────────────────────────────────────────────────
function BusinessesSection({ showToast }: SectionProps) {
  const [businesses, setBusinesses] = useState<{ id: string; name: string; category: string; city: string; verified: boolean; ownerEmail: string }[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');

  const load = useCallback(async () => {
    try {
      const snap = await getDocs(query(collection(db, 'businesses'), orderBy('createdAt', 'desc'), limit(200)));
      setBusinesses(snap.docs.map(d => ({ id: d.id, ...d.data() } as never)));
    } catch { showToast('Failed to load businesses', 'error'); }
    setLoading(false);
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const filtered = businesses.filter(b =>
    b.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.city?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleVerified = async (id: string, cur: boolean) => {
    try {
      await updateDoc(doc(db, 'businesses', id), { verified: !cur });
      setBusinesses(prev => prev.map(b => b.id === id ? { ...b, verified: !cur } : b));
      showToast(!cur ? 'Business verified ✓' : 'Business unverified');
    } catch { showToast('Update failed', 'error'); }
  };

  const deleteBusiness = async (id: string) => {
    if (!confirm('Delete this business listing permanently?')) return;
    try {
      await deleteDoc(doc(db, 'businesses', id));
      setBusinesses(prev => prev.filter(b => b.id !== id));
      showToast('Business deleted');
    } catch { showToast('Delete failed', 'error'); }
  };

  return (
    <div>
      <SectionHeader title="Businesses" sub={`${businesses.length} listed businesses`} />
      <input placeholder="Search by name or city…" value={search} onChange={e => setSearch(e.target.value)}
        style={{ padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)', fontSize: 13, outline: 'none', marginBottom: 20, width: 280 }} />
      {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading…</p> : (
        <TableWrap headers={['Name', 'Category', 'City', 'Status', 'Actions']}>
          {filtered.map(b => (
            <tr key={b.id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '11px 16px', fontWeight: 500, color: 'var(--text-primary)' }}>{b.name}</td>
              <td style={{ padding: '11px 16px', color: 'var(--text-muted)' }}>{b.category || '—'}</td>
              <td style={{ padding: '11px 16px', color: 'var(--text-muted)' }}>{b.city || '—'}</td>
              <td style={{ padding: '11px 16px' }}>
                <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                  background: b.verified ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                  color: b.verified ? '#10b981' : '#ef4444' }}>
                  {b.verified ? '✓ Verified' : 'Unverified'}
                </span>
              </td>
              <td style={{ padding: '11px 16px', display: 'flex', gap: 8 }}>
                <Btn small variant={b.verified ? 'ghost' : 'primary'} onClick={() => toggleVerified(b.id, b.verified)}>
                  {b.verified ? 'Unverify' : 'Verify'}
                </Btn>
                <Btn small variant="danger" onClick={() => deleteBusiness(b.id)}>Delete</Btn>
              </td>
            </tr>
          ))}
        </TableWrap>
      )}
    </div>
  );
}

// ── Contacts ──────────────────────────────────────────────────────────────────
function ContactsSection({ showToast }: SectionProps) {
  const [contacts, setContacts] = useState<{ id: string; name: string; email: string; subject: string; message: string; createdAt: string }[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    getDocs(query(collection(db, 'contacts'), orderBy('createdAt', 'desc'), limit(100)))
      .then(snap => { setContacts(snap.docs.map(d => ({ id: d.id, ...d.data() } as never))); setLoading(false); })
      .catch(() => { showToast('Failed to load contacts', 'error'); setLoading(false); });
  }, [showToast]);

  const del = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try {
      await deleteDoc(doc(db, 'contacts', id));
      setContacts(prev => prev.filter(c => c.id !== id));
      showToast('Message deleted');
    } catch { showToast('Delete failed', 'error'); }
  };

  return (
    <div>
      <SectionHeader title="Contact Messages" sub={`${contacts.length} received messages`} />
      {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading…</p> : contacts.length === 0 ? (
        <Card><p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No messages yet.</p></Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {contacts.map(c => (
            <Card key={c.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{c.name}</span>
                    {c.subject && <span style={{ padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: 'var(--amber-subtle)', color: 'var(--amber)', border: '1px solid var(--amber-glow)' }}>{c.subject}</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
                    {c.email} · {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{c.message}</p>
                </div>
                <Btn small variant="danger" onClick={() => del(c.id)}>Delete</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Announcements ─────────────────────────────────────────────────────────────
function AnnouncementsSection({ showToast }: SectionProps) {
  const [list,    setList]    = useState<{ id: string; title: string; body: string; createdAt: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [title,   setTitle]   = useState('');
  const [body,    setBody]     = useState('');
  const [saving,  setSaving]  = useState(false);

  const load = useCallback(async () => {
    const snap = await getDocs(query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(50)));
    setList(snap.docs.map(d => ({ id: d.id, ...d.data() } as never)));
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const add = async () => {
    if (!title.trim()) { showToast('Title is required', 'error'); return; }
    setSaving(true);
    try {
      await addDoc(collection(db, 'announcements'), { title, body, createdAt: new Date().toISOString() });
      setTitle(''); setBody('');
      await load();
      showToast('Announcement published ✓');
    } catch { showToast('Failed to publish', 'error'); }
    setSaving(false);
  };

  const del = async (id: string) => {
    if (!confirm('Delete this announcement?')) return;
    try {
      await deleteDoc(doc(db, 'announcements', id));
      setList(prev => prev.filter(a => a.id !== id));
      showToast('Deleted');
    } catch { showToast('Delete failed', 'error'); }
  };

  return (
    <div>
      <SectionHeader title="Announcements" sub="Publish platform-wide notices" />
      <Card style={{ marginBottom: 28 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>New Announcement</h3>
        <FieldInput label="Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Announcement title" />
        <FieldTextarea label="Body" value={body} onChange={e => setBody(e.target.value)} placeholder="Announcement content…" />
        <Btn onClick={add} disabled={saving}>{saving ? 'Publishing…' : 'Publish'}</Btn>
      </Card>
      {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading…</p> : list.length === 0 ? (
        <Card><p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No announcements yet.</p></Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {list.map(a => (
            <Card key={a.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 2 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                    {a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                  </div>
                  {a.body && <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{a.body}</p>}
                </div>
                <Btn small variant="danger" onClick={() => del(a.id)}>Delete</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Media ─────────────────────────────────────────────────────────────────────
function MediaSection({ showToast }: SectionProps) {
  const [slides,  setSlides]  = useState<{ id: string; imageUrl: string; caption: string; order: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [url,     setUrl]     = useState('');
  const [caption, setCaption] = useState('');
  const [saving,  setSaving]  = useState(false);

  const load = useCallback(async () => {
    const snap = await getDocs(query(collection(db, 'slides'), orderBy('order', 'asc')));
    setSlides(snap.docs.map(d => ({ id: d.id, ...d.data() } as never)));
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const add = async () => {
    if (!url.trim()) { showToast('Image URL is required', 'error'); return; }
    setSaving(true);
    try {
      await addDoc(collection(db, 'slides'), { imageUrl: url, caption, order: slides.length });
      setUrl(''); setCaption('');
      await load();
      showToast('Slide added ✓');
    } catch { showToast('Failed to add slide', 'error'); }
    setSaving(false);
  };

  const del = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'slides', id));
      setSlides(prev => prev.filter(s => s.id !== id));
      showToast('Slide removed');
    } catch { showToast('Delete failed', 'error'); }
  };

  return (
    <div>
      <SectionHeader title="Media & Slider" sub="Manage homepage hero slider images" />
      <Card style={{ marginBottom: 28 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Add Slide</h3>
        <FieldInput label="Image URL" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://…" />
        <FieldInput label="Caption (optional)" value={caption} onChange={e => setCaption(e.target.value)} placeholder="Caption text" />
        <Btn onClick={add} disabled={saving}>{saving ? 'Adding…' : 'Add Slide'}</Btn>
      </Card>
      {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading…</p> : slides.length === 0 ? (
        <Card><p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No slides yet. Add the first one above.</p></Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {slides.map(s => (
            <Card key={s.id} style={{ padding: 0, overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.imageUrl} alt={s.caption || 'Slide'} style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.caption || 'No caption'}</span>
                <Btn small variant="danger" onClick={() => del(s.id)}>✕</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Pricing & Coupons ─────────────────────────────────────────────────────────
function PricingSection({ showToast }: SectionProps) {
  const [plans,   setPlans]   = useState<{ id: string; name: string; price: number; features: string; popular: boolean }[]>([]);
  const [coupons, setCoupons] = useState<{ id: string; code: string; discount: number; type: string; expiry: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [pName, setPName]     = useState('');
  const [pPrice, setPPrice]   = useState('');
  const [pFeats, setPFeats]   = useState('');
  const [pPop, setPPop]       = useState(false);
  const [cCode, setCCode]     = useState('');
  const [cDisc, setCDisc]     = useState('');
  const [cType, setCType]     = useState('percent');
  const [cExp, setCExp]       = useState('');

  const load = useCallback(async () => {
    try {
      const [ps, cs] = await Promise.all([
        getDocs(query(collection(db, 'plans'), orderBy('price', 'asc'))),
        getDocs(query(collection(db, 'coupons'), orderBy('createdAt', 'desc'))),
      ]);
      setPlans(ps.docs.map(d => ({ id: d.id, ...d.data() } as never)));
      setCoupons(cs.docs.map(d => ({ id: d.id, ...d.data() } as never)));
    } catch { showToast('Failed to load data', 'error'); }
    setLoading(false);
  }, [showToast]);
  useEffect(() => { load(); }, [load]);

  const addPlan = async () => {
    if (!pName.trim()) { showToast('Plan name is required', 'error'); return; }
    try {
      await addDoc(collection(db, 'plans'), { name: pName, price: parseFloat(pPrice) || 0, features: pFeats, popular: pPop, createdAt: serverTimestamp() });
      setPName(''); setPPrice(''); setPFeats(''); setPPop(false);
      await load();
      showToast('Plan added ✓');
    } catch { showToast('Failed to add plan', 'error'); }
  };

  const delPlan = async (id: string) => {
    if (!confirm('Delete this plan?')) return;
    try { await deleteDoc(doc(db, 'plans', id)); setPlans(p => p.filter(x => x.id !== id)); showToast('Plan deleted'); }
    catch { showToast('Delete failed', 'error'); }
  };

  const addCoupon = async () => {
    if (!cCode.trim()) { showToast('Coupon code is required', 'error'); return; }
    try {
      await addDoc(collection(db, 'coupons'), { code: cCode.toUpperCase(), discount: parseFloat(cDisc) || 0, type: cType, expiry: cExp, createdAt: serverTimestamp() });
      setCCode(''); setCDisc(''); setCExp('');
      await load();
      showToast('Coupon added ✓');
    } catch { showToast('Failed to add coupon', 'error'); }
  };

  const delCoupon = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    try { await deleteDoc(doc(db, 'coupons', id)); setCoupons(p => p.filter(x => x.id !== id)); showToast('Coupon deleted'); }
    catch { showToast('Delete failed', 'error'); }
  };

  return (
    <div>
      <SectionHeader title="Pricing & Coupons" sub="Manage subscription plans and discount codes" />
      <Card style={{ marginBottom: 28 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Add Plan</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <FieldInput label="Name" value={pName} onChange={e => setPName(e.target.value)} placeholder="e.g. Pro" />
          <FieldInput label="Price (₹/mo)" value={pPrice} onChange={e => setPPrice(e.target.value)} type="number" placeholder="999" />
        </div>
        <FieldTextarea label="Features (one per line)" value={pFeats} onChange={e => setPFeats(e.target.value)} placeholder="Feature 1&#10;Feature 2" style={{ minHeight: 80 }} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: 16 }}>
          <input type="checkbox" checked={pPop} onChange={e => setPPop(e.target.checked)} /> Mark as Popular
        </label>
        <Btn onClick={addPlan}>Add Plan</Btn>
      </Card>
      {!loading && plans.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          {plans.map(p => (
            <Card key={p.id} style={{ position: 'relative' }}>
              {p.popular && <span style={{ position: 'absolute', top: 12, right: 12, fontSize: 10, fontWeight: 700, color: 'var(--amber)', background: 'var(--amber-subtle)', border: '1px solid var(--amber-glow)', padding: '2px 8px', borderRadius: 999 }}>POPULAR</span>}
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--amber)', marginBottom: 10 }}>₹{p.price}<span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400 }}>/mo</span></div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{p.features}</div>
              <Btn small variant="danger" onClick={() => delPlan(p.id)}>Delete</Btn>
            </Card>
          ))}
        </div>
      )}

      <Card style={{ marginBottom: 28 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Add Coupon</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <FieldInput label="Code" value={cCode} onChange={e => setCCode(e.target.value)} placeholder="SAVE20" />
          <FieldInput label="Discount" value={cDisc} onChange={e => setCDisc(e.target.value)} type="number" placeholder="20" />
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</label>
            <select value={cType} onChange={e => setCType(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}>
              <option value="percent">Percent (%)</option>
              <option value="flat">Flat (₹)</option>
            </select>
          </div>
        </div>
        <FieldInput label="Expiry Date" value={cExp} onChange={e => setCExp(e.target.value)} type="date" />
        <Btn onClick={addCoupon}>Add Coupon</Btn>
      </Card>
      {!loading && coupons.length > 0 && (
        <TableWrap headers={['Code', 'Discount', 'Type', 'Expiry', '']}>
          {coupons.map(c => (
            <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '11px 16px', fontWeight: 700, color: 'var(--amber)', fontFamily: 'monospace', fontSize: 13 }}>{c.code}</td>
              <td style={{ padding: '11px 16px', color: 'var(--text-primary)' }}>{c.discount}{c.type === 'percent' ? '%' : '₹'}</td>
              <td style={{ padding: '11px 16px', color: 'var(--text-muted)' }}>{c.type}</td>
              <td style={{ padding: '11px 16px', color: 'var(--text-muted)', fontSize: 12 }}>{c.expiry || '—'}</td>
              <td style={{ padding: '11px 16px' }}><Btn small variant="danger" onClick={() => delCoupon(c.id)}>Delete</Btn></td>
            </tr>
          ))}
        </TableWrap>
      )}
    </div>
  );
}

// ── Page Editor ───────────────────────────────────────────────────────────────
type PageSection = { heading: string; body: string };
type PageData    = { title: string; sections: PageSection[]; updatedAt?: string };

const PAGE_TABS = [
  { id: 'about',   label: 'About' },
  { id: 'contact', label: 'Contact' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'terms',   label: 'Terms & Conditions' },
  { id: 'privacy', label: 'Privacy Policy' },
];

function PageEditorSection({ showToast }: SectionProps) {
  const [tab,     setTab]     = useState('about');
  const [data,    setData]    = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [dirty,   setDirty]   = useState(false);

  const loadPage = useCallback(async (pageId: string) => {
    setLoading(true);
    setDirty(false);
    try {
      const snap = await getDoc(doc(db, 'pages', pageId));
      if (snap.exists()) {
        setData(snap.data() as PageData);
      } else {
        // Load defaults from codebase — all real content pre-populated
        const defaults = PAGE_DEFAULTS[pageId];
        if (defaults) setData({ ...defaults });
        else setData({ title: pageId, sections: [] });
      }
    } catch {
      showToast('Failed to load page', 'error');
      const defaults = PAGE_DEFAULTS[pageId];
      if (defaults) setData({ ...defaults });
    }
    setLoading(false);
  }, [showToast]);

  useEffect(() => { loadPage(tab); }, [tab, loadPage]);

  const updateSection = (i: number, field: 'heading' | 'body', value: string) => {
    if (!data) return;
    const sections = data.sections.map((s, idx) => idx === i ? { ...s, [field]: value } : s);
    setData({ ...data, sections });
    setDirty(true);
  };

  const addSection = () => {
    if (!data) return;
    setData({ ...data, sections: [...data.sections, { heading: 'New Section', body: '' }] });
    setDirty(true);
  };

  const removeSection = (i: number) => {
    if (!data) return;
    if (!confirm('Remove this section?')) return;
    setData({ ...data, sections: data.sections.filter((_, idx) => idx !== i) });
    setDirty(true);
  };

  const moveSection = (i: number, dir: -1 | 1) => {
    if (!data) return;
    const arr = [...data.sections];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setData({ ...data, sections: arr });
    setDirty(true);
  };

  const savePage = async () => {
    if (!data) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'pages', tab), {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      setDirty(false);
      showToast(`${PAGE_TABS.find(p => p.id === tab)?.label} saved ✓`);
    } catch {
      showToast('Failed to save page', 'error');
    }
    setSaving(false);
  };

  const resetToDefault = async () => {
    if (!confirm('Reset this page to the original codebase content? All saved changes will be overwritten.')) return;
    const defaults = PAGE_DEFAULTS[tab];
    if (defaults) { setData({ ...defaults }); setDirty(true); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-0.02em' }}>Page Editor</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Edit every line of About, Contact, Pricing, Terms &amp; Privacy pages. Changes are saved to Firestore and read by the live pages.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {dirty && (
            <span style={{ padding: '6px 12px', borderRadius: 'var(--r-md)', background: 'rgba(220,140,0,0.1)', border: '1px solid rgba(220,140,0,0.25)', color: 'var(--amber)', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              ● Unsaved changes
            </span>
          )}
          <Btn variant="ghost" onClick={resetToDefault} small>Reset to Default</Btn>
          <Btn onClick={savePage} disabled={saving || !dirty}>
            <Icon d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8" size={14} />
            {saving ? 'Saving…' : 'Save Page'}
          </Btn>
        </div>
      </div>

      {/* Page tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 4, flexWrap: 'wrap' }}>
        {PAGE_TABS.map(p => (
          <button key={p.id} onClick={() => setTab(p.id)} style={{
            padding: '7px 16px', borderRadius: 'var(--r-md)', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: tab === p.id ? 600 : 400,
            background: tab === p.id ? 'var(--amber)' : 'transparent',
            color: tab === p.id ? '#fff' : 'var(--text-secondary)',
            transition: 'all 0.15s',
          }}>{p.label}</button>
        ))}
      </div>

      {loading ? (
        <Card><p style={{ color: 'var(--text-muted)' }}>Loading page content from Firestore…</p></Card>
      ) : !data ? null : (
        <div>
          {/* Page title */}
          <Card style={{ marginBottom: 20 }}>
            <FieldInput label="Page Title (meta)" value={data.title}
              onChange={e => { setData({ ...data, title: e.target.value }); setDirty(true); }} />
            {data.updatedAt && (
              <p style={{ fontSize: 11, color: 'var(--text-faint)', margin: 0 }}>
                Last saved: {new Date(data.updatedAt).toLocaleString('en-IN')}
              </p>
            )}
          </Card>

          {/* Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {data.sections.map((s, i) => (
              <Card key={i} style={{ borderLeft: '3px solid var(--amber-glow)', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Section {i + 1}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => moveSection(i, -1)} disabled={i === 0}
                      style={{ padding: '3px 8px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: i === 0 ? 'not-allowed' : 'pointer', fontSize: 11, opacity: i === 0 ? 0.4 : 1 }}>↑</button>
                    <button onClick={() => moveSection(i, 1)} disabled={i === data.sections.length - 1}
                      style={{ padding: '3px 8px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: i === data.sections.length - 1 ? 'not-allowed' : 'pointer', fontSize: 11, opacity: i === data.sections.length - 1 ? 0.4 : 1 }}>↓</button>
                    <button onClick={() => removeSection(i)}
                      style={{ padding: '3px 8px', borderRadius: 'var(--r-md)', border: '1px solid rgba(180,30,45,0.2)', background: 'transparent', color: 'var(--crimson)', cursor: 'pointer', fontSize: 11 }}>Remove</button>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 12, alignItems: 'flex-start' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Label / Heading</label>
                    <input value={s.heading} onChange={e => updateSection(i, 'heading', e.target.value)}
                      style={{ width: '100%', padding: '7px 10px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--amber)', fontSize: 13, fontWeight: 600, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Content</label>
                    <textarea value={s.body} onChange={e => updateSection(i, 'body', e.target.value)}
                      style={{ width: '100%', padding: '7px 10px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text-primary)', fontSize: 13, outline: 'none', minHeight: s.body.length > 80 ? 100 : 42, resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.6 }} />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Btn variant="ghost" onClick={addSection}>
            <Icon d="M12 5v14M5 12h14" size={14} />
            Add Section
          </Btn>
        </div>
      )}
    </div>
  );
}

// ── SEO ───────────────────────────────────────────────────────────────────────
function SeoSection({ showToast }: SectionProps) {
  const PAGES_SEO = ['home', 'about', 'contact', 'pricing', 'listings', 'terms', 'privacy'];
  const [selPage, setSelPage] = useState('home');
  const [meta,    setMeta]    = useState({ title: '', description: '', keywords: '', ogImage: '' });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    setLoading(true);
    getDoc(doc(db, 'seo', selPage))
      .then(snap => {
        if (snap.exists()) setMeta(snap.data() as typeof meta);
        else setMeta({ title: '', description: '', keywords: '', ogImage: '' });
        setLoading(false);
      })
      .catch(() => { showToast('Failed to load SEO data', 'error'); setLoading(false); });
  }, [selPage, showToast]);

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'seo', selPage), { ...meta, updatedAt: serverTimestamp() });
      showToast(`SEO for "${selPage}" saved ✓`);
    } catch { showToast('Save failed', 'error'); }
    setSaving(false);
  };

  return (
    <div>
      <SectionHeader title="SEO & Meta" sub="Manage page-level meta titles, descriptions, and OG images" />
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {PAGES_SEO.map(p => (
          <button key={p} onClick={() => setSelPage(p)} style={{
            padding: '6px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', fontSize: 13,
            fontWeight: selPage === p ? 600 : 400, cursor: 'pointer',
            background: selPage === p ? 'var(--amber)' : 'var(--surface)',
            color: selPage === p ? '#fff' : 'var(--text-secondary)',
          }}>{p}</button>
        ))}
      </div>
      {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading…</p> : (
        <Card>
          <FieldInput label="Meta Title" value={meta.title} onChange={e => setMeta(m => ({ ...m, title: e.target.value }))} placeholder="Page title (50–60 chars ideal)" />
          <div style={{ fontSize: 12, color: meta.title.length > 60 ? 'var(--crimson)' : 'var(--text-faint)', marginTop: -12, marginBottom: 16 }}>{meta.title.length}/60 characters</div>
          <FieldTextarea label="Meta Description" value={meta.description} onChange={e => setMeta(m => ({ ...m, description: e.target.value }))} placeholder="Page description (150–160 chars ideal)" style={{ minHeight: 72 }} />
          <div style={{ fontSize: 12, color: meta.description.length > 160 ? 'var(--crimson)' : 'var(--text-faint)', marginTop: -12, marginBottom: 16 }}>{meta.description.length}/160 characters</div>
          <FieldInput label="Keywords (comma-separated)" value={meta.keywords} onChange={e => setMeta(m => ({ ...m, keywords: e.target.value }))} placeholder="local business, India, directory" />
          <FieldInput label="OG Image URL" value={meta.ogImage} onChange={e => setMeta(m => ({ ...m, ogImage: e.target.value }))} placeholder="https://…" />
          <Btn onClick={save} disabled={saving}>
            <Icon d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8" size={14} />
            {saving ? 'Saving…' : 'Save SEO'}
          </Btn>
        </Card>
      )}
    </div>
  );
}

// ── Settings ──────────────────────────────────────────────────────────────────
function SettingsSection({ showToast }: SectionProps) {
  const [cfg, setCfg] = useState({
    siteName: 'BhartiyaBazar',
    supportEmail: 'support@bhartiyabazar.in',
    phone: '+91 11 4567 8900',
    address: 'DLF Cyber City, Gurgaon, Haryana 122002',
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
    maintenanceMode: false,
    registrationOpen: true,
    listingsPublic: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'config', 'site'))
      .then(snap => { if (snap.exists()) setCfg(prev => ({ ...prev, ...snap.data() })); setLoading(false); })
      .catch(() => { showToast('Failed to load settings', 'error'); setLoading(false); });
  }, [showToast]);

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'config', 'site'), { ...cfg, updatedAt: serverTimestamp() });
      showToast('Settings saved ✓');
    } catch { showToast('Save failed', 'error'); }
    setSaving(false);
  };

  const Toggle = ({ label, k }: { label: string; k: keyof typeof cfg }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{label}</span>
      <button onClick={() => setCfg(c => ({ ...c, [k]: !c[k] } as typeof cfg))} style={{
        width: 44, height: 24, borderRadius: 999, border: 'none', cursor: 'pointer', position: 'relative',
        background: cfg[k] ? 'var(--amber)' : 'var(--border-strong)', transition: 'background 0.2s',
      }}>
        <span style={{ position: 'absolute', top: 3, left: cfg[k] ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', display: 'block' }} />
      </button>
    </div>
  );

  if (loading) return <p style={{ color: 'var(--text-muted)' }}>Loading…</p>;
  return (
    <div>
      <SectionHeader title="Site Settings" sub="Global configuration for the BhartiyaBazar platform" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <Card>
          <h3 style={{ margin: '0 0 20px', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>General</h3>
          <FieldInput label="Site Name" value={cfg.siteName} onChange={e => setCfg(c => ({ ...c, siteName: e.target.value }))} />
          <FieldInput label="Support Email" value={cfg.supportEmail} onChange={e => setCfg(c => ({ ...c, supportEmail: e.target.value }))} type="email" />
          <FieldInput label="Phone Number" value={cfg.phone} onChange={e => setCfg(c => ({ ...c, phone: e.target.value }))} />
          <FieldTextarea label="Address" value={cfg.address} onChange={e => setCfg(c => ({ ...c, address: e.target.value }))} style={{ minHeight: 72 }} />
        </Card>
        <Card>
          <h3 style={{ margin: '0 0 20px', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Social Links</h3>
          <FieldInput label="Facebook URL" value={cfg.facebookUrl} onChange={e => setCfg(c => ({ ...c, facebookUrl: e.target.value }))} placeholder="https://facebook.com/…" />
          <FieldInput label="Instagram URL" value={cfg.instagramUrl} onChange={e => setCfg(c => ({ ...c, instagramUrl: e.target.value }))} placeholder="https://instagram.com/…" />
          <FieldInput label="Twitter / X URL" value={cfg.twitterUrl} onChange={e => setCfg(c => ({ ...c, twitterUrl: e.target.value }))} placeholder="https://twitter.com/…" />
          <FieldInput label="LinkedIn URL" value={cfg.linkedinUrl} onChange={e => setCfg(c => ({ ...c, linkedinUrl: e.target.value }))} placeholder="https://linkedin.com/…" />
        </Card>
      </div>
      <Card style={{ marginTop: 24 }}>
        <h3 style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Platform Controls</h3>
        <Toggle label="Maintenance Mode (shows maintenance page to all users)" k="maintenanceMode" />
        <Toggle label="New User Registration Open" k="registrationOpen" />
        <Toggle label="Listings Publicly Visible" k="listingsPublic" />
      </Card>
      <div style={{ marginTop: 20 }}>
        <Btn onClick={save} disabled={saving}>
          <Icon d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8" size={14} />
          {saving ? 'Saving…' : 'Save Settings'}
        </Btn>
      </div>
    </div>
  );
}