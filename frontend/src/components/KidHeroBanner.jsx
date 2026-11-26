import React from 'react';
import { Star, Award, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function KidHeroBanner() {
  const { kidStars, setIsReportModalOpen } = useApp();

  const getRank = (stars) => {
    if (stars >= 10) return { title: 'Master City Guardian 🏆', color: 'from-amber-400 to-yellow-500' };
    if (stars >= 5) return { title: 'Super Neighborhood Scout 🛡️', color: 'from-purple-500 to-indigo-600' };
    return { title: 'Junior Community Hero ⭐', color: 'from-pink-500 to-rose-500' };
  };

  const rank = getRank(kidStars);

  return (
    <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-amber-50 border-2 border-pink-300 rounded-2xl p-4 sm:p-5 mb-6 shadow-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Mascot & Rank */}
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="text-4xl sm:text-5xl animate-bounce">
            🦸‍♂️
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">
                Civic Mission Mode
              </span>
              <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                {kidStars} Stars Earned
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
              Welcome, {rank.title}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Found a broken swing, open water pipe, or dark street? Take a picture to alert city helpers!
            </p>
          </div>
        </div>

        {/* Right: Badges & Action */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-xl border border-pink-200 text-xs">
            <span className="text-lg">🛝</span>
            <span>Park Safe</span>
            <span className="text-lg ml-2">💧</span>
            <span>Save Water</span>
            <span className="text-lg ml-2">💡</span>
            <span>Bright Lights</span>
          </div>
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-4 py-2.5 rounded-xl font-extrabold text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-md hover:shadow-lg transition transform hover:scale-105 active:scale-95 text-xs sm:text-sm flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Spot & Report Spot! (+1 ⭐)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
