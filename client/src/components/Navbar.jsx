import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const navLinks = [
  { label: 'Home',      to: '/' },
  { label: 'Search',    to: '/search' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'About',     to: '/about' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]   = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  return (
    <motion.nav
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: scrolled ? 'var(--nav-bg)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--nav-border)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
      }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden shrink-0 glow-pulse"
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.05))',
                border: '1px solid rgba(99,102,241,0.35)',
              }}
            >
              <img
                src="/seatseek-logo.png"
                alt="SeatSeek"
                className={`w-full h-full object-contain scale-[1.7] transition-all ${theme === 'dark' ? 'brightness-0 invert' : ''}`}
              />
            </div>
            <span className="text-[1.05rem] font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Seat<span style={{ color: 'var(--accent-light)' }}>Seek</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className="relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    color: isActive ? 'var(--accent-light)' : 'var(--text-secondary)',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: 'var(--accent-glow)', border: '1px solid var(--border-accent)' }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-all duration-200"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--card-bg)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark'
                ? <Sun  className="w-4.5 h-4.5" style={{ width: '1.1rem', height: '1.1rem' }} />
                : <Moon className="w-4.5 h-4.5" style={{ width: '1.1rem', height: '1.1rem' }} />}
            </button>

            {/* CTA */}
            <Link to="/search">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary text-sm"
                style={{ padding: '0.55rem 1.1rem', borderRadius: 'var(--radius-lg)' }}
              >
                <Zap style={{ width: '0.9rem', height: '0.9rem' }} />
                Try Now
              </motion.button>
            </Link>
          </div>

          {/* Mobile: theme + hamburger */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              {theme === 'dark'
                ? <Sun  style={{ width: '1.1rem', height: '1.1rem' }} />
                : <Moon style={{ width: '1.1rem', height: '1.1rem' }} />}
            </button>
            <button
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onClick={() => setMenuOpen(v => !v)}
            >
              {menuOpen
                ? <X    style={{ width: '1.25rem', height: '1.25rem' }} />
                : <Menu style={{ width: '1.25rem', height: '1.25rem' }} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden"
            style={{
              background: 'var(--nav-bg)',
              borderTop: '1px solid var(--nav-border)',
              backdropFilter: 'blur(24px)',
            }}
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all"
                    style={{
                      color: isActive ? 'var(--accent-light)' : 'var(--text-secondary)',
                      background: isActive ? 'var(--accent-glow)' : 'transparent',
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-2">
                <Link to="/search" className="block">
                  <button
                    className="btn-primary w-full"
                    style={{ padding: '0.75rem', borderRadius: 'var(--radius-lg)' }}
                  >
                    <Zap style={{ width: '1rem', height: '1rem' }} />
                    Try SeatSeek Now
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
