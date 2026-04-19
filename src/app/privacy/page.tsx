import Link from 'next/link';

export default function PrivacyPage() {
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
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>Privacy Policy</h1>
          <p style={{ fontSize: 13, color: 'var(--text-faint)' }}>Last updated: 1 January 2024</p>
        </div>
      </section>
      <div className="container" style={{ maxWidth: 720, paddingTop: 48, paddingBottom: 80 }}>
        {section('Information We Collect', 'We collect information you provide directly — such as your name, email address, phone number, and business details when you register or create a listing. We also collect usage data including pages visited, search queries, and device information to improve the Platform.')}
        {section('How We Use Your Information', 'Your information is used to operate and improve the Platform, verify business listings, send transactional communications, provide customer support, and comply with legal obligations. We do not sell your personal information to third parties.')}
        {section('Cookies and Tracking', 'We use cookies and similar technologies to maintain sessions, analyse traffic, and personalise your experience. You can disable cookies in your browser settings, though some features may not function correctly as a result.')}
        {section('Data Sharing', 'We may share your data with trusted third-party service providers who assist us in operating the Platform (such as hosting, analytics, and payment processing) under strict confidentiality agreements. We may also disclose information when required by law.')}
        {section('Data Retention', 'We retain your personal information for as long as your account is active or as needed to provide the service. You may request deletion of your account and associated data by contacting us at privacy@bhartiyabazar.in.')}
        {section('Security', 'We implement industry-standard security measures including encryption in transit (TLS), secure data storage, and access controls. However, no system is completely secure and we cannot guarantee absolute security.')}
        {section('Your Rights', 'Under applicable Indian data protection laws, you have the right to access, correct, or delete your personal information. To exercise these rights, contact us at privacy@bhartiyabazar.in. We will respond within 30 days.')}
        {section('Children\'s Privacy', 'The Platform is not directed to children under the age of 13. We do not knowingly collect personal information from minors. If you believe a minor has provided us with personal information, please contact us immediately.')}
        {section('Changes to This Policy', 'We may update this Privacy Policy periodically. We will notify you of significant changes via email or a prominent notice on the Platform. Continued use after changes constitutes acceptance of the revised policy.')}
        <div style={{ paddingTop: 24, borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Privacy questions? Email us at <Link href="mailto:privacy@bhartiyabazar.in" style={{ color: 'var(--amber)', fontWeight: 600 }}>privacy@bhartiyabazar.in</Link></p>
        </div>
      </div>
    </div>
  );
}