import React from 'react';
import { AlertCircle, Clock, CheckCircle2, ThumbsUp, TrendingUp, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function StatsOverview() {
  const { stats, loading } = useApp();

  if (loading && !stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 animate-pulse">
        {[1, 2, 3, 4].map(n => (
          <div key={n} className="h-24 bg-slate-200 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  const items = [
    {
      label: 'Total Reports',
      count: stats?.total ?? 0,
      sub: 'Logged by citizens',
      icon: AlertCircle,
      color: 'text-sky-600',
      bg: 'bg-sky-50',
      border: 'border-sky-100'
    },
    {
      label: 'Active Action',
      count: (stats?.inProgress ?? 0) + (stats?.underReview ?? 0),
      sub: `${stats?.inProgress ?? 0} crews dispatched`,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100'
    },
    {
      label: 'Verified Fixed',
      count: stats?.resolved ?? 0,
      sub: `${stats?.resolutionRate ?? 0}% resolution rate`,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100'
    },
    {
      label: 'Community Voices',
      count: stats?.totalUpvotes ?? 0,
      sub: 'Citizen upvotes & confirms',
      icon: ThumbsUp,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-2xl border ${item.border} ${item.bg} bg-white shadow-xs flex items-center justify-between transition-all hover:shadow-sm`}
          >
            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider">
                {item.label}
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
                {item.count}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-medium">
                {item.sub}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${item.bg} ${item.color} shrink-0`}>
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
