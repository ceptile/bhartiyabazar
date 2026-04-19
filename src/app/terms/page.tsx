import Link from 'next/link';

export default function TermsPage() {
  const section = (title: string, content: string) => (
    <div style={{ marginBottom: 36 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>{title}</h2>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.85, maxWidth: '100%' }}>{content}</p>
    </div>
  );

  return (
    <div style={{ background: 'var(--bg)', paddingTop: 64 }}>
      <section style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: 'clamp(40px,7vw,72px) 0' }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 12 }}>Legal</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>Terms of Service</h1>
          <p style={{ fontSize: 13, color: 'var(--text-faint)' }}>Last updated: 1 January 2024</p>
        </div>
      </section>
      <div className="container" style={{ maxWidth: 720, paddingTop: 48, paddingBottom: 80 }}>
        {section('Acceptance of Terms', 'By accessing or using BhartiyaBazar ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, please discontinue use immediately. These terms apply to all users, including business owners, consumers, and visitors.')}
        {section('Use of the Platform', 'You may use the Platform for lawful purposes only. You agree not to post false, misleading, or defamatory content; impersonate any person or business; attempt to gain unauthorised access to any part of the Platform; or use automated tools to scrape or harvest data without prior written consent.')}
        {section('Business Listings', 'Business owners are responsible for the accuracy of their listing information. BhartiyaBazar reserves the right to remove or modify any listing that violates these terms, contains false information, or is reported by users as misleading. Verified badges are granted after manual review and may be revoked at any time.')}
        {section('Reviews and Content', 'Users may submit reviews and ratings for businesses. Reviews must be based on genuine first-hand experience. BhartiyaBazar does not endorse any review and is not liable for user-generated content. We reserve the right to remove reviews that violate our content policy.')}
        {section('Intellectual Property', 'All content on the Platform — including logos, design, code, and data — is owned by or licensed to BhartiyaBazar. You may not reproduce, distribute, or create derivative works without express written permission.')}
        {section('Limitation of Liability', 'BhartiyaBazar provides the Platform on an "as is" basis. We make no warranties regarding accuracy, availability, or fitness for a particular purpose. To the maximum extent permitted by Indian law, BhartiyaBazar shall not be liable for indirect, incidental, or consequential damages.')}
        {section('Governing Law', 'These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Gurgaon, Haryana.')}
        {section('Changes to Terms', 'We may update these Terms from time to time. Continued use of the Platform after changes constitutes acceptance of the revised Terms. We will notify users of material changes via email or on-platform notice.')}
        <div style={{ paddingTop: 24, borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Questions about these Terms? <Link href="/contact" style={{ color: 'var(--amber)', fontWeight: 600 }}>Contact us</Link></p>
        </div>
      </div>
    </div>
  );
}