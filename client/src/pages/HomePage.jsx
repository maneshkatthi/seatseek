import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, ArrowRight, Frown, Clock, HelpCircle,
  Radio, Cpu, Cloud, Smartphone, Smile, Zap, Shield, ChevronRight
} from 'lucide-react';
import { getBarColor, getCoachGlowClass } from '../data/mockData';

/* ─── Animation helpers ─────────────────── */
const fadeUp = (delay = 0) => ({
  initial:   { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport:  { once: true, amount: 0.15 },
  transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] },
});

const s = { /* inline style shortcuts */
  textPrimary:   { color: 'var(--text-primary)' },
  textSecondary: { color: 'var(--text-secondary)' },
  textMuted:     { color: 'var(--text-muted)' },
  accent:        { color: 'var(--accent-light)' },
  bg:            { background: 'var(--bg-primary)' },
  bgSecondary:   { background: 'var(--bg-secondary)' },
  bgElevated:    { background: 'var(--bg-elevated)' },
  border:        { borderColor: 'var(--border-primary)' },
};

/* ─── Coach Density Card (Hero) ─────────── */
function HeroCoachCard() {
  const coaches = [
    { id: 'C1', density: 22,  label: 'Low',       type: '1A',  color: 'var(--success)' },
    { id: 'C2', density: 55,  label: 'Moderate',  type: '2A',  color: 'var(--warning)' },
    { id: 'C3', density: 88,  label: 'High',      type: '3A',  color: '#f97316'        },
    { id: 'C4', density: 61,  label: 'Moderate',  type: 'SL',  color: 'var(--warning)' },
    { id: 'C5', density: 110, label: 'Very High', type: 'UR',  color: 'var(--danger)'  },
  ];

  return (
    <div className="card p-6 relative overflow-hidden" style={{ borderColor: 'var(--border-accent)' }}>
      {/* Live badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 badge badge-green coach-pulse">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
        Live
      </div>

      <p className="text-xs font-bold tracking-widest uppercase mb-0.5" style={s.textMuted}>Crowd Intelligence</p>
      <h3 className="text-base font-bold mb-5" style={s.textPrimary}>17406 · Krishna Express</h3>

      <div className="space-y-3.5">
        {coaches.map((coach, idx) => (
          <motion.div
            key={coach.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3"
          >
            {/* Coach badge */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 border"
              style={{
                color: coach.color,
                borderColor: `color-mix(in srgb, ${coach.color} 35%, transparent)`,
                background: `color-mix(in srgb, ${coach.color} 10%, transparent)`,
              }}
            >
              {coach.type}
            </div>

            {/* Bar */}
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1.5">
                <span style={s.textSecondary}>{coach.label}</span>
                <span className="font-semibold" style={{ color: coach.color }}>
                  {Math.min(coach.density, 100)}%
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-primary)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(coach.density, 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 + idx * 0.1, ease: 'easeOut' }}
                  className="h-full rounded-full relative"
                  style={{ background: coach.color }}
                >
                  <div className="absolute inset-0 shimmer" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div
        className="mt-5 pt-4 flex items-center justify-between text-xs"
        style={{ borderTop: '1px solid var(--border-primary)' }}
      >
        <span style={s.textMuted}>Garla → Khammam</span>
        <span className="font-semibold" style={s.accent}>5 coaches · Live</span>
      </div>
    </div>
  );
}

