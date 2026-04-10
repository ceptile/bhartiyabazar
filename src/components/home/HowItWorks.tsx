const steps = [
  {
    step: '01',
    icon: '🔍',
    title: 'Search',
    description: 'Type what you need — a business, product, or service. Our smart search understands intent.',
  },
  {
    step: '02',
    icon: '🔎',
    title: 'Discover & Compare',
    description: 'Browse verified listings, compare prices, ratings, and trust scores side by side.',
  },
  {
    step: '03',
    icon: '💬',
    title: 'Contact Directly',
    description: 'Call, WhatsApp, or email the business directly — no middlemen, no hidden fees.',
  },
  {
    step: '04',
    icon: '⭐',
    title: 'Review & Trust',
    description: 'Share your experience. Your review helps build India\'s most trusted business database.',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20" style={{ background: 'var(--background)' }}>
      <div className="container-site">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--accent)' }}>Simple Process</p>
          <h2 className="font-garamond font-bold" style={{ fontSize: 'var(--text-2xl)', color: 'var(--text-primary)' }}>
            How BhartiyaBazar Works
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line */}
          <div
            className="absolute top-10 left-0 right-0 h-px hidden lg:block"
            style={{ background: 'linear-gradient(90deg, transparent, var(--border), var(--accent), var(--border), transparent)' }}
            aria-hidden
          />

          {steps.map(({ step, icon, title, description }) => (
            <div
              key={step}
              className="relative flex flex-col items-center text-center p-6 rounded-2xl gap-4 card-hover"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
            >
              {/* Step badge */}
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold z-10"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                {step}
              </div>

              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                style={{ background: 'var(--accent-subtle)', border: '1px solid rgba(249,115,22,0.2)' }}
              >
                {icon}
              </div>
              <h3 className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
