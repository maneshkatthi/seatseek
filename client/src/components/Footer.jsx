import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const links = [
  { label: 'Search',       to: '/search' },
  { label: 'Dashboard',    to: '/dashboard' },
  { label: 'About',        to: '/about' },
  { label: 'How It Works', to: '/#how-it-works' },
];

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-primary)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Top row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden shrink-0"
              style={{
                background: 'color-mix(in srgb, var(--accent) 15%, transparent)',
                border: '1px solid var(--border-accent)',
              }}
            >
              <img
                src="/seatseek-logo.png"
                alt="SeatSeek"
                className={`w-full h-full object-contain scale-[1.7] ${theme === 'dark' ? 'brightness-0 invert' : ''}`}
              />
            </div>
            <div>
              <span
                className="text-base font-bold tracking-tight block"
                style={{ color: 'var(--text-primary)' }}
              >
                Seat<span style={{ color: 'var(--accent-light)' }}>Seek</span>
              </span>
              <span
                className="text-[10px] font-medium"
                style={{ color: 'var(--text-muted)' }}
              >
                Railway Crowd Intelligence
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {links.map(l => (
              <Link
                key={l.label}
                to={l.to}
                className="text-sm font-medium transition-colors duration-150"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="section-divider mb-8" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © 2026 SeatSeek · Smart Railway Crowd Intelligence
          </p>

          <div
            className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border"
            style={{
              color: 'var(--text-muted)',
              borderColor: 'var(--border-primary)',
              background: 'var(--card-bg)',
            }}
          >
            Powered by
            <img
              src="/review-logo.png"
              alt="ReView AI"
              className="w-4 h-4 rounded-full object-contain"
            />
            <span
              className="font-semibold"
              style={{ color: 'var(--text-secondary)' }}
            >
              ReView AI
            </span>
            ·&nbsp;Team Orbit
          </div>
        </div>
      </div>
    </footer>
  );
}
