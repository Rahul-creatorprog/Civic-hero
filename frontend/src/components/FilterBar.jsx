import React from 'react';
import { LayoutGrid, Map, Filter, ArrowUpDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function FilterBar() {
  const {
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    sortOption,
    setSortOption,
    viewMode,
    setViewMode,
    reporterFilter,
    setReporterFilter
  } = useApp();

  const categories = [
    { name: 'All', icon: '🌐' },
    { name: 'Roads & Potholes', icon: '🚧' },
    { name: 'Street Lighting & Electricity', icon: '💡' },
    { name: 'Water Supply & Leakage', icon: '💧' },
    { name: 'Sanitation & Waste', icon: '🗑️' },
    { name: 'Parks & Playgrounds', icon: '🛝' },
  ];

  const statuses = [
    { label: 'All Statuses', value: 'All' },
    { label: 'Reported', value: 'Reported' },
    { label: 'Under Review', value: 'Under Review' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Resolved (Fixed)', value: 'Resolved' }
  ];

  return (
    <div className="space-y-3 mb-6">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((cat) => {
          const isActive = categoryFilter.toLowerCase() === cat.name.toLowerCase();
          return (
            <button
              key={cat.name}
              onClick={() => setCategoryFilter(cat.name)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all ${
                isActive
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-200 ring-2 ring-sky-300 scale-102'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Second Line: Status, View Switcher & Sort */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200">
        {/* Status Dropdown / Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide mr-1 hidden sm:inline">
            Status:
          </span>
          {statuses.map((st) => {
            const isActive = statusFilter === st.value;
            return (
              <button
                key={st.value}
                onClick={() => setStatusFilter(st.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {st.label}
              </button>
            );
          })}
        </div>

        {/* View Mode & Sort */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Reporter Filter Pill */}
          <select
            value={reporterFilter}
            onChange={(e) => setReporterFilter(e.target.value)}
            className="text-xs bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none"
          >
            <option value="All">All Reporters</option>
            <option value="elder">Senior Citizens 👵</option>
            <option value="kid">Junior Heroes ⭐</option>
            <option value="citizen">Active Citizens</option>
          </select>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-lg px-2 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="most_upvoted">Most Upvoted (Urgent)</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* View Mode Toggle: Cards vs Map */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md transition ${
                viewMode === 'cards'
                  ? 'bg-white text-sky-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Cards Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-md transition ${
                viewMode === 'map'
                  ? 'bg-white text-sky-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Interactive City Map View"
            >
              <Map className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
