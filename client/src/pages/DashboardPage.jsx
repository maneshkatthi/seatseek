import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Server, Radio, Train as TrainIcon, Wifi, TrendingUp, CheckCircle, AlertCircle, Clock } from 'lucide-react';

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
};

/* ── Stat Card ── */
function StatCard({ icon: Icon, label, value, sub, accentColor, delay = 0 }) {
  return (
    <motion.div
      {...fadeUp(delay)}
      className="card p-6 flex flex-col gap-4"
      style={{ borderLeft: `3px solid ${accentColor}` }}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `color-mix(in srgb, ${accentColor} 12%, transparent)`, color: accentColor }}
        >
          <Icon style={{ width: '1.1rem', height: '1.1rem' }} />
        </div>
        <div
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ background: accentColor }}
        />
      </div>
      <div>
        <p className="text-3xl font-black tracking-tight mb-0.5" style={s.textPrimary}>{value}</p>
        <p className="text-sm font-semibold mb-0.5" style={{ color: accentColor }}>{label}</p>
        <p className="text-xs" style={s.textMuted}>{sub}</p>
      </div>
    </motion.div>
  );
}

/* ── Status dot ── */
function StatusDot({ status }) {
  const map = {
    live:    { color: '#10b981', label: 'Live'    },
    delayed: { color: '#f59e0b', label: 'Delayed' },
    offline: { color: '#ef4444', label: 'Offline' },
  };
  const cfg = map[status] || map.live;
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
      style={{ color: cfg.color, background: `color-mix(in srgb, ${cfg.color} 12%, transparent)` }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full inline-block"
        style={{ background: cfg.color, animation: status === 'live' ? 'pulse 2s infinite' : 'none' }}
      />
      {cfg.label}
    </span>
  );
}

/* ── Uptime bar ── */
function UptimeBar({ pct }) {
  const color = pct >= 98 ? '#10b981' : pct >= 90 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center gap-2 justify-end">
      <div
        className="h-1.5 w-16 rounded-full overflow-hidden"
        style={{ background: 'var(--border-primary)' }}
      >
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-xs font-semibold w-16 text-right" style={{ color }}>
        {pct}% Online
      </span>
    </div>
  );
}

const trains = [
  { no: '17406', name: 'Krishna Express',    route: 'GLA → KMT', status: 'live',    uptime: 100, coaches: 8  },
  { no: '17202', name: 'Golconda Express',   route: 'GLA → KMT', status: 'live',    uptime: 98,  coaches: 7  },
  { no: '12704', name: 'Falaknuma Express',  route: 'HYB → MAS', status: 'delayed', uptime: 100, coaches: 12 },
  { no: '17033', name: 'Singareni Passenger',route: 'GLA → OEA', status: 'live',    uptime: 95,  coaches: 6  },
];

