import React from 'react';
import { Volume2, PhoneCall, CheckCircle, Mic, ArrowRight } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useApp } from '../context/AppContext';

export default function ElderHelperBanner() {
  const { readAloud, isSpeaking } = useAccessibility();
  const { setIsReportModalOpen } = useApp();

  const handleReadGuide = () => {
    readAloud(
      "Senior Citizen Help Guide. Step 1: Click the big green button to report a problem. Step 2: You can use your voice microphone or simply pick an icon like roads or streetlights. Step 3: Our municipal officers will review and repair it, and you can see photos of the completed work right here."
    );
  };

  return (
    <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 sm:p-6 mb-6 shadow-sm">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left: Heading & Steps */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👵👴</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-amber-950">
                Senior Citizen Easy Reporting Guide
              </h2>
              <p className="text-sm text-amber-800 font-medium">
                No complicated forms. You can report broken sidewalks, dim lights, or water leaks with your voice.
              </p>
            </div>
          </div>

          {/* 3 Step Visual Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="bg-white/90 border border-amber-200 rounded-xl p-3 flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-amber-500 text-white font-extrabold flex items-center justify-center text-sm shrink-0">
                1
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-800">
                Pick what is broken (Pothole, Light, Garbage)
              </span>
            </div>

            <div className="bg-white/90 border border-amber-200 rounded-xl p-3 flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-amber-500 text-white font-extrabold flex items-center justify-center text-sm shrink-0">
                2
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-800">
                Speak or type where it is located
              </span>
            </div>

            <div className="bg-white/90 border border-amber-200 rounded-xl p-3 flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-amber-500 text-white font-extrabold flex items-center justify-center text-sm shrink-0">
                3
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-800">
                Track status & see repair photos
              </span>
            </div>
          </div>
        </div>

        {/* Right Buttons */}
        <div className="flex sm:flex-col gap-2 shrink-0 w-full lg:w-auto">
          <button
            onClick={handleReadGuide}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-sm transition"
          >
            <Volume2 className="w-4 h-4 text-amber-900" />
            <span>{isSpeaking ? 'Listening...' : 'Hear Instructions Aloud'}</span>
          </button>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm sm:text-base shadow-md transition"
          >
            <span>Start Easy Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
