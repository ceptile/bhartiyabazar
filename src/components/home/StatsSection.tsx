'use client'

import { useEffect, useRef, useState } from 'react'

const STATS = [
  { target: 50000,   suffix: 'K+', divisor: 1000, label: 'Businesses Listed',  icon: '🏪', desc: 'Across India' },
  { target: 500,     suffix: '+',  divisor: 1,    label: 'Cities Covered',     icon: '🌆', desc: 'And growing' },
  { target: 200,     suffix: 'K+', divisor: 1,    label: 'Products Listed',    icon: '📦', desc: 'By sellers' },
  { target: 12,      suffix: 'L+', divisor: 1,    label: 'Monthly Searches',   icon: '🔍', desc: 'Every month' },
]

function useCountUp(target: number, dur = 1800, active = false) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!active) return
    let start: number | null = null
    const tick = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / dur, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setN(Math.round(e * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, dur, active])
  return n
}

function StatCard({ target, suffix, divisor, label, icon, desc, active }: { target:number; suffix:string; divisor:number; label:string; icon:string; desc:string; active:boolean }) {
  const raw = useCountUp(divisor === 1 ? target : Math.round(target / divisor), 1800, active)
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: 'clamp(20px,3vw,32px) clamp(16px,2vw,24px)',
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      textAlign: 'center',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg)'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
    >
      <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.02em', lineHeight: 1 }}>
        {active ? raw : 0}{suffix}
      </div>
      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-1)', marginTop: 6 }}>{label}</div>
      <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: 2 }}>{desc}</div>
    </div>
  )
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true) }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section style={{ background: 'var(--surface)', padding: 'clamp(48px,6vw,80px) 0' }}>
      <div className="site-container">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', marginBottom: 8 }}>By the Numbers</p>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>Trusted by Thousands</h2>
        </div>
        <div ref={ref} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
          {STATS.map(s => <StatCard key={s.label} {...s} active={active} />)}
        </div>
      </div>
    </section>
  )
}
