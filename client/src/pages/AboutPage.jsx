import { motion } from 'framer-motion';
import { Info, Cpu, Code2, Rocket, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen flex flex-col items-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-blue-500/20 border border-blue-500/40 rounded-2xl flex items-center justify-center mx-auto mb-6 neon-glow">
            <Info className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
            About SeatSeek
          </h1>
          <div className="flex items-center justify-center gap-2 text-lg text-gray-400">
            Powered By 
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg shadow-lg">
              <img src="/review-logo.png" alt="ReView AI Logo" className="w-6 h-6 object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] rounded-full" />
              <span className="text-blue-400 font-semibold">ReView AI Tech and Solutions</span>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Cpu className="w-32 h-32 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3 relative z-10">
              <Rocket className="w-6 h-6 text-blue-400" />
              Our Mission
            </h2>
            <p className="text-gray-300 leading-relaxed relative z-10">
              SeatSeek is a futuristic crowd-intelligence platform designed to make train travel across Indian Railways smarter and more predictable. 
              By utilizing advanced ESP32 IoT sensors and real-time cloud analytics, we provide passengers with live insights into coach occupancy before they even board.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Users className="w-6 h-6 text-purple-400" />
              Team Orbit
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              Built by passionate developers, engineers, and problem-solvers. We combine hardware innovation with cutting-edge software design to solve real-world problems.
            </p>
            
            {/* Adding visual placeholder for the team */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center text-center">
                <Code2 className="w-10 h-10 text-purple-400 mb-3" />
                <h3 className="text-white font-semibold mb-1">Engineering Excellence</h3>
                <p className="text-gray-400 text-sm">Building the future of smart transit</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
