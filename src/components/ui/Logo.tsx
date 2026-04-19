import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'mark' | 'full' | 'text';
  className?: string;
}

const sizes = {
  sm: { mark: 28, fontSize: 15 },
  md: { mark: 36, fontSize: 20 },
  lg: { mark: 48, fontSize: 26 },
};

export default function Logo({ size = 'md', variant = 'full', className = '' }: LogoProps) {
  const s = sizes[size];

  const Mark = () => (
    <svg
      width={s.mark}
      height={s.mark}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="BhartiyaBazar mark"
      role="img"
    >
      {/* Liquid-glass rounded square */}
      <rect width="48" height="48" rx="13" fill="url(#logo-grad)" />
      {/* Subtle inner glow ring */}
      <rect x="1" y="1" width="46" height="46" rx="12.5" stroke="rgba(255,255,255,0.18)" strokeWidth="1" fill="none" />
      {/* "bB" in EB Garamond rendered as SVG text */}
      <text
        x="24"
        y="34"
        textAnchor="middle"
        fontFamily="'EB Garamond', Georgia, serif"
        fontWeight="700"
        fontSize="26"
        fill="#ffffff"
        letterSpacing="-1"
      >
        bB
      </text>
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B00" />
          <stop offset="0.5" stopColor="#E8321A" />
          <stop offset="1" stopColor="#C97F00" />
        </linearGradient>
      </defs>
    </svg>
  );

  const TextLogo = () => (
    <span
      style={{
        fontFamily: "'EB Garamond', Georgia, serif",
        fontWeight: 700,
        fontSize: s.fontSize,
        letterSpacing: '-0.01em',
        lineHeight: 1,
        color: 'var(--text-primary)',
      }}
    >
      Bhartiya<span style={{ color: 'var(--amber)' }}>Bazar</span>
    </span>
  );

  if (variant === 'mark')  return <Mark />;
  if (variant === 'text')  return <TextLogo />;

  return (
    <div className={`flex items-center gap-2.5 ${className}`} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Mark />
      <TextLogo />
    </div>
  );
}