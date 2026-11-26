import React from 'react';
import { MapPin, ThumbsUp, Volume2, ShieldCheck, CheckCircle2, Clock, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAccessibility } from '../context/AccessibilityContext';

export default function IssueCard({ issue }) {
  const { upvoteIssue, setSelectedIssue } = useApp();
  const { readAloud, elderMode, kidMode } = useAccessibility();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: CheckCircle2,
          text: 'Verified Resolved'
        };
      case 'In Progress':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          icon: Clock,
          text: 'Action In Progress'
        };
      case 'Under Review':
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: Clock,
          text: 'Under Review'
        };
      default:
        return {
          bg: 'bg-purple-100 text-purple-800 border-purple-300',
          icon: AlertTriangle,
          text: 'Reported'
        };
    }
  };

  const statusBadge = getStatusBadge(issue.status);
  const StatusIcon = statusBadge.icon;

  const handleListenCard = (e) => {
    e.stopPropagation();
    const narration = `Problem report: ${issue.title}. Category: ${issue.category}. Location: ${issue.location?.address}. Current Status: ${issue.status}. ${
      issue.resolution ? 'Official repair has been completed and verified.' : 'Municipal team is tracking this issue.'
    }`;
    readAloud(narration);
  };

  const handleUpvote = (e) => {
    e.stopPropagation();
    upvoteIssue(issue.id);
  };

  return (
    <div
      onClick={() => setSelectedIssue(issue)}
      className={`bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col group ${
        kidMode ? 'border-2 border-pink-200 hover:border-pink-400' : ''
      }`}
    >
      {/* Top Image Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={issue.photo}
          alt={issue.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Tracking Code Overlay */}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-mono font-bold tracking-wider shadow-sm">
          {issue.id}
        </div>

        {/* Category Pill */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-slate-800 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 border border-slate-100">
          <span>{issue.categoryIcon || '📍'}</span>
          <span>{issue.category}</span>
        </div>

        {/* Status Badge Over Image */}
        <div className="absolute bottom-3 left-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-md ${statusBadge.bg}`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{statusBadge.text}</span>
          </span>
        </div>

        {/* If Resolved, Proof Photo Sticker */}
        {issue.resolution && (
          <div className="absolute bottom-3 right-3 bg-emerald-600 text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-yellow-300" />
            <span>Fix Proof Added</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Reporter details */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              👤 {issue.reporter?.name || 'Citizen'}
              {issue.reporter?.badge && (
                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-medium">
                  {issue.reporter.badge}
                </span>
              )}
            </span>
            <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Title */}
          <h3 className={`font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-sky-600 transition ${
            elderMode ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
          }`}>
            {issue.title}
          </h3>

          {/* Description snippet */}
          <p className={`text-slate-600 line-clamp-2 mt-2 leading-relaxed ${
            elderMode ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
          }`}>
            {issue.description}
          </p>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-3 font-medium">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate">{issue.location?.address}</span>
          </div>

          {/* Assigned Department (if any) */}
          {issue.department && issue.department !== 'Pending Department Assignment' && (
            <div className="mt-2.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">Assigned: {issue.department}</span>
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Upvote button */}
          <button
            onClick={handleUpvote}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 text-xs font-bold transition"
            title="I am affected too / confirm this issue"
          >
            <ThumbsUp className="w-3.5 h-3.5 text-sky-500" />
            <span>{issue.upvotes || 0}</span>
          </button>

          {/* Audio Listen Button */}
          <button
            onClick={handleListenCard}
            className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition"
            title="Listen to card details aloud"
          >
            <Volume2 className="w-4 h-4 text-emerald-600" />
          </button>

          {/* View Details Button */}
          <button
            onClick={() => setSelectedIssue(issue)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold transition ml-auto"
          >
            <span>Track Progress</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
