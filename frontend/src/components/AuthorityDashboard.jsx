import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Clock, AlertTriangle, UserCheck, Wrench, Send, Camera, Sparkles, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AuthorityDashboard() {
  const { issues, stats, updateIssueStatus, setSelectedIssue } = useApp();

  const [selectedIssueId, setSelectedIssueId] = useState('');
  const [newStatus, setNewStatus] = useState('In Progress');
  const [department, setDepartment] = useState('Public Works & Road Maintenance');
  const [assignedOfficer, setAssignedOfficer] = useState('Eng. Rajesh Kumar');
  const [officerNotes, setOfficerNotes] = useState('');
  const [resolutionPhoto, setResolutionPhoto] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const departments = [
    'Public Works & Road Maintenance',
    'City Electrical & Energy Board',
    'Water Supply & Sewerage Board',
    'Solid Waste & Sanitation Management',
    'Parks & Recreation Department',
    'Public Safety & Disaster Management'
  ];

  const sampleResolutionPhotos = [
    'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
  ];

  // Set default selected issue when opening
  React.useEffect(() => {
    if (issues.length > 0 && !selectedIssueId) {
      setSelectedIssueId(issues[0].id);
    }
  }, [issues, selectedIssueId]);

  const activeIssue = issues.find(i => i.id === selectedIssueId) || issues[0];

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!activeIssue) return;

    setIsUpdating(true);
    setFeedbackMsg('');

    const payload = {
      status: newStatus,
      department: department,
      assignedOfficer: assignedOfficer,
      note: officerNotes || `Status updated to ${newStatus} by Municipal Dispatch.`,
      resolutionPhoto: newStatus === 'Resolved' ? (resolutionPhoto || sampleResolutionPhotos[0]) : null,
      resolutionNotes: newStatus === 'Resolved' ? (officerNotes || 'Work certified complete by municipal inspection.') : null,
      actorName: `${assignedOfficer} (${department})`
    };

    const success = await updateIssueStatus(activeIssue.id, payload);
    setIsUpdating(false);

    if (success) {
      setFeedbackMsg(`Action logged! Issue ${activeIssue.id} updated to "${newStatus}".`);
      setOfficerNotes('');
      setTimeout(() => setFeedbackMsg(''), 4000);
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-7 mb-8 shadow-xl border border-slate-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-600 text-white">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Municipal Authority Action & Dispatch Center
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Official portal for Municipal Officers, Ward Engineers, and Contractors to review reports, dispatch field crews, and publish verified resolution proofs.
          </p>
        </div>

        {/* Live Authority Badges */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Dispatch Active</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium">
            Ward 1-8 Coverage
          </span>
        </div>
      </div>

      {/* Main Grid: Issue Selector & Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Column: Select Issue Queue (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Incoming Reports Queue ({issues.length})
            </h3>
            <span className="text-[11px] text-slate-500">Click to inspect</span>
          </div>

          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {issues.map((item) => {
              const isSelected = item.id === activeIssue?.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedIssueId(item.id)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer text-left ${
                    isSelected
                      ? 'bg-slate-800 border-indigo-500 ring-2 ring-indigo-400/50'
                      : 'bg-slate-950/50 border-slate-800 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-indigo-400">{item.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'Resolved'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : item.status === 'In Progress'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-purple-500/20 text-purple-300'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-200 line-clamp-1">{item.title}</h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>{item.category}</span>
                    <span className="text-rose-400 font-semibold">{item.urgency} Urgency</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Take Action & Update Status (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950/70 border border-slate-800 rounded-2xl p-5 sm:p-6">
          {activeIssue ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[11px] font-mono text-indigo-400 font-bold block">
                    MANAGING REPORT: {activeIssue.id}
                  </span>
                  <h3 className="font-bold text-base sm:text-lg text-white">
                    {activeIssue.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedIssue(activeIssue)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
                >
                  View Full Detail
                </button>
              </div>

              {/* Status Update Radio / Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Update Workflow Status
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Reported', 'Under Review', 'In Progress', 'Resolved'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setNewStatus(st)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                        newStatus === st
                          ? st === 'Resolved'
                            ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg'
                            : 'bg-indigo-600 border-indigo-400 text-white shadow-lg'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Department Assignment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Assign Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {departments.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Field Lead / Officer Name
                  </label>
                  <input
                    type="text"
                    value={assignedOfficer}
                    onChange={(e) => setAssignedOfficer(e.target.value)}
                    placeholder="e.g. Officer Anita Desai"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Action Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Official Action Log / Repair Note
                </label>
                <textarea
                  rows={2}
                  value={officerNotes}
                  onChange={(e) => setOfficerNotes(e.target.value)}
                  placeholder="e.g. Dispatched asphalt patching crew with safety cones. Scheduled completion by Friday."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* If marked Resolved: Resolution Proof Photo selector */}
              {newStatus === 'Resolved' && (
                <div className="bg-emerald-950/40 border border-emerald-600/40 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-bold text-xs uppercase tracking-wider">
                      Attach Resolution Proof Photo (Visible to Citizens)
                    </span>
                  </div>
                  <p className="text-xs text-emerald-200">
                    Citizens and children can see the before & after comparison proof.
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    {sampleResolutionPhotos.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setResolutionPhoto(url)}
                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                          (resolutionPhoto === url || (!resolutionPhoto && i === 0))
                            ? 'border-emerald-400 ring-2 ring-emerald-300 scale-105'
                            : 'border-slate-700 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt="Proof sample" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback Alert */}
              {feedbackMsg && (
                <div className="bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs font-bold p-3 rounded-xl flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{feedbackMsg}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-900/50 flex items-center justify-center gap-2 transition"
                >
                  <Wrench className="w-4 h-4" />
                  <span>{isUpdating ? 'Logging Authority Action...' : 'Publish Action & Update Workflow'}</span>
                </button>
              </div>
            </form>
          ) : (
            <p className="text-slate-500 text-sm italic">No issue selected.</p>
          )}
        </div>
      </div>
    </div>
  );
}
