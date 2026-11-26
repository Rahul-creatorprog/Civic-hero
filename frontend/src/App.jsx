import React from 'react';
import { AccessibilityProvider, useAccessibility } from './context/AccessibilityContext';
import { AppProvider, useApp } from './context/AppContext';
import AccessibilityToolbar from './components/AccessibilityToolbar';
import Navbar from './components/Navbar';
import KidHeroBanner from './components/KidHeroBanner';
import ElderHelperBanner from './components/ElderHelperBanner';
import StatsOverview from './components/StatsOverview';
import TrackCodeSearch from './components/TrackCodeSearch';
import FilterBar from './components/FilterBar';
import IssueCard from './components/IssueCard';
import InteractiveMap from './components/InteractiveMap';
import ReportModal from './components/ReportModal';
import IssueDetailModal from './components/IssueDetailModal';
import AuthorityDashboard from './components/AuthorityDashboard';
import { AlertCircle, PlusCircle, RefreshCw } from 'lucide-react';

function MainContent() {
  const {
    issues,
    loading,
    error,
    viewMode,
    userRole,
    setIsReportModalOpen,
    fetchIssues
  } = useApp();

  const { kidMode, elderMode } = useAccessibility();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 transition-colors">
      {/* Top Accessibility & Audio Bar */}
      <AccessibilityToolbar />

      {/* Main App Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Dynamic Context Banners */}
        {kidMode && <KidHeroBanner />}
        {elderMode && <ElderHelperBanner />}

        {/* Municipal Authority Portal View (if switched) */}
        {userRole === 'authority' && <AuthorityDashboard />}

        {/* Civic Statistics */}
        <StatsOverview />

        {/* Quick Search & Voice Tracking */}
        <TrackCodeSearch />

        {/* Category & Status Filter Bar */}
        <FilterBar />

        {/* Content View: Cards vs Map */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-80 bg-slate-200 rounded-2xl"></div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-red-50 border border-red-200 rounded-2xl max-w-md mx-auto my-12">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-red-900">Connection Error</h3>
            <p className="text-xs text-red-700 mt-1">{error}</p>
            <button
              onClick={fetchIssues}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 mx-auto hover:bg-red-700 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Connecting</span>
            </button>
          </div>
        ) : viewMode === 'map' ? (
          <InteractiveMap />
        ) : issues.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl p-6 max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3">
              🔍
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">No issues found</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Try adjusting your category or status filter, or be the first to report an issue in this area!
            </p>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="mt-5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report an Issue Now</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-slate-500 text-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏙️</span>
            <span className="font-bold text-slate-800">CivicHero</span>
            <span>• Inclusive Community Problem Reporting & Authority Tracker</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600 flex-wrap justify-center">
            <span>Designed for All Ages (Kids, Youth, Elders)</span>
            <span>•</span>
            <span className="font-semibold text-slate-800">Emergency / Helpline: 1800-FIX-CITY</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ReportModal />
      <IssueDetailModal />
    </div>
  );
}

export default function App() {
  return (
    <AccessibilityProvider>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </AccessibilityProvider>
  );
}