export default function DashboardPage() {
  const [uptime, setUptime] = useState('99.8%');
  const [lastSync, setLastSync] = useState('');

  useEffect(() => {
    const now = new Date();
    setLastSync(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
  }, []);

  return (
    <div
      className="min-h-screen pt-16"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      {/* Background */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="dot-grid absolute inset-0 opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── Header ── */}
        <motion.div {...fadeUp(0)} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'color-mix(in srgb, var(--accent) 15%, transparent)', color: 'var(--accent-light)' }}
            >
              <Activity style={{ width: '1.3rem', height: '1.3rem' }} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight" style={s.textPrimary}>System Dashboard</h1>
              <p className="text-xs" style={s.textMuted}>Real-time network & sensor overview</p>
            </div>
          </div>

          {/* Last sync badge */}
          <div
            className="inline-flex items-center gap-2 text-xs font-medium px-3.5 py-2 rounded-xl border self-start sm:self-auto"
            style={{ background: 'var(--card-bg)', borderColor: 'var(--border-primary)', color: 'var(--text-muted)' }}
          >
            <Clock style={{ width: '0.9rem', height: '0.9rem' }} />
            Last synced {lastSync || '—'}
          </div>
        </motion.div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard
            icon={Server}
            label="System Status"
            value="Online"
            sub="All services operational"
            accentColor="#10b981"
            delay={0.05}
          />
          <StatCard
            icon={Radio}
            label="Active Sensors"
            value="2,408"
            sub="Across 200+ trains"
            accentColor="var(--accent-light)"
            delay={0.1}
          />
          <StatCard
            icon={Wifi}
            label="Avg Latency"
            value="12ms"
            sub="P99 response time"
            accentColor="#a78bfa"
            delay={0.15}
          />
          <StatCard
            icon={TrendingUp}
            label="Uptime"
            value={uptime}
            sub="Last 30 days"
            accentColor="#f59e0b"
            delay={0.2}
          />
        </div>

        {/* ── Active Trains Table ── */}
        <motion.div {...fadeUp(0.25)} className="card overflow-hidden">
          {/* Table header bar */}
          <div
            className="px-6 py-5 flex items-center justify-between"
            style={{ borderBottom: '1px solid var(--border-primary)' }}
          >
            <div className="flex items-center gap-2.5">
              <TrainIcon style={{ width: '1.1rem', height: '1.1rem', color: 'var(--accent-light)' }} />
              <h2 className="text-base font-bold" style={s.textPrimary}>Active Trains Monitored</h2>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'color-mix(in srgb, var(--accent) 12%, transparent)', color: 'var(--accent-light)' }}
              >
                {trains.length}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full inline-block animate-pulse"
                style={{ background: '#10b981' }}
              />
              <span className="text-xs font-semibold" style={{ color: '#10b981' }}>Live Feed</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: '560px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                  {['Train No.', 'Name & Route', 'Coaches', 'Status', 'Sensor Health'].map(h => (
                    <th
                      key={h}
                      className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider"
                      style={{ color: 'var(--text-muted)', ...(h === 'Sensor Health' ? { textAlign: 'right' } : {}) }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trains.map((t, i) => (
                  <motion.tr
                    key={t.no}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                    className="group transition-colors duration-150"
                    style={{ borderBottom: '1px solid var(--border-primary)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-bold" style={s.accent}>{t.no}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold" style={s.textPrimary}>{t.name}</p>
                      <p className="text-xs mt-0.5" style={s.textMuted}>{t.route}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium" style={s.textSecondary}>{t.coaches} coaches</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusDot status={t.status} />
                    </td>
                    <td className="px-6 py-4">
                      <UptimeBar pct={t.uptime} />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ borderTop: '1px solid var(--border-primary)', background: 'var(--bg-elevated)' }}
          >
            <p className="text-xs" style={s.textMuted}>
              Showing {trains.length} of {trains.length} monitored trains
            </p>
            <div className="flex items-center gap-4 text-xs" style={s.textMuted}>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: '#10b981' }} />
                Live
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: '#f59e0b' }} />
                Delayed
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: '#ef4444' }} />
                Offline
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── System Health ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
          {[
            { label: 'API Gateway',      status: 'Operational', color: '#10b981', detail: '99.9% uptime',    icon: CheckCircle },
            { label: 'Sensor Network',   status: 'Degraded',    color: '#f59e0b', detail: '3 sensors offline', icon: AlertCircle },
            { label: 'Database (Supabase)', status: 'Operational', color: '#10b981', detail: '< 8ms latency', icon: CheckCircle },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              {...fadeUp(0.35 + i * 0.07)}
              className="card p-5 flex items-center gap-4"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `color-mix(in srgb, ${item.color} 12%, transparent)`, color: item.color }}
              >
                <item.icon style={{ width: '1.1rem', height: '1.1rem' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={s.textPrimary}>{item.label}</p>
                <p className="text-xs" style={s.textMuted}>{item.detail}</p>
              </div>
              <span
                className="text-xs font-bold shrink-0"
                style={{ color: item.color }}
              >
                {item.status}
              </span>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
