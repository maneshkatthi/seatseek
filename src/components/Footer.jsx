import { Train } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0d1117] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-blue-500/20 border border-blue-500/40 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
              <img src="/seatseek-logo.png" alt="SeatSeek" className="w-full h-full object-contain brightness-0 invert scale-[1.8]" />
            </div>
            <span className="text-xl font-bold text-white">
              Seat<span className="text-blue-400">Seek</span>
            </span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-8">
            <Link to="/search" className="text-sm text-gray-400 hover:text-white transition-colors">Search</Link>
            <a href="/#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">How It Works</a>
            <Link to="/about" className="text-sm text-gray-400 hover:text-white transition-colors">About</Link>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">SeatSeek — Smart Railway Crowd Intelligence.</p>
          <div className="flex items-center gap-2 text-gray-600 text-xs">
            Powered By 
            <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded border border-white/10">
              <img src="/review-logo.png" alt="ReView AI" className="w-4 h-4 object-contain rounded-full" />
              <span className="font-semibold text-gray-400">ReView AI</span>
            </div>
            | Team Orbit
          </div>
        </div>
      </div>
    </footer>
  );
}
