'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

type Theme = 'dark' | 'light' | 'system';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Read current theme from html data-theme attribute (set by apply or system default)
    const current = document.documentElement.getAttribute('data-theme') as Theme | null;
    setTheme(current ?? 'system');
  }, []);

  const apply = (t: Theme) => {
    setTheme(t);
    const root = document.documentElement;
    if (t === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', t);
    }
  };

  if (!mounted) return null;

  const options: { value: Theme; icon: React.ReactNode; label: string }[] = [
    { value: 'light',  icon: <Sun     size={14} />, label: 'Light'  },
    { value: 'dark',   icon: <Moon    size={14} />, label: 'Dark'   },
    { value: 'system', icon: <Monitor size={14} />, label: 'System' },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Select colour theme"
      style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)',
        padding: '3px',
        gap: '2px',
      }}
    >
      {options.map(o => (
        <button
          key={o.value}
          role="radio"
          aria-checked={theme === o.value}
          aria-label={`${o.label} theme`}
          onClick={() => apply(o.value)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 10px',
            borderRadius: 'var(--r-md)',
            fontSize: 12,
            fontWeight: 600,
            fontFamily: 'var(--font-body)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all var(--t)',
            background: theme === o.value ? 'var(--amber)' : 'transparent',
            color: theme === o.value ? '#fff' : 'var(--text-muted)',
          }}
        >
          {o.icon}
          <span className="hide-mobile">{o.label}</span>
        </button>
      ))}
    </div>
  );
}
