import React, { useState } from 'react';
import { Search, Mic, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { createSpeechRecognizer, isSpeechRecognitionSupported } from '../utils/speech';

export default function TrackCodeSearch() {
  const { searchQuery, setSearchQuery, issues, setSelectedIssue } = useApp();
  const [isListening, setIsListening] = useState(false);

  const handleVoiceSearch = () => {
    if (!isSpeechRecognitionSupported()) {
      alert('Voice dictation is supported in modern Chrome, Edge, and Safari browsers.');
      return;
    }

    setIsListening(true);
    const recognizer = createSpeechRecognizer(
      (transcript) => {
        setSearchQuery(transcript);
        setIsListening(false);
      },
      (err) => {
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (recognizer) {
      recognizer.start();
    }
  };

  const handleDirectCodeLookup = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const trimmed = searchQuery.trim().toLowerCase();
    const found = issues.find(i => i.id.toLowerCase() === trimmed);
    if (found) {
      setSelectedIssue(found);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 mb-6 shadow-xs">
      <form onSubmit={handleDirectCodeLookup} className="flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems or enter Tracking ID (e.g. REP-2026-1001)..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
          />
          {/* Speech-to-Text Button */}
          <button
            type="button"
            onClick={handleVoiceSearch}
            className={`absolute inset-y-0 right-0 pr-3 flex items-center transition ${
              isListening ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-sky-600'
            }`}
            title="Dictate search or Tracking ID with your microphone"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-1.5 shadow-sm"
        >
          <span>Track Action</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>
      {isListening && (
        <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-red-600 inline-block"></span>
          Listening to your voice... Speak your problem or report code now.
        </p>
      )}
    </div>
  );
}
