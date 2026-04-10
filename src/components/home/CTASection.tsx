import Link from 'next/link'
import { ArrowRight, PlusCircle } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'var(--background)' }}>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(249,115,22,0.08), transparent)',
          }}
        />
      </div>

      <div className="container-site relative z-10">
        <div
          className="max-w-4xl mx-auto text-center rounded-3xl py-16 px-8 md:px-16"
          style={{
            background: 'linear-gradient(135deg, var(--accent) 0%, #dc6a00 100%)',
            boxShadow: 'var(--shadow-brand)',
          }}
        >
          <h2
            className="font-garamond font-bold mb-4"
            style={{ fontSize: 'var(--text-2xl)', color: '#fff' }}
          >
            List Your Business for Free Today
          </h2>
          <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Join 50,000+ businesses already on BhartiyaBazar.
            Get discovered by lakhs of customers searching every day.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: '#fff', color: 'var(--accent)' }}
            >
              <PlusCircle size={18} />
              List Your Business — Free
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all hover:opacity-90 border-2"
              style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }}
            >
              Browse Businesses
              <ArrowRight size={18} />
            </Link>
          </div>

          <p className="mt-6 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
            ✓ No credit card required &nbsp;·&nbsp; ✓ Setup in 2 minutes &nbsp;·&nbsp; ✓ Always free
          </p>
        </div>
      </div>
    </section>
  )
}
