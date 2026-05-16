import { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Bell, Share2, RefreshCw, CheckCircle2,
  Users, MapPin, Navigation, Info, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';
import { COACH_DATA, TRACK_DATA, TRAINS, getLabel, getLabelBg, getLabelColor, getBarColor, getCoachGlowClass } from '../data/mockData';
import { getLiveStatus } from '../services/api';

// --- Legend ---
const legendItems = [
  { label: 'Low', range: '0 to 40%', color: '#22c55e', bg: 'bg-green-500/15', border: 'border-green-500/30' },
  { label: 'Moderate', range: '41 to 70%', color: '#f59e0b', bg: 'bg-amber-500/15', border: 'border-amber-500/30' },
  { label: 'High', range: '71 to 100%', color: '#f97316', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
  { label: 'Very High', range: 'above 100%', color: '#ef4444', bg: 'bg-red-500/15', border: 'border-red-500/30' },
];

export default function TrainDashboardPage() {
  const { trainNo } = useParams();
  const navigate = useNavigate();
  const [expandedCoach, setExpandedCoach] = useState(null);

  const train = TRAINS.find(t => t.trainNo === trainNo) || { trainNo: trainNo, name: 'Live Train Data', from: 'Origin', to: 'Destination', delay: 0 };
  const coaches = COACH_DATA[trainNo] || COACH_DATA['17406'];
  const fallbackTrackInfo = TRACK_DATA[trainNo] || { stops: [] };

  const [liveTrackInfo, setLiveTrackInfo] = useState(null);
  const [loadingTrack, setLoadingTrack] = useState(true);
  const [dateOffset, setDateOffset] = useState(0);
  const isAutoFetching = useRef(true);

  // Reset auto-fetching when train changes
  useEffect(() => {
    isAutoFetching.current = true;
    setDateOffset(0);
  }, [trainNo]);

  useEffect(() => {
    let isMounted = true;

    const fetchLiveStatus = async (offsetToTry) => {
      try {
        setLoadingTrack(true);
        setLiveTrackInfo(null); // Clear previous errors
        
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + offsetToTry);
        const yyyy = targetDate.getFullYear();
        const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
        const dd = String(targetDate.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}${mm}${dd}`;

        const data = await getLiveStatus(trainNo, dateStr);
        if (!isMounted) return;

        const hasError = data.error || data.status?.result === 'failure' || data.message;

        // Auto-discovery logic: If error on today, try yesterday, then day before.
        if (hasError && isAutoFetching.current && offsetToTry > -2) {
          setDateOffset(offsetToTry - 1);
          return; // The useEffect will re-run with the new dateOffset
        }
        
        if (data.body && data.body.stations) {
          let pastCurrent = false;
          const formattedStops = data.body.stations.map(stn => {
            let status = 'upcoming';
            if (stn.stationCode === data.body.current_station) {
              status = 'current';
              pastCurrent = true;
            } else if (!pastCurrent) {
              status = 'departed';
            }
            
            return {
              station: stn.stationName,
              code: stn.stationCode,
              scheduledArr: stn.arrivalTime !== '00:00' ? stn.arrivalTime : null,
              actualArr: stn.actual_arrival_time,
              scheduledDep: stn.departureTime !== '00:00' ? stn.departureTime : null,
              actualDep: stn.actual_departure_time,
              platform: stn.expected_platform || '-',
              status: status
            };
          });

          setLiveTrackInfo({
            currentStation: data.body.current_station,
            trainMsg: data.body.train_status_message,
            stops: formattedStops
          });
        } else if (hasError) {
          setLiveTrackInfo({
            error: data.message || data.error || data.status?.message?.message || "Train not running today.",
            stops: []
          });
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Failed to fetch live train data", error);
        setLiveTrackInfo({ error: "Failed to connect to API", stops: [] });
      } finally {
        if (isMounted && (!isAutoFetching.current || offsetToTry === -2 || liveTrackInfo !== null)) {
          setLoadingTrack(false);
        }
      }
    };

    fetchLiveStatus(dateOffset);

    return () => {
      isMounted = false;
    };
  }, [trainNo, dateOffset]);

  const handleDateChange = (offset) => {
    isAutoFetching.current = false;
    setDateOffset(offset);
  };

  const displayTrackInfo = liveTrackInfo || fallbackTrackInfo;

  // Quick Stats
  const leastCrowded = useMemo(() => coaches.reduce((min, c) => c.percentage < min.percentage ? c : min, coaches[0]), [coaches]);
  const mostCrowded = useMemo(() => coaches.reduce((max, c) => c.percentage > max.percentage ? c : max, coaches[0]), [coaches]);
  const recommendedCoaches = useMemo(() => coaches.filter(c => c.percentage <= 40).map(c => c.name), [coaches]);

  return (
    <div className="min-h-screen bg-[#0a0e1a] pb-24">
      {/* Top Bar (Sticky) */}
      <div className="sticky top-0 z-50 bg-[#0a0e1a]/95 backdrop-blur-xl border-b border-white/10 pt-16 pb-4">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <button 
                onClick={() => navigate('/search')}
                className="p-2 mt-1 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-white leading-none">
                    {train.trainNo} · {train.name}
                  </h1>
                  {train.delay > 0 ? (
                    <span className="px-2.5 py-0.5 bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-semibold rounded-full whitespace-nowrap">
                      Delayed {train.delay}m
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-semibold rounded-full whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Live
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-400 flex items-center gap-2">
                  <span className="font-medium text-gray-300">{train.from}</span>
                  <ArrowLeft className="w-3 h-3 rotate-180 opacity-50" />
                  <span className="font-medium text-gray-300">{train.to}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-blue-400 transition-colors">
                <Bell className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-blue-400 transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-blue-400 transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
        
        {/* Section 1: Quick Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-center">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Least Crowded</span>
            <div className="flex items-baseline gap-2">
              <span className="text-green-400 font-bold text-lg">{leastCrowded.name}</span>
              <span className="text-white text-sm">· {leastCrowded.percentage}%</span>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-center">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Most Crowded</span>
            <div className="flex items-baseline gap-2">
              <span className="text-red-400 font-bold text-lg">{mostCrowded.name}</span>
              <span className="text-white text-sm">· {mostCrowded.percentage}%</span>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-center">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Total Coaches</span>
            <div className="flex items-baseline gap-2">
              <span className="text-white font-bold text-lg">{coaches.length}</span>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-center">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Last Updated</span>
            <div className="flex items-baseline gap-2">
              <span className="text-white font-medium text-sm">Just now</span>
            </div>
          </div>
        </div>

        {/* Section 2: Interactive Train Visualization */}
        <div className="glass-card p-6 overflow-hidden">
          <h3 className="text-sm font-semibold text-white mb-6 uppercase tracking-widest text-center opacity-80">Live Train Visualization</h3>
          
          <div className="overflow-x-auto pb-4 custom-scrollbar">
            <div className="flex items-center gap-2 min-w-max px-2">
              {/* Engine */}
              <div className="flex items-center">
                <div className="w-16 h-12 bg-blue-600 rounded-l-lg rounded-r-sm flex items-center justify-center border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)] relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-4 bg-gray-900 rounded-l-full"></div>
                  <span className="text-white font-bold text-xs uppercase tracking-widest">ENG</span>
                </div>
                <div className="w-2 h-2 bg-gray-600 mx-0.5"></div>
              </div>

              {/* Coaches */}
              {coaches.map((coach, i) => (
                <div key={coach.id} className="flex items-center group relative">
                  <div className={`w-14 h-12 rounded-sm border-2 flex items-center justify-center font-bold text-sm cursor-pointer transition-all ${getCoachGlowClass(getLabel(coach.percentage))}`}>
                    {coach.name}
                  </div>
                  {i < coaches.length - 1 && <div className="w-2 h-2 bg-gray-600 mx-0.5"></div>}
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-[#1a2235] border border-white/10 rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white font-bold">{coach.name}</span>
                      <span className={`text-xs font-semibold ${getLabelColor(getLabel(coach.percentage))}`}>{coach.percentage}%</span>
                    </div>
                    <div className="text-xs text-gray-400">{getLabel(coach.percentage)} Crowd</div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a2235]"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Smart Recommendation Banner */}
        {recommendedCoaches.length > 0 && (
          <div className="bg-green-600 text-white rounded-xl p-5 shadow-[0_0_30px_rgba(22,163,74,0.3)] relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-6 h-6 text-white" />
                <h3 className="text-xl font-bold">Recommended Coaches: {recommendedCoaches.join(', ')}</h3>
              </div>
              <p className="text-green-100">
                These coaches are under 40% capacity. Board here for a comfortable journey.
              </p>
            </div>
          </div>
        )}

        {/* Section 4: Coach-by-Coach Density List */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Coach Details</h2>
          <div className="space-y-3">
            {coaches.map((coach, i) => {
              const label = getLabel(coach.percentage);
              const labelColor = getLabelColor(label);
              const barColor = getBarColor(label);
              const isExpanded = expandedCoach === coach.id;

              // Subtle tint based on status
              const tintClass = 
                label === 'Low' ? 'hover:bg-green-500/5' :
                label === 'Very High' ? 'hover:bg-red-500/5' : 'hover:bg-white/5';

              return (
                <motion.div
                  key={coach.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`bg-[#121826] border border-white/5 rounded-xl overflow-hidden transition-all ${tintClass}`}
                >
                  <div 
                    className="p-4 cursor-pointer flex items-center gap-4"
                    onClick={() => setExpandedCoach(isExpanded ? null : coach.id)}
                  >
                    <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {coach.name}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-end mb-2">
                        <span className={`text-sm font-semibold ${labelColor}`}>{label}</span>
                        <span className="text-white font-bold">{coach.percentage}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(coach.percentage, 100)}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className={`h-full rounded-full ${barColor}`}
                        />
                      </div>
                    </div>
                    
                    <button className="p-1 text-gray-500">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-black/20"
                      >
                        <div className="p-4 border-t border-white/5 flex flex-wrap gap-6 text-sm">
                          <div>
                            <span className="block text-gray-500 mb-1">Est. Passengers</span>
                            <span className="text-white font-semibold">{Math.floor(coach.percentage * 0.8)} people</span>
                          </div>
                          <div>
                            <span className="block text-gray-500 mb-1">Coach Type</span>
                            <span className="text-white font-semibold">
                              {coach.name.includes('A') ? 'AC Class' : coach.name.includes('B') ? '3 Tier AC' : 'Sleeper'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-[150px]">
                            <span className="block text-gray-500 mb-1">Boarding Suggestion</span>
                            <span className={`font-semibold ${label === 'Low' || label === 'Moderate' ? 'text-green-400' : 'text-red-400'}`}>
                              {label === 'Low' || label === 'Moderate' ? 'Good choice — space available' : 'Avoid — very crowded'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Section 5: Live Train Location */}
        <div className="glass-card p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white mb-2">Live Status Timeline</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 uppercase font-semibold mr-1">Origin Date:</span>
                <button onClick={() => handleDateChange(-2)} className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${dateOffset === -2 ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>Day -2</button>
                <button onClick={() => handleDateChange(-1)} className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${dateOffset === -1 ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>Yesterday</button>
                <button onClick={() => handleDateChange(0)} className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${dateOffset === 0 ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>Today</button>
              </div>
            </div>
            <div className="flex-shrink-0">
              {loadingTrack ? (
                <span className="text-xs text-blue-400 flex items-center gap-1.5 font-medium"><RefreshCw className="w-3.5 h-3.5 animate-spin"/> Fetching IRCTC API...</span>
              ) : liveTrackInfo && !liveTrackInfo.error ? (
                <span className="text-xs text-green-400 flex items-center gap-1.5 font-medium"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"/> Live IRCTC Data</span>
              ) : liveTrackInfo?.error ? (
                <span className="text-xs text-red-400 flex items-center gap-1.5 font-medium"><AlertCircle className="w-3.5 h-3.5"/> API Error</span>
              ) : (
                <span className="text-xs text-amber-400 flex items-center gap-1.5 font-medium"><AlertCircle className="w-3.5 h-3.5"/> Offline Prediction Mode</span>
              )}
            </div>
          </div>
          
          {displayTrackInfo.trainMsg && !displayTrackInfo.error && (
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl shadow-inner">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-200 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: displayTrackInfo.trainMsg }}></p>
              </div>
            </div>
          )}

          {displayTrackInfo.error && (
             <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl shadow-inner">
               <div className="flex items-start gap-3">
                 <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                 <div>
                   <p className="text-sm text-red-200 font-bold mb-1">Live Tracking Unavailable</p>
                   <p className="text-xs text-red-300 leading-relaxed font-medium">{displayTrackInfo.error}</p>
                 </div>
               </div>
             </div>
          )}

          <div className="relative pl-6 space-y-8">
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-white/10" />
            
            {displayTrackInfo.stops && displayTrackInfo.stops.length === 0 && !loadingTrack && (
              <div className="py-8 text-center text-gray-500 text-sm">
                No timeline data available.
              </div>
            )}

            {displayTrackInfo.stops && displayTrackInfo.stops.map((stop, i) => {
              const isPast = stop.status === 'departed';
              const isCurrent = stop.status === 'current';
              const isUpcoming = stop.status === 'upcoming';
              
              let nodeColor = 'bg-gray-600';
              if (isPast) nodeColor = 'bg-green-500';
              if (isCurrent) nodeColor = 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]';

              return (
                <div key={stop.code} className={`relative ${isUpcoming ? 'opacity-50' : 'opacity-100'}`}>
                  {/* Timeline Node */}
                  <div className={`absolute -left-[30px] top-1 w-4 h-4 rounded-full border-2 border-[#0a0e1a] ${nodeColor} z-10 flex items-center justify-center`}>
                    {isCurrent && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-white font-bold">{stop.station}</h4>
                        {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
                      </div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">{stop.code}</p>
                    </div>
                    
                    <div className="text-left sm:text-right text-sm">
                      <div className="text-gray-300">
                        {stop.scheduledArr || stop.scheduledDep} 
                        {isPast && stop.actualDep && ` → ${stop.actualDep}`}
                      </div>
                      {isCurrent && train.delay > 0 && (
                        <div className="text-red-400 font-medium text-xs mt-0.5">
                          Delayed by {train.delay} min
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 6: Density Legend + Footnote */}
        <div className="pt-4 pb-8 border-t border-white/10">
          <div className="flex flex-wrap gap-3 mb-6">
            {legendItems.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-medium ${item.bg} ${item.border}`}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span style={{ color: item.color }}>{item.label}</span>
                <span className="text-gray-500">— {item.range}</span>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-2 text-xs text-gray-600">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>Crowd density estimated using real-time IoT sensor data from onboard ESP32 units.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
