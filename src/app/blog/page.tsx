'use client';
import { useState } from 'react';
import Link from 'next/link';

function Icon({ d, size = 16, sw = 1.75 }: { d: string | string[]; size?: number; sw?: number }) {
  const paths = Array.isArray(d) ? d : [d];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

const POSTS = [
  {
    slug: 'how-to-get-more-reviews',
    category: 'Growth',
    title: 'How to Get More Genuine Customer Reviews for Your Business',
    excerpt: 'Reviews drive conversions. Here is a practical guide to encouraging your happy customers to leave honest feedback — without violating platform policies.',
    author: 'Priya Sharma', date: '14 Apr 2024', readTime: '5 min read', featured: true,
  },
  {
    slug: 'local-seo-guide-india',
    category: 'SEO',
    title: 'Local SEO for Indian Businesses: A Complete 2024 Guide',
    excerpt: 'Learn how to rank higher in local search results on Google Maps and BhartiyaBazar with these proven optimisation techniques.',
    author: 'Arjun Mehta', date: '8 Apr 2024', readTime: '8 min read', featured: false,
  },
  {
    slug: 'verify-your-listing',
    category: 'Platform',
    title: 'Why Verification Matters: The Trust Badge Explained',
    excerpt: 'Verified businesses receive up to 3x more profile views. We explain exactly what the verification process involves and why customers trust it.',
    author: 'Sneha Verma', date: '2 Apr 2024', readTime: '4 min read', featured: false,
  },
  {
    slug: 'business-photography-tips',
    category: 'Tips',
    title: '10 Photography Tips to Make Your Business Profile Stand Out',
    excerpt: 'High-quality photos increase enquiries by 40%. Learn how to photograph your storefront, products, and team using just a smartphone.',
    author: 'Karan Joshi', date: '25 Mar 2024', readTime: '6 min read', featured: false,
  },
  {
    slug: 'respond-to-negative-reviews',
    category: 'Customer Service',
    title: 'How to Respond to Negative Reviews Professionally',
    excerpt: 'A well-handled negative review can turn a critic into a loyal customer. Here is the framework we recommend for every business owner.',
    author: 'Anita Patel', date: '18 Mar 2024', readTime: '5 min read', featured: false,
  },
  {
    slug: 'pricing-your-services',
    category: 'Business',
    title: 'How to Price Your Services Competitively in the Indian Market',
    excerpt: 'Pricing strategy is one of the most important decisions for local businesses. We break down the research and positioning tactics that work.',
    author: 'Rahul Gupta', date: '11 Mar 2024', readTime: '7 min read', featured: false,
  },
];

const CATEGORIES = ['All', 'Growth', 'SEO', 'Platform', 'Tips', 'Customer Service', 'Business'];

const BADGE_COLORS: Record<string, string> = {
  Growth: 'var(--success)',
  SEO: 'var(--info)',
  Platform: 'var(--amber)',
  Tips: 'var(--crimson)',
  'Customer Service': 'var(--gold)',
  Business: 'var(--text-muted)',
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const featured = POSTS.find(p => p.featured)!;
  const rest = POSTS.filter(p => !p.featured && (activeCategory === 'All' || p.category === activeCategory));

  return (
    <div style={{ background: 'var(--bg)', paddingTop: 64 }}>

      {/* Header */}
      <section style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: 'clamp(48px,8vw,80px) 0' }}>
        <div className="container" style={{ maxWidth: 720, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 'var(--r-full)', border: '1px solid var(--border-hover)', background: 'var(--surface-2)', fontSize: 12, fontWeight: 600, color: 'var(--amber)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 22 }}>
            <Icon d="M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" size={13} />
            Blog
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: 16 }}>
            Insights for Indian business owners
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.75, maxWidth: '100%' }}>
            Practical guides, platform updates, and growth strategies for local businesses across India.
          </p>
        </div>
      </section>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>

        {/* Categories */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 36 }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setActiveCategory(c)}
              style={{ padding: '6px 16px', borderRadius: 'var(--r-full)', border: '1px solid var(--border)', background: activeCategory === c ? 'var(--amber)' : 'var(--surface)', color: activeCategory === c ? '#fff' : 'var(--text-secondary)', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all var(--t)' }}>
              {c}
            </button>
          ))}
        </div>

        {/* Featured post */}
        <div style={{ marginBottom: 40 }}>
          <Link href={`/blog/${featured.slug}`} className="blog-featured-card"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 0, borderRadius: 'var(--r-xl)', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--surface)', textDecoration: 'none' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--navy-2) 0%, color-mix(in oklch, var(--amber) 15%, var(--navy-2)) 100%)', minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: 'var(--r-xl)', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.7)' }}>
                <Icon d="M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" size={28} />
              </div>
            </div>
            <div style={{ padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 'var(--r-full)', background: `${BADGE_COLORS[featured.category]}18`, color: BADGE_COLORS[featured.category], border: `1px solid ${BADGE_COLORS[featured.category]}30` }}>
                  {featured.category}
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 'var(--r-full)', background: 'var(--amber-glow)', color: 'var(--amber)' }}>
                  Featured
                </span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem,2vw,1.6rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: 12 }}>{featured.title}</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 20, maxWidth: '100%' }}>{featured.excerpt}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: 'var(--text-faint)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Icon d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" size={13} />
                  {featured.author}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Icon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" size={13} />
                  {featured.date}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Icon d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" size={13} />
                  {featured.readTime}
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Post grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 18 }}>
          {rest.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card"
              style={{ borderRadius: 'var(--r-xl)', border: '1px solid var(--border)', background: 'var(--surface)', textDecoration: 'none', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ background: 'var(--surface-2)', height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-faint)' }}>
                <Icon d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" size={32} />
              </div>
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ marginBottom: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 'var(--r-full)', background: `${BADGE_COLORS[post.category]}18`, color: BADGE_COLORS[post.category], border: `1px solid ${BADGE_COLORS[post.category]}30` }}>
                    {post.category}
                  </span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.35, marginBottom: 8, flex: 1 }}>{post.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 16, maxWidth: '100%' }}>{post.excerpt}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-faint)', paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                  <span>{post.author}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Icon d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" size={12} />
                    {post.readTime}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .blog-featured-card {
          transition: box-shadow var(--t);
        }
        .blog-featured-card:hover {
          box-shadow: var(--shadow-md);
        }
        .blog-card {
          transition: box-shadow var(--t), border-color var(--t);
        }
        .blog-card:hover {
          box-shadow: var(--shadow-md);
          border-color: var(--border-hover);
        }
      `}</style>
    </div>
  );
}