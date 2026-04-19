import { Store } from 'lucide-react';
import Link from 'next/link';

export default function FeaturedBusinesses() {
  return (
    <section className="section-sm">
      <div className="container">
        <div className="section-header">
          <p className="section-label">Featured</p>
          <h2 className="section-title">Featured Businesses</h2>
          <p className="section-sub">Top-rated verified businesses will appear here once listed.</p>
        </div>
        <div className="empty-state">
          <Store className="empty-state-icon" />
          <h3>No featured businesses yet</h3>
          <p>List your business to get featured on the platform.</p>
          <Link href="/register" className="btn btn-primary">List Your Business</Link>
        </div>
      </div>
    </section>
  );
}