/* ─── Problem Cards ─────────────────────── */
function ProblemSection() {
  const items = [
    { icon: Frown,       title: 'No Visibility',      desc: 'You board blind, with no idea which coach is packed.' },
    { icon: Clock,       title: 'Wasted Time',         desc: 'Walking coach-to-coach searching for a seat — fixed.' },
    { icon: HelpCircle,  title: 'Stressful Boarding',  desc: 'Peak hours feel chaotic. SeatSeek makes it calm.' },
  ];

  return (
    <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              {...fadeUp(i * 0.1)}
              className="card p-6 flex items-start gap-4"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
              >
                <item.icon style={{ width: '1.2rem', height: '1.2rem' }} />
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1" style={s.textPrimary}>{item.title}</h4>
                <p className="text-sm leading-relaxed" style={s.textSecondary}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ─────────────────────── */
function HowItWorks() {
  const steps = [
    { icon: Radio,      num: '01', title: 'Sensor Detects',   desc: 'IR sensors at coach doors count passengers in real time.' },
    { icon: Cpu,        num: '02', title: 'ESP32 Processes',  desc: 'Microcontroller calculates live occupancy per coach.' },
    { icon: Cloud,      num: '03', title: 'Cloud Syncs',      desc: 'Data pushed to Supabase, always fresh.' },
    { icon: Smartphone, num: '04', title: 'You See It Live',  desc: 'Open SeatSeek, search your train, board smart.' },
  ];

  return (
    <section id="how-it-works" className="py-24" style={s.bg}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp()} className="text-center mb-16">
          <p className="section-label">How It Works</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" style={s.textPrimary}>
            IoT Hardware Meets<br />Intelligent Software
          </h2>
          <p className="text-base max-w-xl mx-auto" style={s.textSecondary}>
            From sensor to smartphone — every step is real, live, and built for Indian Railways.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line (desktop) */}
          <div
            className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px"
            style={{ background: 'linear-gradient(90deg, transparent, var(--border-accent), transparent)' }}
          />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              {...fadeUp(i * 0.1)}
              className="relative z-10 flex flex-col items-center text-center"
            >
              {/* Step icon */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 border transition-all duration-300 hover:scale-105"
                style={{
                  background: 'var(--bg-elevated)',
                  borderColor: 'var(--border-accent)',
                  color: 'var(--accent-light)',
                  boxShadow: 'var(--shadow-accent)',
                }}
              >
                <step.icon style={{ width: '1.6rem', height: '1.6rem' }} />
              </div>
              <span className="text-xs font-black tracking-widest mb-2" style={s.accent}>{step.num}</span>
              <h4 className="font-bold text-sm mb-2" style={s.textPrimary}>{step.title}</h4>
              <p className="text-xs leading-relaxed" style={s.textSecondary}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Live Demo Preview ─────────────────── */
function LiveDemoPreview() {
  return (
    <section className="py-24" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp()} className="text-center mb-12">
          <p className="section-label">Live Preview</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" style={s.textPrimary}>
            See It Before You Board
          </h2>
          <p style={s.textSecondary} className="text-base max-w-md mx-auto">
            Real density data, beautiful interface, right on your phone.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="card p-7 max-w-xl mx-auto"
        >
          {/* Fake search bar */}
          <div className="flex gap-3 mb-7">
            {['Garla', 'Khammam'].map((station, i) => (
              <div
                key={station}
                className="flex-1 p-3.5 rounded-xl border"
                style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-primary)' }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={s.textMuted}>
                  {i === 0 ? 'From' : 'To'}
                </p>
                <p className="text-sm font-semibold" style={s.textPrimary}>{station}</p>
              </div>
            ))}
          </div>

          {/* Coach rows */}
          {[
            { label: '1A · First AC',  pct: 28,  color: 'var(--success)', badge: 'Comfortable' },
            { label: '3A · Third AC',  pct: 88,  color: '#f97316',        badge: 'Very Crowded' },
          ].map(row => (
            <div
              key={row.label}
              className="flex items-center justify-between p-4 rounded-xl border mb-3"
              style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-primary)' }}
            >
              <div>
                <p className="text-sm font-semibold" style={s.textPrimary}>{row.label}</p>
                <div className="mt-2 h-1.5 w-32 rounded-full overflow-hidden" style={{ background: 'var(--border-primary)' }}>
                  <div className="h-full rounded-full" style={{ width: `${row.pct}%`, background: row.color }} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black" style={{ color: row.color }}>{row.pct}%</p>
                <p className="text-xs" style={s.textMuted}>{row.badge}</p>
              </div>
            </div>
          ))}

          <Link to="/search" className="block mt-5">
            <button
              className="w-full btn-secondary text-sm flex items-center justify-center gap-2"
              style={{ borderRadius: 'var(--radius-lg)' }}
            >
              Try with your train <ArrowRight style={{ width: '0.9rem', height: '0.9rem' }} />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Why SeatSeek ─────────────────────── */
function WhySeatSeek() {
  const benefits = [
    { icon: Smile,  title: 'Less Stress',      desc: 'Know before you go. Pick your coach from your phone.',          color: 'var(--success)' },
    { icon: Zap,    title: 'Faster Boarding',  desc: 'No more walking the platform searching for a free seat.',       color: 'var(--accent-light)' },
    { icon: Shield, title: 'Safer Travel',     desc: 'Avoid dangerously overcrowded coaches automatically.',          color: '#f59e0b' },
  ];

  return (
    <section className="py-24" style={s.bg}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <p className="section-label">Benefits</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={s.textPrimary}>
            Why Travelers Love SeatSeek
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <motion.div key={b.title} {...fadeUp(i * 0.1)} className="card-hover p-8 text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ color: b.color, background: `color-mix(in srgb, ${b.color} 12%, transparent)` }}
              >
                <b.icon style={{ width: '1.6rem', height: '1.6rem' }} />
              </div>
              <h4 className="text-lg font-bold mb-2.5" style={s.textPrimary}>{b.title}</h4>
              <p className="text-sm leading-relaxed" style={s.textSecondary}>{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Tech Stack Strip ─────────────────── */
function TechStrip() {
  const stack = ['ESP32', 'IR Sensors', 'Supabase', 'React', 'Node.js', 'Tailwind CSS', 'Framer Motion'];
  return (
    <section className="py-12" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-primary)' }}>
      <div className="max-w-4xl mx-auto px-4 text-center">
        <p className="text-xs font-bold tracking-widest uppercase mb-5" style={s.textMuted}>Powered By</p>
        <div className="flex flex-wrap justify-center gap-2.5">
          {stack.map(t => (
            <span
              key={t}
              className="text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-colors duration-200"
              style={{
                color: 'var(--text-secondary)',
                borderColor: 'var(--border-primary)',
                background: 'var(--bg-elevated)',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA Banner ────────────────────────── */
function CTABanner() {
  return (
    <section className="py-28 relative overflow-hidden" style={s.bgSecondary}>
      {/* Radial glows */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, color-mix(in srgb, var(--accent) 8%, transparent), transparent)',
        }}
      />
      <motion.div {...fadeUp()} className="relative max-w-3xl mx-auto px-4 text-center">
        <p className="section-label justify-center mb-4">Ready to Board Smart?</p>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-5 leading-tight" style={s.textPrimary}>
          Your next journey starts with the right coach.
        </h2>
        <p className="text-base mb-10 max-w-lg mx-auto" style={s.textSecondary}>
          Find trains between stations, check live crowd density, and board with confidence — all for free.
        </p>
        <Link to="/search">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary text-base"
            style={{ padding: '0.9rem 2.5rem', borderRadius: 'var(--radius-xl)', fontSize: '1rem' }}
          >
            <Search style={{ width: '1.1rem', height: '1.1rem' }} />
            Search Trains Now
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
}

/* ─── Main Page ─────────────────────────── */
export default function HomePage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen">
      {/* ── Background ── */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="absolute inset-0" style={s.bg} />
        <div className="animated-grid absolute inset-0" />
        {/* Accent orbs */}
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full orb"
          style={{ background: 'var(--accent)', opacity: 0.06 }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full orb"
          style={{ background: 'var(--accent-light)', opacity: 0.05 }}
        />
      </div>

      {/* ── Hero Section ── */}
      <section className="relative min-h-[92vh] flex items-center pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left: Copy */}
            <div className="max-w-xl">
              {/* Tag */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 badge badge-indigo mb-7"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse inline-block" />
                Railway Crowd Intelligence · Live
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-black tracking-tighter leading-[1.08] mb-6"
                style={{ fontSize: 'clamp(2.6rem, 5vw, 3.8rem)', color: 'var(--text-primary)' }}
              >
                Find the Least<br />
                <span
                  className="animate-gradient-text"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-light), var(--accent), #a5b4fc)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Crowded Coach
                </span>
                <span style={{ color: 'var(--text-primary)' }}>.</span>
              </motion.h1>

              {/* Sub */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-lg leading-relaxed mb-10"
                style={s.textSecondary}
              >
                Real-time crowd density powered by IoT sensors. Know before you board — every coach, every train.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap items-center gap-3"
              >
                <Link to="/search">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-primary text-sm"
                    style={{ padding: '0.8rem 1.75rem', fontSize: '0.95rem' }}
                  >
                    <Search style={{ width: '1rem', height: '1rem' }} />
                    Search Trains
                  </motion.button>
                </Link>
                <a href="#how-it-works">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-secondary text-sm"
                    style={{ padding: '0.8rem 1.75rem', fontSize: '0.95rem' }}
                  >
                    How It Works
                    <ChevronRight style={{ width: '1rem', height: '1rem' }} />
                  </motion.button>
                </a>
              </motion.div>

              {/* Social proof strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-10 flex items-center gap-5 flex-wrap"
              >
                {[['54+', 'Trains tracked'], ['Live', 'Real-time data'], ['Free', 'Always']].map(([val, label]) => (
                  <div key={label} className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black" style={s.accent}>{val}</span>
                    <span className="text-xs" style={s.textMuted}>{label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Coach card */}
            <motion.div
              initial={{ opacity: 0, x: 32, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md mx-auto lg:ml-auto"
            >
              <HeroCoachCard />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Spacer divider */}
      <div className="section-divider" />

      {/* ── Sections ── */}
      <ProblemSection />
      <HowItWorks />
      <LiveDemoPreview />
      <WhySeatSeek />
      <TechStrip />
      <CTABanner />
    </div>
  );
}
