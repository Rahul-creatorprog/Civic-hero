import React, { useState } from 'react';
import { X, MapPin, ThumbsUp, Volume2, ShieldCheck, CheckCircle2, Clock, AlertTriangle, Send, Calendar, User, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAccessibility } from '../context/AccessibilityContext';

export default function IssueDetailModal() {
  const { selectedIssue, setSelectedIssue, upvoteIssue, addComment } = useApp();
  const { readAloud, elderMode, kidMode } = useAccessibility();

  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  if (!selectedIssue) return null;

  const handleClose = () => setSelectedIssue(null);

  const handleListenAll = () => {
    let narration = `Tracking Code ${selectedIssue.id}. Problem: ${selectedIssue.title}. Status is currently ${selectedIssue.status}. `;
    if (selectedIssue.department) {
      narration += `Handled by ${selectedIssue.department}. `;
    }
    if (selectedIssue.resolution) {
      narration += `Resolution note: ${selectedIssue.resolution.notes}. Work completed successfully!`;
    } else {
      narration += `Estimated resolution by municipal crew: ${selectedIssue.estimatedCompletion || 'In review'}.`;
    }
    readAloud(narration);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    await addComment(selectedIssue.id, {
      author: commentAuthor.trim() || 'Neighbor',
      role: 'Citizen',
      text: commentText.trim()
    });
    setCommentText('');
    setSubmittingComment(false);
  };

  const isResolved = selectedIssue.status === 'Resolved';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-xs sm:text-sm bg-slate-900 text-white px-3 py-1 rounded-lg">
              {selectedIssue.id}
            </span>
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <span>{selectedIssue.categoryIcon || '📍'}</span>
              <span>{selectedIssue.category}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleListenAll}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold transition"
              title="Listen to full issue report and timeline"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Listen</span>
            </button>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Title and Urgent Pill */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                selectedIssue.urgency === 'High'
                  ? 'bg-red-100 text-red-700 border border-red-200'
                  : selectedIssue.urgency === 'Medium'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                Priority: {selectedIssue.urgency}
              </span>

              <span className="text-xs text-slate-400">
                Reported on {new Date(selectedIssue.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h2 className={`font-extrabold text-slate-900 ${elderMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
              {selectedIssue.title}
            </h2>
          </div>

          {/* Photo Section: If Resolved, show Before & After comparison! */}
          {isResolved && selectedIssue.resolution?.proofPhoto ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-sm text-emerald-950 uppercase tracking-wide">
                  Official Verification: Before & After Repair
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden border border-slate-200 relative">
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-md shadow">
                    Before: Reported Problem
                  </div>
                  <img
                    src={selectedIssue.photo}
                    alt="Reported problem"
                    className="w-full h-52 object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden border-2 border-emerald-500 relative">
                  <div className="absolute top-2 left-2 bg-emerald-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-md shadow flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>After: Official Resolution Proof</span>
                  </div>
                  <img
                    src={selectedIssue.resolution.proofPhoto}
                    alt="Official resolution proof"
                    className="w-full h-52 object-cover"
                  />
                </div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs sm:text-sm text-emerald-900 font-medium">
                <strong>Municipal Certification: </strong>
                {selectedIssue.resolution.notes}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-72 bg-slate-100">
              <img
                src={selectedIssue.photo}
                alt={selectedIssue.title}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* Description */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Problem Description
            </h4>
            <p className={`text-slate-800 leading-relaxed ${elderMode ? 'text-base sm:text-lg' : 'text-sm'}`}>
              {selectedIssue.description}
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="font-semibold text-slate-700">{selectedIssue.location?.address}</span>
            </div>
          </div>

          {/* Authority Responsibility Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-indigo-50/70 border border-indigo-100 p-3.5 rounded-2xl">
              <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Department In-Charge
              </span>
              <p className="text-sm font-bold text-indigo-950 mt-1">
                {selectedIssue.department || 'Under Review by Dispatch'}
              </p>
              <p className="text-xs text-indigo-700 mt-0.5">
                Officer: {selectedIssue.assignedOfficer || 'Assigning field supervisor'}
              </p>
            </div>

            <div className="bg-amber-50/70 border border-amber-100 p-3.5 rounded-2xl">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Target Resolution Timeline
              </span>
              <p className="text-sm font-bold text-amber-950 mt-1">
                {selectedIssue.estimatedCompletion
                  ? `Target: ${new Date(selectedIssue.estimatedCompletion).toLocaleDateString()}`
                  : 'Resolution SLA: 48-72 hours'}
              </p>
              <p className="text-xs text-amber-800 mt-0.5">
                Status: {selectedIssue.status}
              </p>
            </div>
          </div>

          {/* Official Step-by-Step Action Timeline */}
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-600" />
              <span>Official Action Timeline & Milestones</span>
            </h4>

            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
              {selectedIssue.timeline?.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4 ml-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
                    step.status === 'Resolved'
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                      : step.status === 'In Progress'
                      ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                      : 'bg-sky-600 text-white ring-4 ring-sky-100'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="bg-white border border-slate-200 p-3 rounded-xl flex-1 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="font-bold text-xs sm:text-sm text-slate-900">
                        {step.status}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(step.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      By: {step.actor}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-700 mt-1">
                      {step.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Discussion / Comments */}
          <div className="border-t border-slate-200 pt-5">
            <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-3">
              Community Discussion ({selectedIssue.comments?.length || 0})
            </h4>

            {/* Comments List */}
            <div className="space-y-2.5 mb-4">
              {selectedIssue.comments && selectedIssue.comments.length > 0 ? (
                selectedIssue.comments.map((c) => (
                  <div key={c.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span>{c.author}</span>
                        <span className="text-[10px] bg-slate-200 px-1.5 py-0.2 rounded font-medium">
                          {c.role}
                        </span>
                      </span>
                      <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700">{c.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No community comments yet. Be the first to add an update!</p>
              )}
            </div>

            {/* Add Comment Box */}
            <form onSubmit={handleCommentSubmit} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  placeholder="Your Name (e.g. Neighbor, Resident)"
                  className="w-1/3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment or observation..."
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                  type="submit"
                  disabled={submittingComment || !commentText.trim()}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => upvoteIssue(selectedIssue.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs sm:text-sm transition border border-sky-200"
          >
            <ThumbsUp className="w-4 h-4 text-sky-600" />
            <span>I'm Affected Too ({selectedIssue.upvotes || 0})</span>
          </button>

          <button
            onClick={handleClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
