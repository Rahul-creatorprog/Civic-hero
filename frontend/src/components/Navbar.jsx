import React from 'react';
import { PlusCircle, ShieldCheck, UserCheck, Star, Search, MapPin, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAccessibility } from '../context/AccessibilityContext';

export default function Navbar() {
  const { userRole, setUserRole, setIsReportModalOpen, kidStars, viewMode, setViewMode } = useApp();
  const { kidMode, elderMode } = useAccessibility();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-md transition-transform hover:scale-105 ${
            kidMode
              ? 'bg-gradient-to-tr from-pink-500 to-yellow-400 text-white'
              : 'bg-gradient-to-tr from-sky-600 to-indigo-600 text-white'
          }`}>
            {kidMode ? '🦸' : '🏙️'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-extrabold tracking-tight text-slate-900 ${
                kidMode ? 'text-2xl text-pink-600' : 'text-xl sm:text-2xl'
              }`}>
                {kidMode ? 'Junior CivicHero!' : 'CivicHero'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200 hidden sm:inline-block">
                Action Tracker
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              {elderMode
                ? 'Report problems easily. Track municipal repairs step-by-step.'
                : kidMode
                ? 'Spot broken things, earn stars, make our neighborhood awesome!'
                : 'Empowering Citizens • Verifying Authority Action'}
            </p>
          </div>
        </div>

        {/* Center / Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Kid Stars Trophy Pill (if kid mode active or earned stars) */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition ${
              kidMode
                ? 'bg-yellow-100 text-yellow-900 border-2 border-yellow-400 shadow-sm'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hidden md:flex'
            }`}
            title="Earned stars for community reports!"
          >
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
            <span>{kidStars} Civic Stars</span>
          </div>

          {/* Role Switcher: Citizen vs Municipal Authority */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setUserRole('citizen')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                userRole === 'citizen'
                  ? 'bg-white text-sky-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Citizen View: Report and follow community issues"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Citizen View</span>
            </button>
            <button
              onClick={() => setUserRole('authority')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                userRole === 'authority'
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Municipal Officer View: Assign crews, update status, and attach proof photos"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Authority Portal</span>
              {userRole === 'authority' && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              )}
            </button>
          </div>

          {/* Primary Action: Report Issue Button */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl font-bold shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0 ${
              kidMode
                ? 'bg-gradient-to-r from-pink-500 to-amber-500 text-white shadow-pink-200 text-sm sm:text-base'
                : elderMode
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white text-base sm:text-lg ring-4 ring-emerald-100'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 text-sm'
            }`}
          >
            <PlusCircle className={elderMode ? 'w-6 h-6' : 'w-5 h-5'} />
            <span>{kidMode ? 'Report a Spot! 📸' : elderMode ? 'Report a Problem' : 'Report Issue'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
