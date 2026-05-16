import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, ArrowLeftRight, Search, Train as TrainIcon,
  Clock, AlertCircle, Navigation, ChevronRight, Zap,
  BarChart2, RadioTower
} from 'lucide-react';
import { STATIONS, TRAINS } from '../data/mockData';
import { searchTrain, getTrainsBetween } from '../services/api';

const resolveStationCode = (input) => {
  if (!input?.trim()) return '';
  const trimmed = input.trim();

  const parenCode = trimmed.match(/\(([A-Za-z0-9]{2,5})\)\s*$/);
  if (parenCode) return parenCode[1].toUpperCase();

  const q = trimmed.toLowerCase();
  const exactCode = STATIONS.find((s) => s.code.toLowerCase() === q);
  if (exactCode) return exactCode.code;

  const exactName = STATIONS.find((s) => s.name.toLowerCase() === q);
  if (exactName) return exactName.code;

  const partial = STATIONS.find(
    (s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase() === q
  );
  if (partial) return partial.code;

  const asCode = trimmed.toUpperCase();
  if (/^[A-Z0-9]{2,5}$/.test(asCode)) return asCode;

  return '';
};

// --- Station Autocomplete Input ---
function StationInput({ label, value, onChange, onSelectStation, placeholder, icon: Icon }) {
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (value.length >= 1) {
      const filtered = STATIONS.filter(
        (s) =>
          s.name.toLowerCase().includes(value.toLowerCase()) ||
          s.code.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 6);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [value]);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setFocused(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={wrapRef} className="relative flex-1">
      <label className="block text-xs text-gray-500 font-medium mb-1.5 uppercase tracking-wide">{label}</label>
      <div className={`flex items-center gap-3 glass-card px-4 py-4 transition-all duration-300 ${focused ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-xl' : ''}`}>
        <Icon className={`w-5 h-5 transition-colors duration-300 ${focused ? 'text-blue-500' : 'text-[var(--text-muted)]'}`} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm font-medium focus:outline-none"
        />
      </div>
      <AnimatePresence>
        {focused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 glass-card overflow-hidden shadow-xl shadow-black/40"
          >
            {suggestions.map((s) => (
              <button
                key={`${s.code}-${s.name}`}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/8 transition-all text-left border-b border-white/5 last:border-0"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(s.name);
                  onSelectStation?.(s);
                  setFocused(false);
                  setSuggestions([]);
                }}
              >
                <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span className="text-sm text-white">{s.name}</span>
                <span className="ml-auto text-xs text-gray-600 font-mono">{s.code}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Train Result Card ---
function TrainCard({ train, index, compact = false }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="glass-card-hover p-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Train number badge */}
        <div className="flex-shrink-0">
          <div className="w-14 h-14 bg-blue-500/15 border border-blue-500/30 rounded-xl flex items-center justify-center">
            <TrainIcon className="w-6 h-6 text-blue-400" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[var(--text-primary)] font-bold text-lg">{train.name}</span>
            <span className="text-[var(--text-muted)] text-xs font-mono bg-[var(--bg-secondary)] px-2 py-1 rounded-lg border border-[var(--border-primary)]">#{train.trainNo}</span>
            <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">{train.type}</span>
          </div>

          {/* Timing row */}
          <div className="flex items-center gap-4 mt-4 flex-wrap">
            <div className="text-left">
              <p className="text-[var(--text-primary)] font-black text-2xl">{train.departure}</p>
              <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-tight">{train.fromName}</p>
            </div>
            <div className="flex-1 flex items-center gap-2 min-w-[100px]">
              <div className="h-px flex-1 bg-[var(--border-primary)]" />
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase mb-1">Travel Time</span>
                <span className="text-xs text-blue-400 font-bold px-2 py-1 bg-blue-500/5 rounded-md whitespace-nowrap border border-blue-500/10">{train.duration}</span>
              </div>
              <div className="h-px flex-1 bg-[var(--border-primary)]" />
            </div>
            <div className="text-right">
              <p className="text-[var(--text-primary)] font-black text-2xl">{train.arrival}</p>
              <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-tight">{train.toName}</p>
            </div>
          </div>

          {!compact && (
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
            <div className="flex items-center gap-1.5 text-gray-500">
              <Navigation className="w-3 h-3" />
              Platform {train.platform}
            </div>
            <div className="flex items-center gap-1.5 text-gray-500">
              <RadioTower className="w-3 h-3" />
              Last: {train.lastStation}
            </div>
            {train.delay > 0 ? (
              <div className="flex items-center gap-1.5 text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
                <AlertCircle className="w-3 h-3" />
                {train.delay} min late
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                <Clock className="w-3 h-3" />
                On time
              </div>
            )}
          </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col justify-center flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/train/${train.trainNo}`)}
            className="flex items-center justify-center gap-2 bg-blue-500 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-blue-400 transition-all whitespace-nowrap shadow-lg shadow-blue-500/20"
          >
            <BarChart2 className="w-4 h-4" />
            View Dashboard
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// --- Track Train Tab ---
function TrackTrainTab() {
  const [trainNo, setTrainNo] = useState('');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!trainNo.trim()) return;
    setSearched(true);
    setLoading(true);
    setResult(null);
    setApiError(null);

    try {
      const data = await searchTrain(trainNo.trim());
      
      // Standardized response is an array of train objects
      if (Array.isArray(data) && data.length > 0) {
        const t = data[0];
        setResult({
          trainNo: t.trainNumber || t.trainNo,
          name: t.trainName || t.name,
          fromName: t.originName || t.fromName || t.from,
          toName: t.destinationName || t.toName || t.to,
          departure: t.departure || '--:--',
          arrival: t.arrival || '--:--',
          type: t.type || 'Express',
          platform: t.platform || '-',
          delay: t.delay || 0,
        });
      } 
      // Handle legacy/nested responses
      else if (data.body && data.body.length > 0 && data.body[0].trains && data.body[0].trains.length > 0) {
        const t = data.body[0].trains[0];
        setResult({
          trainNo: t.trainNumber,
          name: t.trainName,
          fromName: t.origin,
          toName: t.destination,
          departure: t.schedule?.[0]?.departureTime || '--:--',
          arrival: t.schedule?.[t.schedule.length - 1]?.arrivalTime || '--:--',
          type: t.train_type?.[0] || 'Express',
          platform: '-',
          delay: 0,
        });
      }
      // Fallback to mock data if API returns empty but mock has it
      else {
        const found = TRAINS.find((t) => t.trainNo === trainNo.trim());
        setResult(found || null);
      }
    } catch (err) {
      console.error('Search API Error:', err);
      // Robust fallback to mock data on network error
      const found = TRAINS.find((t) => t.trainNo === trainNo.trim());
      setResult(found || null);
      if (!found) setApiError("Intelligence platform connection unstable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <label className="block text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">
          Train Number
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-3 glass-card px-4 py-3">
            <TrainIcon className="w-4 h-4 text-blue-400" />
            <input
              type="text"
              value={trainNo}
              onChange={(e) => setTrainNo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. 17406"
              className="flex-1 bg-transparent text-white placeholder-gray-600 text-sm focus:outline-none"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSearch}
            disabled={loading}
            className={`flex items-center justify-center gap-2 bg-blue-500 text-white text-sm font-semibold py-3 sm:px-5 rounded-xl transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-400'}`}
          >
            {loading ? (
               <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
               <Search className="w-4 h-4" />
            )}
            {loading ? 'Searching...' : 'Track'}
          </motion.button>
        </div>
        <p className="text-xs text-gray-600 mt-3">Try: 17406, 17202, 12951</p>
      </div>

      <AnimatePresence>
        {searched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {result ? (
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm text-green-400 font-semibold">Train Found</span>
                </div>
                <p className="text-white font-bold text-lg">{result.name}</p>
                <p className="text-gray-500 text-sm mb-4">#{result.trainNo} · {result.fromName} → {result.toName}</p>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => navigate(`/train/${result.trainNo}`)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white text-sm font-semibold py-3 rounded-xl hover:bg-blue-400 transition-all shadow-lg shadow-blue-500/20"
                  >
                    <BarChart2 className="w-4 h-4" />
                    View Train Dashboard
                  </button>
                </div>
              </div>
            ) : apiError ? (
              <div className="glass-card p-5 text-center">
                <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
                <p className="text-white font-semibold">API Error</p>
                <p className="text-red-400 text-sm mt-1">{apiError}</p>
                <p className="text-gray-500 text-xs mt-2">You have exceeded your RapidAPI quota. Please upgrade your plan or wait until it resets.</p>
              </div>
            ) : (
              <div className="glass-card p-5 text-center">
                <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
                <p className="text-white font-semibold">Train not found</p>
                <p className="text-gray-500 text-sm">Try 17406, 17202, or 12951</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Main Search Page ---
export default function SearchPage() {
  const [activeTab, setActiveTab] = useState('find');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fromCode, setFromCode] = useState('');
  const [toCode, setToCode] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [findLoading, setFindLoading] = useState(false);
  const [findError, setFindError] = useState(null);
  const [findMessage, setFindMessage] = useState(null);
  const [routeLabel, setRouteLabel] = useState({ from: '', to: '' });

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    setFromCode(toCode);
    setToCode(fromCode);
  };

  const handleFromChange = (value) => {
    setFrom(value);
    setFromCode('');
  };

  const handleToChange = (value) => {
    setTo(value);
    setToCode('');
  };

  const mapApiTrainToCard = (train) => ({
    trainNo: train.trainNumber,
    name: train.trainName,
    fromName: train.fromStation,
    toName: train.toStation,
    departure: train.departureTime,
    arrival: train.arrivalTime,
    duration: train.duration,
    type: train.type || 'Express',
  });

  const handleSearch = async () => {
    if (!from.trim() || !to.trim()) {
      setFindError('Please enter both origin and destination stations.');
      setSearched(true);
      setResults([]);
      return;
    }

    const originCode = fromCode || resolveStationCode(from);
    const destCode = toCode || resolveStationCode(to);

    if (!originCode || !destCode) {
      setFindError(
        'Could not resolve station codes. Pick a station from the list or enter codes like SC, BZA, GLA, KMT.'
      );
      setSearched(true);
      setResults([]);
      return;
    }

    if (originCode === destCode) {
      setFindError('Origin and destination must be different stations.');
      setSearched(true);
      setResults([]);
      return;
    }

    setSearched(true);
    setFindLoading(true);
    setFindError(null);
    setFindMessage(null);
    setResults([]);
    setRouteLabel({ from: originCode, to: destCode });

    try {
      const data = await getTrainsBetween(originCode, destCode);
      const trains = Array.isArray(data?.trains)
        ? data.trains
        : Array.isArray(data)
          ? data
          : [];
      setResults(trains.map(mapApiTrainToCard));
      if (trains.length === 0) {
        setFindMessage(data?.message || 'No trains found for this route.');
      }
    } catch (err) {
      console.error('Between stations search failed:', err);
      const isNetwork =
        err.code === 'ERR_NETWORK' ||
        err.message?.includes('Network Error') ||
        !err.response;
      setFindError(
        isNetwork
          ? 'Cannot reach the server. Make sure the backend is running on port 5000.'
          : 'Could not load trains right now. Please try again.'
      );
      setResults([]);
    } finally {
      setFindLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-300">
      <div className="fixed inset-0 animated-grid pointer-events-none opacity-50" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Train Search</h1>
          <p className="text-[var(--text-secondary)] text-sm">Find trains, check live crowd density, and track status in real time.</p>
        </motion.div>

        {/* Tab switcher */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-1 glass-card p-1 mb-6 w-fit"
        >
          {[
            { id: 'find', label: 'Find Trains', icon: Search },
            { id: 'track', label: 'Track Train', icon: Navigation },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === 'find' ? (
            <motion.div
              key="find"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Search form */}
              <div
                className="glass-card p-6 space-y-4"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              >
                <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                  <StationInput
                    label="From"
                    value={from}
                    onChange={handleFromChange}
                    onSelectStation={(s) => setFromCode(s.code)}
                    placeholder="Origin station..."
                    icon={MapPin}
                  />

                  {/* Swap button */}
                  <motion.button
                    whileHover={{ rotate: 180, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSwap}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 w-11 h-11 glass-card-hover flex items-center justify-center sm:self-end self-center my-1 sm:my-0 sm:mb-[0px]"
                  >
                    <ArrowLeftRight className="w-4 h-4 text-blue-400 transform rotate-90 sm:rotate-0" />
                  </motion.button>

                  <StationInput
                    label="To"
                    value={to}
                    onChange={handleToChange}
                    onSelectStation={(s) => setToCode(s.code)}
                    placeholder="Destination station..."
                    icon={MapPin}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSearch}
                  disabled={findLoading}
                  className={`w-full flex items-center justify-center gap-2.5 bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-all hover:shadow-xl hover:shadow-blue-500/30 ${findLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-400'}`}
                >
                  {findLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  {findLoading ? 'Searching...' : 'Search Trains'}
                </motion.button>
                <p className="text-xs text-gray-600">Use station codes (e.g. SC, BZA) or pick from suggestions</p>
              </div>

              <AnimatePresence>
                {searched && !findLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {findError ? (
                      <div className="glass-card p-5 text-center">
                        <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
                        <p className="text-white font-semibold">Search unavailable</p>
                        <p className="text-red-400 text-sm mt-1">{findError}</p>
                      </div>
                    ) : results.length > 0 ? (
                      <>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-400">
                            <span className="text-white font-semibold">{results.length}</span> trains found
                            {routeLabel.from && routeLabel.to && (
                              <span className="text-gray-600"> · {routeLabel.from} → {routeLabel.to}</span>
                            )}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Zap className="w-3 h-3 text-blue-400" />
                            Live data
                          </div>
                        </div>
                        {results.map((train, i) => (
                          <TrainCard key={`${train.trainNo}-${i}`} train={train} index={i} compact />
                        ))}
                      </>
                    ) : (
                      <div className="glass-card p-5 text-center">
                        <TrainIcon className="w-8 h-8 text-gray-500 mx-auto mb-3" />
                        <p className="text-white font-semibold">No trains found</p>
                        <p className="text-gray-500 text-sm mt-1">
                          {findMessage || 'Try different station codes, e.g. SC → BZA'}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {!searched && (
                <div className="text-center py-10">
                  <TrainIcon className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
                  <p className="text-[var(--text-secondary)] text-sm">Enter stations and tap Search</p>
                  <p className="text-[var(--text-muted)] text-xs mt-1">Try: Secunderabad (SC) → Vijayawada (BZA)</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="track"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <TrackTrainTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
