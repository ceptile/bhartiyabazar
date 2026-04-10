'use client'

import { useEffect, useRef, useState } from 'react'

const stats = [
  { value: 50000, suffix: '+', label: 'Businesses Listed', icon: '🏪' },
  { value: 500, suffix: '+', label: 'Cities Covered', icon: '🌆' },
  { value: 200000, suffix: '+', label: 'Products Listed', icon: '📦' },
  { value: 1200000, suffix: '+', label: 'Monthly Searches', icon: '🔍' },
]

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

function StatCard({ value, suffix, label, icon, animate }: { value: number; suffix: string; label: string; icon: string; animate: boolean }) {
  const count = useCountUp(value, 2000, animate)
  const display = count >= 1000 ? (count >= 1000000 ? `${(count / 1000000).toFixed(1)}M` : `${(count / 1000).toFixed(0)}K`) : count.toString()
  return (
    <div
      className="flex flex-col items-center gap-2 py-8 px-4 rounded-2xl text-center card-hover"
      style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
    >
      <span className="text-4xl">{icon}</span>
      <div className="font-rajdhani font-bold" style={{ fontSize: 'var(--text-2xl)', color: 'var(--accent)' }}>
        {animate ? display : '0'}{suffix}
      </div>
      <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</p>
    </div>
  )
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-16" style={{ background: 'var(--surface)' }}>
      <div className="container-site">
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} animate={visible} />
          ))}
        </div>
      </div>
    </section>
  )
}
