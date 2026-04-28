'use client';
import Link from 'next/link';
import { usePageContent } from '@/hooks/usePageContent';

const SECTIONS = [
  'Information We Collect',
  'How We Use Your Information',
  'Cookies and Tracking',
  'Data Sharing',
  'Data Retention',
  'Security',
  'Your Rights',
  "Children's Privacy",
  'Changes to This Policy',
];

export default function PrivacyPage() {
  const { get } = usePageContent('privacy');

  return (
    <div style={{ background: 'var(--bg)', paddingTop: 64 }}>
      <section style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: 'clamp(40px,7vw,72px) 0' }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 12 }}>Legal</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>Privacy Policy</h1>
          <p style={{ fontSize: 13, color: 'var(--text-faint)' }}>Last updated: {get('Last Updated', '1 January 2024')}</p>
        </div>
      </section>
      <div className="container" style={{ maxWidth: 720, paddingTop: 48, paddingBottom: 80 }}>
        {SECTIONS.map(title => (
          <div key={title} style={{ marginBottom: 36 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>{title}</h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.85, maxWidth: '100%' }}>
              {get(title, '')}
            </p>
          </div>
        ))}
        <div style={{ paddingTop: 24, borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            {get('Footer Note', 'Privacy questions? Email us at')}{' '}
            <Link href="mailto:privacy@bhartiyabazar.in" style={{ color: 'var(--amber)', fontWeight: 600 }}>privacy@bhartiyabazar.in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
