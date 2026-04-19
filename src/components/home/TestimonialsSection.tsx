import { MessageSquare } from 'lucide-react';

export default function TestimonialsSection() {
  return (
    <section className="section-sm">
      <div className="container">
        <div className="empty-state">
          <MessageSquare className="empty-state-icon" />
          <h3>Customer Reviews Coming Soon</h3>
          <p>Be the first to review a business on BhartiyaBazar.</p>
        </div>
      </div>
    </section>
  );
}