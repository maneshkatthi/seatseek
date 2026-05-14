import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, ArrowRight, Frown, Clock, HelpCircle, 
  Radio, Cpu, Cloud, Smartphone, Smile, Zap, Shield
} from 'lucide-react';
import { getBarColor, getCoachGlowClass } from '../data/mockData';

// --- Hero Train Visualization Component ---
function HeroTrainViz() {
  const coaches = [
    { id: 'C1', density: 28, type: '1A' },
    { id: 'C2', density: 45, type: '2A' },
    { id: 'C3', density: 85, type: '3A' },
    { id: 'C4', density: 62, type: 'SL' },
    { id: 'C5', density: 112, type: 'UR' },
  ];

  return (
    <div className="glass-card p-6 relative overflow-hidden group border border-white/10 shadow-2xl">
      <div className="absolute top-0 right-0 p-4">
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold animate-pulse">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          Live
        </div>
      </div>
      
      <p className="text-xs text-gray-500 font-semibold tracking-wider uppercase mb-1">Live Demo</p>
      <h3 className="text-lg font-bold text-white mb-6">17406 Krishna Express</h3>

      <div className="space-y-4">
        {coaches.map((coach, idx) => (
          <motion.div
            key={coach.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + (idx * 0.1) }}
            className="flex items-center gap-4"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${getCoachGlowClass(coach.density)}`}>
              {coach.id}
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-400">{coach.type}</span>
                <span className="text-white font-medium">{coach.density}% Full</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(coach.density, 100)}%` }}
                  transition={{ duration: 1, delay: 0.8 + (idx * 0.1), ease: "easeOut" }}
                  className={`h-full rounded-full ${getBarColor(coach.density)} relative`}
                >
                  <div className="absolute inset-0 bg-white/20 w-full h-full shimmer"></div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// --- Section 2: The Problem ---
function TheProblem() {
  const problems = [
    { icon: Frown, title: 'No visibility', desc: 'You board without knowing which coach is packed' },
    { icon: Clock, title: 'Wasted time', desc: 'You walk coach to coach searching for space' },
    { icon: HelpCircle, title: 'Stressful boarding', desc: 'Peak hours feel chaotic with no guidance' },
  ];

  return (
    <section className="py-20 bg-white/[0.02] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((prob, i) => (
            <motion.div
              key={prob.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex items-start gap-4 p-6 glass-card border border-white/5 transition-transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center shrink-0 border border-white/10 text-gray-400">
                <prob.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">{prob.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{prob.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Section 3: How It Works ---
function HowItWorks() {
  const steps = [
    { icon: Radio, title: 'Sensor Detects', desc: 'IR sensors at coach doors count passengers entering and exiting' },
    { icon: Cpu, title: 'ESP32 Processes', desc: 'Microcontroller calculates live occupancy per coach' },
    { icon: Cloud, title: 'Cloud Updates', desc: 'Data sent to Supabase in real time' },
    { icon: Smartphone, title: 'You See It Live', desc: 'Open SeatSeek, search your train, board smart' },
  ];

  return (
    <section id="how-it-works" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-gray-400">IoT hardware meets intelligent software.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-white/10 z-0"></div>
          
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 bg-[#0a0e1a] border border-white/10 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:border-blue-500/40 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all">
                <step.icon className="w-8 h-8" />
              </div>
              <h3 className="text-white font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Section 4: Live Demo Preview ---
function LiveDemoPreview() {
  return (
    <section className="py-24 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent border-y border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Live Demo Preview</h2>
          <p className="text-gray-400">See exactly what you get when you search.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-6 md:p-8 max-w-2xl mx-auto"
        >
          {/* Fake Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white flex flex-col opacity-80">
              <span className="text-xs text-gray-500 uppercase tracking-wide mb-1">From</span>
              <span className="text-gray-200">Garla</span>
            </div>
            <div className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white flex flex-col opacity-80">
              <span className="text-xs text-gray-500 uppercase tracking-wide mb-1">To</span>
              <span className="text-gray-200">Khammam</span>
            </div>
          </div>

          {/* Fake Density Cards */}
          <div className="space-y-3 mb-8">
            <div className="bg-white/5 border border-green-500/30 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 flex items-center justify-center font-bold">1A</div>
                <span className="text-gray-300 font-medium">First AC</span>
              </div>
              <div className="text-right">
                <p className="text-green-400 font-bold text-lg">28% Full</p>
                <p className="text-xs text-gray-500">Low Crowd</p>
              </div>
            </div>
            
            <div className="bg-white/5 border border-orange-500/30 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center font-bold">B2</div>
                <span className="text-gray-300 font-medium">Third AC</span>
              </div>
              <div className="text-right">
                <p className="text-orange-400 font-bold text-lg">88% Full</p>
                <p className="text-xs text-gray-500">High Crowd</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link to="/search">
              <button className="inline-flex items-center gap-2 text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                Try with your train <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// --- Section 5: Why SeatSeek ---
function WhySeatSeek() {
  const benefits = [
    { icon: Smile, title: 'Less Stress', desc: 'Know before you go. Pick your coach from your phone.', color: 'text-green-400', bg: 'bg-green-500/10' },
    { icon: Zap, title: 'Faster Boarding', desc: 'No more walking the platform searching for space.', color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { icon: Shield, title: 'Safer Travel', desc: 'Avoid dangerously overcrowded coaches automatically.', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card p-8 text-center hover:-translate-y-1 transition-transform border border-white/5"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${benefit.bg} ${benefit.color}`}>
                <benefit.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Section 6: Tech Stack ---
function TechStack() {
  const stack = ['ESP32', 'IR Sensors', 'Supabase', 'React', 'Node.js', 'Tailwind CSS'];
  
  return (
    <section className="py-16 border-t border-white/5 bg-[#0a0e1a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {stack.map((tech) => (
            <div key={tech} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-gray-300 text-sm font-medium hover:border-blue-500/40 hover:text-blue-400 transition-colors cursor-default">
              {tech}
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-sm tracking-wide font-medium">
          Built on real IoT hardware, not simulation.
        </p>
      </div>
    </section>
  );
}

// --- Main Page Component ---
export default function HomePage() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-20">
      {/* Background Grid */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[#0a0e1a]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30 animate-grid-move" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen opacity-50" />
      </div>

      <div className="space-y-0">
        {/* Section 1: Hero */}
        <section className="relative pt-16 pb-20 md:pt-32 md:pb-28 overflow-hidden min-h-[85vh] flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              
              {/* Left: Content */}
              <div className="max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="text-5xl md:text-[3.5rem] font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
                    Find the Least <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Crowded Coach.</span><br />
                    Before You Board.
                  </h1>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed font-light"
                >
                  Real-time crowd density powered by IoT sensors and live analytics.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex flex-wrap items-center gap-4"
                >
                  <Link to="/search">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2.5 bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-400 transition-all shadow-lg shadow-blue-500/25"
                    >
                      <Search className="w-5 h-5" />
                      Search Trains
                    </motion.button>
                  </Link>
                  <a href="#how-it-works">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2.5 border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/5 hover:border-white/40 transition-all"
                    >
                      See How It Works
                    </motion.button>
                  </a>
                </motion.div>
              </div>

              {/* Right: Live Viz */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="lg:ml-auto w-full max-w-md"
              >
                <HeroTrainViz />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section 2: The Problem */}
        <TheProblem />

        {/* Section 3: How It Works */}
        <HowItWorks />

        {/* Section 4: Live Demo Preview */}
        <LiveDemoPreview />

        {/* Section 5: Why SeatSeek */}
        <WhySeatSeek />

        {/* Section 6: Tech Stack */}
        <TechStack />

        {/* Section 7: Final CTA Banner */}
        <section className="py-24 bg-[#0d1117] border-t border-white/10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/5 mix-blend-screen" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-10 leading-tight">
              Your next train is less crowded than you think. Find out now.
            </h2>
            <Link to="/search">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 bg-blue-500 text-white font-bold text-lg px-12 py-5 rounded-xl hover:bg-blue-400 transition-all shadow-xl shadow-blue-500/25"
              >
                <Search className="w-5 h-5" />
                Search Trains
              </motion.button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
