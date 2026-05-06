'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  getBusinessPageSettings,
  updateBusinessPageSettings,
  uploadBusinessMedia,
  getBusinessMedia,
  deleteBusinessMedia,
  updateMediaOrder,
  getPredefinedThemes,
  applyTheme,
  resetBusinessPageToDefault,
} from '@/lib/business-page';

function Icon({ d, size = 18 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export default function BusinessPageEditor() {
  const { user } = useAuth();
  const router = useRouter();
  const [businessSlug, setBusinessSlug] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('theme');
  const [settings, setSettings] = useState<any>(null);
  const [media, setMedia] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [predefinedThemes] = useState(getPredefinedThemes());

  const TABS = [
    { id: 'theme', label: 'Theme', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
    { id: 'hero', label: 'Hero Section', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
    { id: 'media', label: 'Media', icon: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7' },
    { id: 'about', label: 'About', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' },
    { id: 'services', label: 'Services', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
    { id: 'products', label: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { id: 'reviews', label: 'Reviews', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
    { id: 'contact', label: 'Contact', icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 4.9 2 2 0 0 1 3.59 2.72h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.09a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17.5z' },
    { id: 'seo', label: 'SEO', icon: 'M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z' },
    { id: 'advanced', label: 'Advanced', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  ];

  useEffect(() => {
    if (user && user.businessSlug) {
      setBusinessSlug(user.businessSlug);
      loadSettings(user.businessSlug);
      loadMedia(user.businessSlug);
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadSettings = async (slug: string) => {
    try {
      const data = await getBusinessPageSettings(slug);
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMedia = async (slug: string) => {
    try {
      const data = await getBusinessMedia(slug);
      setMedia(data);
    } catch (error) {
      console.error('Error loading media:', error);
    }
  };

  const handleSave = async () => {
    if (!businessSlug) return;
    setSaving(true);
    try {
      await updateBusinessPageSettings(businessSlug, settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleThemeApply = async (themeId: string) => {
    if (!businessSlug) return;
    try {
      await applyTheme(businessSlug, themeId);
      await loadSettings(businessSlug);
      alert('Theme applied successfully!');
    } catch (error) {
      console.error('Error applying theme:', error);
      alert('Failed to apply theme');
    }
  };

  const handleReset = async () => {
    if (!businessSlug) return;
    if (!confirm('Are you sure you want to reset to default settings? This cannot be undone.')) return;
    try {
      await resetBusinessPageToDefault(businessSlug);
      await loadSettings(businessSlug);
      alert('Settings reset to default!');
    } catch (error) {
      console.error('Error resetting settings:', error);
      alert('Failed to reset settings');
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !businessSlug) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const type = file.type.startsWith('video/') ? 'video' : 'image';
        await uploadBusinessMedia(businessSlug, file, type, media.length + i);
      }
      await loadMedia(businessSlug);
      alert('Media uploaded successfully!');
    } catch (error) {
      console.error('Error uploading media:', error);
      alert('Failed to upload media');
    } finally {
      setUploading(false);
    }
  };

  const handleMediaDelete = async (mediaId: string) => {
    if (!confirm('Are you sure you want to delete this media?')) return;
    try {
      await deleteBusinessMedia(mediaId);
      await loadMedia(businessSlug);
    } catch (error) {
      console.error('Error deleting media:', error);
      alert('Failed to delete media');
    }
  };

  const updateSettings = (path: string, value: any) => {
    setSettings(prev => {
      const updated = { ...prev };
      const keys = path.split('.');
      let current = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!businessSlug) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center', padding: 40, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>No Business Found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>You need to register a business first to customize your page.</p>
          <button
            onClick={() => router.push('/register-business')}
            style={{
              padding: '12px 24px',
              borderRadius: 8,
              background: 'var(--amber)',
              color: '#fff',
              border: 'none',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Register Business
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingTop: 80, paddingBottom: 60 }}>
      <div className="container" style={{ maxWidth: 1400 }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: "'EB Garamond',serif", fontSize: 36, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Business Page Editor</h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>Customize your business page with themes, media, and advanced features</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={handleReset}
              style={{
                padding: '10px 20px',
                borderRadius: 8,
                background: 'var(--surface-2)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Reset to Default
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '10px 24px',
                borderRadius: 8,
                background: 'var(--amber)',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                fontSize: 14,
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24, alignItems: 'start' }}>
          {/* Sidebar */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 12px', position: 'sticky', top: 80 }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  marginBottom: 2,
                  textAlign: 'left',
                  fontSize: 13,
                  fontWeight: activeTab === tab.id ? 600 : 400,
                  background: activeTab === tab.id ? 'var(--amber-subtle)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--amber)' : 'var(--text-secondary)',
                }}
              >
                <Icon d={tab.icon} size={15} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 32 }}>
            {activeTab === 'theme' && <ThemeTab settings={settings} updateSettings={updateSettings} onApplyTheme={handleThemeApply} predefinedThemes={predefinedThemes} />}
            {activeTab === 'hero' && <HeroTab settings={settings} updateSettings={updateSettings} />}
            {activeTab === 'media' && <MediaTab media={media} onUpload={handleMediaUpload} onDelete={handleMediaDelete} uploading={uploading} />}
            {activeTab === 'about' && <AboutTab settings={settings} updateSettings={updateSettings} />}
            {activeTab === 'services' && <ServicesTab settings={settings} updateSettings={updateSettings} />}
            {activeTab === 'products' && <ProductsTab settings={settings} updateSettings={updateSettings} />}
            {activeTab === 'reviews' && <ReviewsTab settings={settings} updateSettings={updateSettings} />}
            {activeTab === 'contact' && <ContactTab settings={settings} updateSettings={updateSettings} />}
            {activeTab === 'seo' && <SeoTab settings={settings} updateSettings={updateSettings} />}
            {activeTab === 'advanced' && <AdvancedTab settings={settings} updateSettings={updateSettings} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Theme Tab
function ThemeTab({ settings, updateSettings, onApplyTheme, predefinedThemes }: any) {
  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Theme Customization</h2>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32 }}>Choose a predefined theme or customize colors and fonts</p>

      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Predefined Themes</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {predefinedThemes.map(theme => (
          <div
            key={theme.id}
            onClick={() => onApplyTheme(theme.id)}
            style={{
              padding: 16,
              borderRadius: 12,
              border: `2px solid ${settings?.theme?.id === theme.id ? 'var(--amber)' : 'var(--border)'}`,
              background: 'var(--surface-2)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--amber)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = settings?.theme?.id === theme.id ? 'var(--amber)' : 'var(--border)'}
          >
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: theme.primaryColor }} />
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: theme.secondaryColor }} />
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: theme.accentColor }} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{theme.id.charAt(0).toUpperCase() + theme.id.slice(1)}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{theme.headingFont}</div>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Custom Colors</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Primary Color</label>
          <input
            type="color"
            value={settings?.theme?.primaryColor || '#2563eb'}
            onChange={(e) => updateSettings('theme.primaryColor', e.target.value)}
            style={{ width: '100%', height: 40, borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer' }}
          />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Secondary Color</label>
          <input
            type="color"
            value={settings?.theme?.secondaryColor || '#1e40af'}
            onChange={(e) => updateSettings('theme.secondaryColor', e.target.value)}
            style={{ width: '100%', height: 40, borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer' }}
          />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Accent Color</label>
          <input
            type="color"
            value={settings?.theme?.accentColor || '#f59e0b'}
            onChange={(e) => updateSettings('theme.accentColor', e.target.value)}
            style={{ width: '100%', height: 40, borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer' }}
          />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Background Color</label>
          <input
            type="color"
            value={settings?.theme?.backgroundColor || '#ffffff'}
            onChange={(e) => updateSettings('theme.backgroundColor', e.target.value)}
            style={{ width: '100%', height: 40, borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer' }}
          />
        </div>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Typography</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Heading Font</label>
          <select
            value={settings?.theme?.headingFont || 'Inter'}
            onChange={(e) => updateSettings('theme.headingFont', e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', cursor: 'pointer' }}
          >
            <option value="Inter">Inter</option>
            <option value="Playfair Display">Playfair Display</option>
            <option value="Montserrat">Montserrat</option>
            <option value="Georgia">Georgia</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Lato">Lato</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Body Font</label>
          <select
            value={settings?.theme?.bodyFont || 'Inter'}
            onChange={(e) => updateSettings('theme.bodyFont', e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', cursor: 'pointer' }}
          >
            <option value="Inter">Inter</option>
            <option value="Playfair Display">Playfair Display</option>
            <option value="Montserrat">Montserrat</option>
            <option value="Georgia">Georgia</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Lato">Lato</option>
          </select>
        </div>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Animation Style</h3>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {['none', 'fade', 'slide', 'bounce', 'zoom'].map(anim => (
          <button
            key={anim}
            onClick={() => updateSettings('theme.animation', anim)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: `2px solid ${settings?.theme?.animation === anim ? 'var(--amber)' : 'var(--border)'}`,
              background: settings?.theme?.animation === anim ? 'var(--amber-subtle)' : 'var(--surface-2)',
              color: settings?.theme?.animation === anim ? 'var(--amber)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {anim}
          </button>
        ))}
      </div>
    </div>
  );
}

// Hero Tab
function HeroTab({ settings, updateSettings }: any) {
  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Hero Section</h2>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32 }}>Customize the main hero section of your business page</p>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Headline</label>
        <input
          type="text"
          value={settings?.heroSection?.headline || ''}
          onChange={(e) => updateSettings('heroSection.headline', e.target.value)}
          placeholder="Welcome to Our Business"
          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Subheadline</label>
        <textarea
          value={settings?.heroSection?.subheadline || ''}
          onChange={(e) => updateSettings('heroSection.subheadline', e.target.value)}
          placeholder="We provide excellent services"
          rows={3}
          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>CTA Button Text</label>
          <input
            type="text"
            value={settings?.heroSection?.ctaText || ''}
            onChange={(e) => updateSettings('heroSection.ctaText', e.target.value)}
            placeholder="Contact Us"
            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
          />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>CTA Link</label>
          <input
            type="text"
            value={settings?.heroSection?.ctaLink || ''}
            onChange={(e) => updateSettings('heroSection.ctaLink', e.target.value)}
            placeholder="#contact"
            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
          />
        </div>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Display Options</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { key: 'showMap', label: 'Show Map' },
          { key: 'showReviews', label: 'Show Reviews' },
          { key: 'showProducts', label: 'Show Products' },
        ].map(option => (
          <label key={option.key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settings?.heroSection?.[option.key] || false}
              onChange={(e) => updateSettings(`heroSection.${option.key}`, e.target.checked)}
              style={{ width: 18, height: 18 }}
            />
            <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// Media Tab
function MediaTab({ media, onUpload, onDelete, uploading }: any) {
  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Media Management</h2>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32 }}>Upload and manage images and videos for your business page</p>

      <div style={{ marginBottom: 24 }}>
        <label style={{ display: 'inline-block', padding: '12px 24px', borderRadius: 8, background: 'var(--amber)', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', border: 'none' }}>
          {uploading ? 'Uploading…' : 'Upload Media'}
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={onUpload}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </label>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>Supported formats: JPG, PNG, WebP, MP4, WebM. Max 10MB per file.</p>
      </div>

      {media.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: 'var(--surface-2)', borderRadius: 12, border: '2px dashed var(--border)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📷</div>
          <p style={{ color: 'var(--text-muted)' }}>No media uploaded yet</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {media.map((item: any) => (
            <div key={item.id} style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
              {item.type === 'video' ? (
                <video src={item.url} style={{ width: '100%', height: 150, objectFit: 'cover' }} controls />
              ) : (
                <img src={item.url} alt={item.alt} style={{ width: '100%', height: 150, objectFit: 'cover' }} />
              )}
              <button
                onClick={() => onDelete(item.id)}
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                }}
              >
                ×
              </button>
              <div style={{ padding: 12, background: 'var(--surface)' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{item.type}</div>
                <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>{new Date(item.createdAt?.seconds * 1000).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// About Tab
function AboutTab({ settings, updateSettings }: any) {
  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>About Section</h2>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32 }}>Customize the about section of your business page</p>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Section Title</label>
        <input
          type="text"
          value={settings?.aboutSection?.title || ''}
          onChange={(e) => updateSettings('aboutSection.title', e.target.value)}
          placeholder="About Us"
          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Description</label>
        <textarea
          value={settings?.aboutSection?.description || ''}
          onChange={(e) => updateSettings('aboutSection.description', e.target.value)}
          placeholder="Tell visitors about your business..."
          rows={6}
          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
        />
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Display Options</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { key: 'showTeam', label: 'Show Team Section' },
          { key: 'showTimeline', label: 'Show Timeline' },
        ].map(option => (
          <label key={option.key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settings?.aboutSection?.[option.key] || false}
              onChange={(e) => updateSettings(`aboutSection.${option.key}`, e.target.checked)}
              style={{ width: 18, height: 18 }}
            />
            <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// Services Tab
function ServicesTab({ settings, updateSettings }: any) {
  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Services Section</h2>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32 }}>Add and manage your business services</p>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Section Title</label>
        <input
          type="text"
          value={settings?.servicesSection?.title || ''}
          onChange={(e) => updateSettings('servicesSection.title', e.target.value)}
          placeholder="Our Services"
          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
        />
      </div>

      <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: 20, textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>Services management will be available in the next update</p>
        <button style={{ padding: '10px 20px', borderRadius: 8, background: 'var(--amber)', color: '#fff', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
          Coming Soon
        </button>
      </div>
    </div>
  );
}

// Products Tab
function ProductsTab({ settings, updateSettings }: any) {
  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Products Section</h2>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32 }}>Configure how products are displayed on your page</p>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Section Title</label>
        <input
          type="text"
          value={settings?.productsSection?.title || ''}
          onChange={(e) => updateSettings('productsSection.title', e.target.value)}
          placeholder="Our Products"
          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
        />
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Display Options</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
        {[
          { key: 'showFeatured', label: 'Show Featured Products' },
          { key: 'showAll', label: 'Show All Products' },
        ].map(option => (
          <label key={option.key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settings?.productsSection?.[option.key] || false}
              onChange={(e) => updateSettings(`productsSection.${option.key}`, e.target.checked)}
              style={{ width: 18, height: 18 }}
            />
            <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>{option.label}</span>
          </label>
        ))}
      </div>

      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Layout</label>
        <select
          value={settings?.productsSection?.layout || 'grid'}
          onChange={(e) => updateSettings('productsSection.layout', e.target.value)}
          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', cursor: 'pointer' }}
        >
          <option value="grid">Grid Layout</option>
          <option value="list">List Layout</option>
          <option value="carousel">Carousel Layout</option>
        </select>
      </div>
    </div>
  );
}

// Reviews Tab
function ReviewsTab({ settings, updateSettings }: any) {
  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Reviews Section</h2>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32 }}>Configure how customer reviews are displayed</p>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Section Title</label>
        <input
          type="text"
          value={settings?.reviewsSection?.title || ''}
          onChange={(e) => updateSettings('reviewsSection.title', e.target.value)}
          placeholder="Customer Reviews"
          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
        />
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Display Options</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
        {[
          { key: 'showTestimonials', label: 'Show Testimonials' },
          { key: 'showRatings', label: 'Show Star Ratings' },
        ].map(option => (
          <label key={option.key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settings?.reviewsSection?.[option.key] || false}
              onChange={(e) => updateSettings(`reviewsSection.${option.key}`, e.target.checked)}
              style={{ width: 18, height: 18 }}
            />
            <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>{option.label}</span>
          </label>
        ))}
      </div>

      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Maximum Reviews to Display</label>
        <input
          type="number"
          value={settings?.reviewsSection?.maxReviews || 6}
          onChange={(e) => updateSettings('reviewsSection.maxReviews', parseInt(e.target.value))}
          min={1}
          max={20}
          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
        />
      </div>
    </div>
  );
}

// Contact Tab
function ContactTab({ settings, updateSettings }: any) {
  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Contact Section</h2>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32 }}>Configure the contact section of your page</p>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Section Title</label>
        <input
          type="text"
          value={settings?.contactSection?.title || ''}
          onChange={(e) => updateSettings('contactSection.title', e.target.value)}
          placeholder="Contact Us"
          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Custom Message</label>
        <textarea
          value={settings?.contactSection?.customMessage || ''}
          onChange={(e) => updateSettings('contactSection.customMessage', e.target.value)}
          placeholder="Add a custom message above the contact form..."
          rows={3}
          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
        />
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Display Options</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { key: 'showForm', label: 'Show Contact Form' },
          { key: 'showMap', label: 'Show Map' },
          { key: 'showHours', label: 'Show Business Hours' },
        ].map(option => (
          <label key={option.key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settings?.contactSection?.[option.key] || false}
              onChange={(e) => updateSettings(`contactSection.${option.key}`, e.target.checked)}
              style={{ width: 18, height: 18 }}
            />
            <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// SEO Tab
function SeoTab({ settings, updateSettings }: any) {
  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>SEO Settings</h2>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32 }}>Optimize your page for search engines</p>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Meta Title</label>
        <input
          type="text"
          value={settings?.seo?.title || ''}
          onChange={(e) => updateSettings('seo.title', e.target.value)}
          placeholder="Your Business Name - Best Services in City"
          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
        />
        <p style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 4 }}>Recommended: 50-60 characters</p>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Meta Description</label>
        <textarea
          value={settings?.seo?.description || ''}
          onChange={(e) => updateSettings('seo.description', e.target.value)}
          placeholder="A compelling description of your business..."
          rows={3}
          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
        />
        <p style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 4 }}>Recommended: 150-160 characters</p>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Keywords</label>
        <input
          type="text"
          value={settings?.seo?.keywords || ''}
          onChange={(e) => updateSettings('seo.keywords', e.target.value)}
          placeholder="business, services, city, category"
          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
        />
        <p style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 4 }}>Separate keywords with commas</p>
      </div>

      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>OG Image URL</label>
        <input
          type="text"
          value={settings?.seo?.ogImage || ''}
          onChange={(e) => updateSettings('seo.ogImage', e.target.value)}
          placeholder="https://example.com/og-image.jpg"
          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
        />
        <p style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 4 }}>Image shown when shared on social media (1200x630px recommended)</p>
      </div>
    </div>
  );
}

// Advanced Tab
function AdvancedTab({ settings, updateSettings }: any) {
  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Advanced Settings</h2>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32 }}>Configure advanced page settings and custom code</p>

      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Performance Options</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        {[
          { key: 'enableAnimations', label: 'Enable Page Animations' },
          { key: 'enableLazyLoading', label: 'Enable Lazy Loading' },
          { key: 'enableAnalytics', label: 'Enable Analytics Tracking' },
        ].map(option => (
          <label key={option.key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settings?.advanced?.[option.key] !== false}
              onChange={(e) => updateSettings(`advanced.${option.key}`, e.target.checked)}
              style={{ width: 18, height: 18 }}
            />
            <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>{option.label}</span>
          </label>
        ))}
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Custom Code</h3>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Custom Head HTML</label>
        <textarea
          value={settings?.advanced?.customHead || ''}
          onChange={(e) => updateSettings('advanced.customHead', e.target.value)}
          placeholder="<meta name="custom-meta" content="value">"
          rows={4}
          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'monospace' }}
        />
        <p style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 4 }}>HTML to add in the <head> section</p>
      </div>

      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Custom Scripts</label>
        <textarea
          value={settings?.advanced?.customScripts || ''}
          onChange={(e) => updateSettings('advanced.customScripts', e.target.value)}
          placeholder="// Add custom JavaScript here"
          rows={4}
          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'monospace' }}
        />
        <p style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 4 }}>Custom JavaScript code (use with caution)</p>
      </div>
    </div>
  );
}