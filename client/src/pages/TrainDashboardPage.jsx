import { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Bell, Share2, RefreshCw, CheckCircle2,
  Users, MapPin, Navigation, Info, ChevronDown, ChevronUp, AlertCircle,
  Clock, TrendingUp, ShieldCheck, Zap, Calendar, BellRing,
  TrainFront
} from 'lucide-react';
import { getLiveStatus, getCoachDensity, getTrainRoute } from '../services/api';

// --- Helpers ---
const getDensityColor = (density) => {
  if (density === 'Low') return 'text-green-400';
  if (density === 'Medium') return 'text-yellow-400';
  if (density === 'High') return 'text-red-400';
  return 'text-gray-400';
};

const getDensityBg = (density) => {
  if (density === 'Low') return 'bg-green-500/20';
  if (density === 'Medium') return 'bg-yellow-500/20';
  if (density === 'High') return 'bg-red-500/20';
  return 'bg-gray-500/20';
};

const getDensityBorder = (density) => {
  if (density === 'Low') return 'border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]';
  if (density === 'Medium') return 'border-yellow-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]';
  if (density === 'High') return 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]';
  return 'border-white/20';
};

export default function TrainDashboardPage() {
  const { trainNo } = useParams();
  const navigate = useNavigate();
  const [liveData, setLiveData] = useState(null);
  const [densityData, setDensityData] = useState([]);
  const [routeData, setRouteData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('auto');

  const dateOptions = useMemo(() => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return {
      today: today.toISOString().split('T')[0].replace(/-/g, ''),
      yesterday: yesterday.toISOString().split('T')[0].replace(/-/g, '')
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dateParam = selectedDate === 'auto' ? '' : dateOptions[selectedDate];
        const [statusData, density, route] = await Promise.all([
          getLiveStatus(trainNo, dateParam),
          getCoachDensity(trainNo),
          getTrainRoute(trainNo)
        ]);
        
        const status = Array.isArray(statusData) ? statusData[0] : statusData;
        setLiveData(status || null);
        setDensityData(Array.isArray(density) ? density : []);
        setRouteData(Array.isArray(route) ? route : []);
        setError(null);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        setError("Unable to connect to train intelligence platform.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [trainNo, selectedDate, dateOptions]);

  if (loading && !liveData) return <LoadingSkeleton />;
  if (error && !liveData) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!liveData) return <ErrorState message="No intelligence data available." onRetry={() => window.location.reload()} />;

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white selection:bg-blue-500/30 font-sans pb-32">
      {/* Visual Header */}
      <header className="sticky top-0 z-50 bg-[#161b22]/95 backdrop-blur-md border-b border-white/5 shadow-2xl">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/search')} className="p-2 hover:bg-white/5 rounded-full transition-all">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none mb-1">
                {liveData.trainNumber} <span className="text-blue-500">{liveData.trainName}</span>
              </h1>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                {liveData.originCode} <ArrowLeft className="inline w-3 h-3 rotate-180 mx-1" /> {liveData.destinationCode}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative group">
               <button className="px-4 py-1.5 bg-blue-600 rounded-full text-xs font-black shadow-lg shadow-blue-600/20 hover:scale-105 transition-all flex items-center gap-2">
                 <Calendar className="w-3.5 h-3.5" />
                 {selectedDate === 'auto' ? 'Live' : selectedDate.toUpperCase()}
               </button>
               <div className="absolute top-full right-0 mt-2 w-32 bg-[#161b22] border border-white/10 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto overflow-hidden">
                  <button onClick={() => setSelectedDate('today')} className="w-full text-left px-4 py-2 text-[10px] font-black uppercase hover:bg-blue-600 transition-colors">Today</button>
                  <button onClick={() => setSelectedDate('yesterday')} className="w-full text-left px-4 py-2 text-[10px] font-black uppercase hover:bg-blue-600 transition-colors border-t border-white/5">Yesterday</button>
               </div>
            </div>

          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto pt-6 space-y-8">
        {/* Section 1: The High-Fidelity Train Animation */}
        <section className="px-4">
          <div className="bg-[#161b22] rounded-3xl p-8 border border-white/5 shadow-inner relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[100px]" />
             
             <div className="flex items-center justify-between mb-8">
                <div>
                   <h2 className="text-lg font-black flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-400" />
                      COACH OCCUPANCY
                   </h2>
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Real-time density analysis</p>
                </div>
                <div className="flex gap-4">
                   <LegendItem color="bg-green-500" label="Low" />
                   <LegendItem color="bg-yellow-500" label="Med" />
                   <LegendItem color="bg-red-500" label="High" />
                </div>
             </div>

             {/* Horizontal Scrollable Train */}
             <div className="relative overflow-x-auto no-scrollbar py-6">
                <div className="flex items-center gap-2 min-w-max px-4">
                   {/* Locomotive */}
                   <motion.div 
                     initial={{ x: -100, opacity: 0 }}
                     animate={{ x: 0, opacity: 1 }}
                     className="w-24 h-16 bg-gradient-to-r from-blue-700 to-blue-900 rounded-l-2xl rounded-r-lg flex items-center justify-center border-b-4 border-blue-950 relative shadow-2xl"
                   >
                      <div className="absolute top-2 right-2 w-4 h-4 bg-yellow-400/50 rounded-full blur-sm animate-pulse" />
                      <Zap className="w-8 h-8 text-blue-200" />
                      <div className="absolute -bottom-1 left-4 right-4 h-1 bg-black/40 rounded-full" />
                   </motion.div>

                   {/* Coaches */}
                   {densityData.map((coach, idx) => (
                     <motion.div
                       key={coach.coach}
                       initial={{ y: 20, opacity: 0 }}
                       animate={{ y: 0, opacity: 1 }}
                       transition={{ delay: idx * 0.05 }}
                       className={`relative w-20 h-16 rounded-lg border-2 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer hover:-translate-y-2 group ${getDensityBg(coach.density)} ${getDensityBorder(coach.density)}`}
                     >
                        <span className="text-lg font-black group-hover:scale-110 transition-transform">{coach.coach}</span>
                        <div className="w-8 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                           <div className={`h-full ${coach.density === 'Low' ? 'w-1/3 bg-green-400' : coach.density === 'Medium' ? 'w-2/3 bg-yellow-400' : 'w-full bg-red-400'}`} />
                        </div>
                        {/* Hover Tooltip */}
                        <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50">
                           <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap border shadow-2xl
                             ${coach.density === 'Low' ? 'bg-green-950 border-green-500/50 text-green-300' : coach.density === 'Medium' ? 'bg-yellow-950 border-yellow-500/50 text-yellow-300' : 'bg-red-950 border-red-500/50 text-red-300'}`}>
                             {coach.density} Crowd
                           </div>
                           <div className={`w-2 h-2 rotate-45 mx-auto -mt-1 border-r border-b
                             ${coach.density === 'Low' ? 'bg-green-950 border-green-500/50' : coach.density === 'Medium' ? 'bg-yellow-950 border-yellow-500/50' : 'bg-red-950 border-red-500/50'}`} />
                        </div>
                     </motion.div>
                   ))}
                </div>
             </div>
          </div>
        </section>

        {/* Section 2: Journey Timeline */}
        <section className="px-4 space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-lg font-black flex items-center gap-2">
                 <Navigation className="w-5 h-5 text-blue-400" />
                 LIVE JOURNEY
              </h2>
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${Number(liveData.delay) > 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                 {Number(liveData.delay) > 0 ? `${liveData.delay}M DELAY` : 'ON TIME'}
              </div>
           </div>

           <div className="bg-[#161b22] rounded-3xl border border-white/5 overflow-hidden">
              {/* Timeline Header */}
              <div className="grid grid-cols-3 px-6 py-4 border-b border-white/5 text-[8px] font-black text-gray-500 uppercase tracking-[0.2em]">
                 <span>Arrival</span>
                 <span className="text-center text-blue-500">Day 1 • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                 <span className="text-right">Departure</span>
              </div>

              <div className="relative p-4 md:p-8">
                 {/* Vertical Progress Rail */}
                 <div className="absolute left-1/2 top-4 md:top-8 bottom-4 md:bottom-8 w-[2px] bg-white/5 -translate-x-1/2 overflow-hidden">
                    {/* Energy Flow Animation */}
                    <motion.div 
                      animate={{ y: ["0%", "100%"] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="w-full h-24 bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-40"
                    />
                    {/* Active Path Glow */}
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 via-blue-500/10 to-transparent" />
                 </div>

                 <div className="space-y-12">
                    {(liveData.stations || routeData).map((station, i) => {
                       const isCurrent = liveData.currentStation?.includes(station.stationCode);
                       const isPast = !isCurrent && i < (liveData.stations || routeData).findIndex(s => liveData.currentStation?.includes(s.stationCode));

                       return (
                          <div key={i} className={`relative flex items-center justify-between group py-2 px-1 md:px-2 transition-all duration-500 ${isCurrent ? 'border-l-2 border-blue-500 pl-2 md:pl-3 bg-blue-500/[0.04]' : 'border-l-2 border-transparent'} ${isPast ? 'opacity-40' : ''}`}>
                             {/* Left: Arr Time */}
                             <div className="w-[42%] md:w-[40%] text-right pr-3 md:pr-8">
                                <div className={`text-xs md:text-sm font-bold transition-colors ${isCurrent ? 'text-blue-400' : 'text-gray-400'}`}>{station.arrivalTime || '--:--'}</div>
                                {Number(liveData.delay) > 0 && isPast && (
                                   <div className="text-[9px] font-bold text-red-500 italic mt-0.5">{addMinutes(station.arrivalTime, liveData.delay)}</div>
                                )}
                             </div>

                             {/* Middle: Active Train / Node */}
                             <div className="relative z-10 flex items-center justify-center w-6 md:w-8 h-6 md:h-8">
                                {isCurrent ? (
                                   <motion.div 
                                     animate={{ y: [-3, 3, -3] }}
                                     transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                     className="relative flex items-center justify-center"
                                   >
                                      {/* Pulse Effect */}
                                      <div className="absolute inset-0 w-8 md:w-10 h-8 md:h-10 bg-blue-500/20 rounded-full blur-md animate-pulse" />
                                      {/* Glowing Rail Path behind train */}
                                      <div className="absolute w-[2px] h-12 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                                      {/* Futuristic Train Icon */}
                                      <div className="relative z-20 p-1 md:p-1.5 bg-[#0a0c10] border border-blue-500/50 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                                         <TrainFront className="w-3 md:w-4 h-3 md:h-4 text-blue-400" />
                                      </div>
                                   </motion.div>
                                ) : (
                                   <div className={`w-2 md:w-2.5 h-2 md:h-2.5 rounded-full border-2 border-[#0a0c10] transition-all duration-500 ${isPast ? 'bg-blue-500/60' : 'bg-gray-800'}`} />
                                )}
                             </div>

                             {/* Right: Stn Info + Dep Time */}
                             <div className="w-[42%] md:w-[40%] pl-3 md:pl-8 flex flex-col md:flex-row items-start md:justify-between">
                                <div className={`transition-all duration-500 mb-0.5 md:mb-0 w-[60%] md:w-auto ${isCurrent ? 'md:scale-105 md:translate-x-1' : ''}`}>
                                   <h4 className={`text-[11px] md:text-sm font-black leading-tight tracking-tight transition-colors line-clamp-1 md:line-clamp-none ${isCurrent ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]' : 'text-white'}`} title={station.stationName}>
                                      {station.stationName}
                                   </h4>
                                   <div className="flex items-center gap-1.5 md:gap-2 mt-0.5 md:mt-1">
                                      <span className="text-[8px] md:text-[9px] text-gray-500 font-bold">{station.distance} KM</span>
                                      <span className={`px-1 md:px-1.5 py-0.5 rounded text-[7px] md:text-[8px] font-black border transition-colors ${isCurrent ? 'bg-blue-600/20 border-blue-500/30 text-blue-300' : 'bg-white/5 border-white/10 text-gray-400'}`}>PF {station.platform || '1'}</span>
                                   </div>
                                </div>
                                <div className="text-left md:text-right">
                                   <div className={`text-[11px] md:text-sm font-bold transition-colors ${isCurrent ? 'text-blue-400' : 'text-gray-400'}`}>{station.departureTime || '--:--'}</div>
                                   {Number(liveData.delay) > 0 && isPast && (
                                      <div className="text-[9px] font-bold text-red-500 italic mt-0.5">{addMinutes(station.departureTime, liveData.delay)}</div>
                                   )}
                                </div>
                             </div>
                          </div>
                       );
                    })}
                 </div>
              </div>
           </div>
        </section>
      </main>

      {/* Floating Bottom Tracker */}
      <footer className="fixed bottom-6 left-4 right-4 z-50">
         <div className="max-w-md mx-auto bg-[#161b22]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                  <TrainFront className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Next Arrival</p>
                  <p className="text-sm font-black text-white">{liveData.nextStation || 'Destination'}</p>
               </div>
            </div>
            <div className="text-right">
               <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Estimated</p>
               <p className="text-lg font-black text-blue-500">{liveData.eta || '--:--'}</p>
            </div>
         </div>
      </footer>
    </div>
  );
}

// --- Components ---

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-[9px] font-black text-gray-500 uppercase">{label}</span>
    </div>
  );
}

function HeaderTab({ icon: Icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all whitespace-nowrap text-xs font-bold ${active ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

function addMinutes(time, mins) {
  if (!time || !mins || isNaN(mins)) return time;
  const separator = time.includes(':') ? ':' : '.';
  const [h, m] = time.split(separator).map(Number);
  const date = new Date();
  date.setHours(h, m + Number(mins));
  return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }).replace(':', separator);
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0c10] p-6 space-y-8 animate-pulse">
      <div className="h-20 bg-white/5 rounded-3xl w-full" />
      <div className="h-64 bg-white/5 rounded-3xl w-full" />
      <div className="h-96 bg-white/5 rounded-3xl w-full" />
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="min-h-screen bg-[#0a0c10] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
         <AlertCircle className="w-10 h-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-black mb-2">Tracking Interrupted</h2>
      <p className="text-gray-400 mb-8 max-w-xs">{message}</p>
      <button onClick={onRetry} className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:scale-105 transition-all">Retry</button>
    </div>
  );
}
