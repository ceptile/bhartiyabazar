import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: { fontSize: 16, gap: 0 },
  md: { fontSize: 22, gap: 0 },
  lg: { fontSize: 30, gap: 0 },
};

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const s = sizes[size];

  return (
    <span
      className={className}
      aria-label="BhartiyaBazar"
      style={{
        fontFamily: "'EB Garamond', Georgia, serif",
        fontWeight: 700,
        fontSize: s.fontSize,
        letterSpacing: '-0.02em',
        lineHeight: 1,
        userSelect: 'none',
        display: 'inline-block',
      }}
    >
      <span style={{ color: 'var(--text-primary)' }}>Bhartiya</span>
      <span style={{ color: 'var(--amber)' }}>Bazar</span>
    </span>
  );
}