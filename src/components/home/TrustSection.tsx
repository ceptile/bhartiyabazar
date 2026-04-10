import { Shield, CheckCircle2, BarChart3, Zap, MessageSquareOff, RefreshCcw } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Verified Business Data',
    description: 'Every business is checked for accurate phone, address, and hours. "Last updated" shown on every listing.',
    color: '#10b981',
  },
  {
    icon: CheckCircle2,
    title: 'Trust Score System',
    description: 'Each business earns a score based on verification, review authenticity, and response speed.',
    color: '#3b82f6',
  },
  {
    icon: BarChart3,
    title: 'Free Seller Analytics',
    description: 'See profile views, clicks, and leads. Know exactly how customers find you — completely free.',
    color: 'var(--accent)',
  },
  {
    icon: Zap,
    title: 'Smart Search Engine',
    description: 'Understands intent, not just keywords. Type "AC not cooling" and we find repair shops near you.',
    color: '#f59e0b',
  },
  {
    icon: MessageSquareOff,
    title: 'Anti-Spam Protection',
    description: 'Controlled communication filters fake leads. No forced calls, no spam inquiries.',
    color: '#e879f9',
  },
  {
    icon: RefreshCcw,
    title: 'Auto-Update Prompts',
    description: 'Regular verification prompts keep data fresh. Outdated listings get flagged automatically.',
    color: '#38bdf8',
  },
]

export default function TrustSection() {
  return (
    <section className="py-20" style={{ background: 'var(--surface)' }}>
      <div className="container-site">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--accent)' }}>Why Choose Us</p>
          <h2 className="font-garamond font-bold" style={{ fontSize: 'var(--text-2xl)', color: 'var(--text-primary)' }}>
            Built on Trust, Powered by Community
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-sm" style={{ color: 'var(--text-muted)' }}>
            We solve every problem that plagues JustDial and IndiaMART — fake data, spam calls, poor UI, and outdated listings.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description, color }) => (
            <div
              key={title}
              className="flex gap-4 p-6 rounded-2xl card-hover"
              style={{ background: 'var(--background)', border: '1px solid var(--border)' }}
            >
              <div
                className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${color}18` }}
              >
                <Icon size={20} style={{ color }} />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1.5" style={{ color: 'var(--text-primary)' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
