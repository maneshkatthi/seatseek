import { motion } from 'framer-motion';
import { Rocket, Cpu, Zap, Shield, Globe, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 20 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] },
});

const s = {
  textPrimary:   { color: 'var(--text-primary)' },
  textSecondary: { color: 'var(--text-secondary)' },
  textMuted:     { color: 'var(--text-muted)' },
  accent:        { color: 'var(--accent-light)' },
  bgElevated:    { background: 'var(--bg-elevated)' },
  border:        { borderColor: 'var(--border-primary)' },
};


const techPillars = [
  { icon: Cpu,    title: 'ESP32 IoT',        desc: 'Hardware sensors at every coach door counting passengers in real time.' },
  { icon: Zap,    title: 'Real-Time Cloud',  desc: 'Supabase streams live data from train to your screen in milliseconds.' },
  { icon: Shield, title: 'Always Reliable',  desc: 'Redundant infrastructure ensures data is always fresh and accurate.' },
  { icon: Globe,  title: 'Open Platform',    desc: 'Free for every passenger. No hidden fees, no sign-up required.' },
];

export default function AboutPage() {
  return (
    <div
      className="min-h-screen pt-16"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      {/* Background */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="animated-grid absolute inset-0 opacity-60" />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, color-mix(in srgb, var(--accent) 8%, transparent), transparent)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* ── Hero Header ── */}
        <motion.div {...fadeUp(0)} className="text-center mb-20">
          {/* Logo mark */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 neon-glow"
            style={{
              background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent) 20%, transparent), color-mix(in srgb, var(--accent) 5%, transparent))',
              border: '1px solid var(--border-accent)',
            }}
          >
            <img
              src="/seatseek-logo.png"
              alt="SeatSeek"
              className="w-full h-full object-contain scale-[1.7] brightness-0 invert"
            />
          </div>

          <h1
            className="text-4xl md:text-5xl font-black tracking-tighter mb-4"
            style={s.textPrimary}
          >
            About SeatSeek
          </h1>
          <p className="text-base mb-7 max-w-md mx-auto" style={s.textSecondary}>
            A futuristic crowd-intelligence platform making Indian Railways smarter, one coach at a time.
          </p>

          {/* Powered by badge */}
          <div
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border text-sm font-medium"
            style={{
              background: 'var(--card-bg)',
              borderColor: 'var(--border-primary)',
              backdropFilter: 'blur(12px)',
              color: 'var(--text-secondary)',
            }}
          >
            <img
              src="/review-logo.png"
              alt="ReView AI"
              className="w-5 h-5 rounded-full object-contain"
            />
            Powered by
            <span style={s.accent} className="font-semibold">ReView AI Tech and Solutions</span>
          </div>
        </motion.div>

        {/* ── Mission ── */}
        <motion.div {...fadeUp(0.1)} className="card p-8 mb-6 relative overflow-hidden group">
          {/* Watermark icon */}
          <div
            className="absolute -bottom-4 -right-4 opacity-[0.04] group-hover:opacity-[0.07] transition-opacity duration-500 pointer-events-none"
          >
            <Cpu style={{ width: '9rem', height: '9rem', color: 'var(--accent-light)' }} />
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'color-mix(in srgb, var(--accent) 15%, transparent)', color: 'var(--accent-light)' }}
            >
              <Rocket style={{ width: '1.25rem', height: '1.25rem' }} />
            </div>
            <h2 className="text-xl font-bold" style={s.textPrimary}>Our Mission</h2>
          </div>
          <p className="leading-relaxed text-base relative z-10" style={s.textSecondary}>
            SeatSeek is a futuristic crowd-intelligence platform designed to make train travel across
            Indian Railways smarter and more predictable. By utilizing advanced ESP32 IoT sensors and
            real-time cloud analytics, we give passengers live insights into coach occupancy — before
            they even step onto the platform.
          </p>
        </motion.div>

        {/* ── Tech Pillars ── */}
        <motion.div {...fadeUp(0.15)} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {techPillars.map((p, i) => (
            <motion.div
              key={p.title}
              {...fadeUp(0.15 + i * 0.06)}
              className="card p-5 flex items-start gap-4"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'var(--bg-elevated)', color: 'var(--accent-light)' }}
              >
                <p.icon style={{ width: '1.1rem', height: '1.1rem' }} />
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1" style={s.textPrimary}>{p.title}</h4>
                <p className="text-xs leading-relaxed" style={s.textSecondary}>{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>


        {/* ── Engineering Excellence ── */}
        <motion.div
          {...fadeUp(0.25)}
          className="p-8 rounded-2xl border text-center"
          style={{
            background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent) 8%, transparent), color-mix(in srgb, var(--accent) 3%, transparent))',
            borderColor: 'var(--border-accent)',
          }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'color-mix(in srgb, var(--accent) 15%, transparent)', color: 'var(--accent-light)' }}
          >
            <Code2 style={{ width: '1.4rem', height: '1.4rem' }} />
          </div>
          <h3 className="text-lg font-bold mb-2" style={s.textPrimary}>Engineering Excellence</h3>
          <p className="text-sm mb-6 max-w-xs mx-auto" style={s.textSecondary}>
            Building the future of smart transit — one sensor, one coach, one journey at a time.
          </p>
          <Link to="/search">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary text-sm"
              style={{ padding: '0.65rem 1.5rem' }}
            >
              Try SeatSeek Now
            </motion.button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
