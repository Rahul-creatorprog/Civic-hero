import React from 'react';
import { Volume2, VolumeX, Eye, Type, Sparkles, HeartHandshake, PhoneCall } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

export default function AccessibilityToolbar() {
  const {
    highContrast,
    toggleHighContrast,
    fontSize,
    cycleFontSize,
    kidMode,
    toggleKidMode,
    elderMode,
    toggleElderMode,
    isSpeaking,
    readAloud,
    stopAudio,
    speechSupported
  } = useAccessibility();

  const handleSpeechToggle = () => {
    if (isSpeaking) {
      stopAudio();
    } else {
      readAloud(
        "Welcome to CivicHero. You can report problems in your street like potholes, streetlights, or garbage, and track official action taken by municipal authorities. Click the big green button below to report an issue or search by your tracking number."
      );
    }
  };

  return (
    <aside aria-label="Accessibility tools" className="bg-slate-900 text-white px-3 sm:px-6 py-2 border-b border-slate-800 text-xs sm:text-sm font-medium transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        {/* Left: Quick Mode Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 hidden md:inline text-xs font-semibold tracking-wide uppercase">
            Quick Modes:
          </span>

          {/* Elder Mode Toggle */}
          <button
            onClick={toggleElderMode}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              elderMode
                ? 'bg-amber-400 text-amber-950 shadow-md ring-2 ring-amber-300 font-bold scale-105'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title="Enable large buttons, plain text, and voice guidance for senior citizens"
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Senior Friendly</span>
            {elderMode && <span className="bg-amber-600 text-white px-1.5 py-0.2 rounded-full text-[10px]">ON</span>}
          </button>

          {/* Kid Mode Toggle */}
          <button
            onClick={toggleKidMode}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              kidMode
                ? 'bg-pink-500 text-white shadow-md ring-2 ring-pink-300 font-bold scale-105'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title="Enable colorful illustrations and badges for young heroes"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Junior Hero Mode</span>
            {kidMode && <span className="bg-pink-700 text-white px-1.5 py-0.2 rounded-full text-[10px]">⭐ ON</span>}
          </button>
        </div>

        {/* Right: Accessibility Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Text Size Cycler */}
          <button
            onClick={cycleFontSize}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition"
            title="Adjust text size (Normal, Large, Extra Large)"
          >
            <Type className="w-3.5 h-3.5 text-sky-400" />
            <span>
              Text: {fontSize === 'normal' ? '100%' : fontSize === 'large' ? '120%' : '140%'}
            </span>
          </button>

          {/* High Contrast Toggle */}
          <button
            onClick={toggleHighContrast}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition ${
              highContrast
                ? 'bg-yellow-400 text-black font-bold ring-2 ring-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title="Toggle High Contrast for easy reading"
          >
            <Eye className="w-3.5 h-3.5 text-yellow-400" />
            <span>Contrast {highContrast ? 'ON' : 'OFF'}</span>
          </button>

          {/* Audio Reader */}
          {speechSupported && (
            <button
              onClick={handleSpeechToggle}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition ${
                isSpeaking
                  ? 'bg-emerald-500 text-white animate-pulse font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
              title="Read instructions aloud"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Stop Voice</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Listen Aloud</span>
                </>
              )}
            </button>
          )}

          {/* Emergency / Helpline Phone */}
          <a
            href="tel:1800123456"
            className="hidden sm:flex items-center gap-1 text-slate-400 hover:text-white text-xs pl-2 border-l border-slate-700"
            title="Toll-free 24/7 Civic Helpline"
          >
            <PhoneCall className="w-3 h-3 text-emerald-400" />
            <span className="font-mono">Helpline: 1800-FIX-CITY</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
