import { motion } from 'framer-motion';
import { Activity, Server, Radio, Train as TrainIcon, Wifi } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <Activity className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">System Dashboard</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card p-6 border-l-4 border-l-green-500">
              <div className="flex items-center gap-3 text-green-400 mb-2">
                <Server className="w-5 h-5" />
                <h3 className="font-semibold">System Status</h3>
              </div>
              <p className="text-3xl font-bold text-white">Online</p>
              <p className="text-sm text-gray-400 mt-1">All services operational</p>
            </div>
            
            <div className="glass-card p-6 border-l-4 border-l-blue-500">
              <div className="flex items-center gap-3 text-blue-400 mb-2">
                <Radio className="w-5 h-5" />
                <h3 className="font-semibold">Active Sensors</h3>
              </div>
              <p className="text-3xl font-bold text-white">2,408</p>
              <p className="text-sm text-gray-400 mt-1">Across 200+ trains</p>
            </div>

            <div className="glass-card p-6 border-l-4 border-l-purple-500">
              <div className="flex items-center gap-3 text-purple-400 mb-2">
                <Wifi className="w-5 h-5" />
                <h3 className="font-semibold">Network Latency</h3>
              </div>
              <p className="text-3xl font-bold text-white">12ms</p>
              <p className="text-sm text-gray-400 mt-1">Average response time</p>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <TrainIcon className="w-5 h-5 text-gray-400" />
              Active Trains Monitored
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-sm">
                    <th className="pb-3 px-4 font-medium">Train No.</th>
                    <th className="pb-3 px-4 font-medium">Name</th>
                    <th className="pb-3 px-4 font-medium">Status</th>
                    <th className="pb-3 px-4 font-medium text-right">Sensors</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 text-white">17406</td>
                    <td className="py-4 px-4 text-gray-300">Krishna Express</td>
                    <td className="py-4 px-4"><span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium">Live</span></td>
                    <td className="py-4 px-4 text-right text-gray-400">100% Online</td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 text-white">17202</td>
                    <td className="py-4 px-4 text-gray-300">Golconda Express</td>
                    <td className="py-4 px-4"><span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium">Live</span></td>
                    <td className="py-4 px-4 text-right text-gray-400">98% Online</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 text-white">12704</td>
                    <td className="py-4 px-4 text-gray-300">Falaknuma Exp</td>
                    <td className="py-4 px-4"><span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs font-medium">Delayed</span></td>
                    <td className="py-4 px-4 text-right text-gray-400">100% Online</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
