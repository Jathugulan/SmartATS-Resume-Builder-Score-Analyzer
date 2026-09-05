import React from 'react';
import { ShieldCheck, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

export default function AtsScoreGauge({ score = 75, breakdown = null, compact = false }) {
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));

  let colorClass = 'text-emerald-400';
  let strokeClass = 'stroke-emerald-500';
  let bgClass = 'bg-emerald-500/10 border-emerald-500/20';
  let statusText = 'Excellent ATS Pass';

  if (normalizedScore < 60) {
    colorClass = 'text-rose-400';
    strokeClass = 'stroke-rose-500';
    bgClass = 'bg-rose-500/10 border-rose-500/20';
    statusText = 'High ATS Risk';
  } else if (normalizedScore < 75) {
    colorClass = 'text-amber-400';
    strokeClass = 'stroke-amber-500';
    bgClass = 'bg-amber-500/10 border-amber-500/20';
    statusText = 'Moderate ATS Match';
  }

  // SVG Circular Gauge calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${bgClass}`}>
        <div className="relative w-8 h-8 flex items-center justify-center">
          <svg className="w-8 h-8 -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              className="stroke-slate-800"
              strokeWidth="10"
              fill="transparent"
              r={radius}
              cx="50"
              cy="50"
            />
            <circle
              className={`${strokeClass} transition-all duration-700 ease-out`}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              r={radius}
              cx="50"
              cy="50"
            />
          </svg>
          <span className={`absolute text-[11px] font-bold ${colorClass}`}>
            {normalizedScore}
          </span>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Simulated ATS</p>
          <p className={`text-xs font-bold ${colorClass}`}>{statusText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl glass-card border border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className={`w-4 h-4 ${colorClass}`} />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">ATS Score Simulator</h4>
        </div>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${bgClass} ${colorClass}`}>
          {statusText}
        </span>
      </div>

      <div className="flex items-center gap-5 my-2">
        <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
          <svg className="w-20 h-20 -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              className="stroke-slate-800"
              strokeWidth="10"
              fill="transparent"
              r={radius}
              cx="50"
              cy="50"
            />
            <circle
              className={`${strokeClass} transition-all duration-700 ease-out`}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              r={radius}
              cx="50"
              cy="50"
            />
          </svg>
          <div className="absolute text-center">
            <span className={`text-xl font-extrabold ${colorClass}`}>{normalizedScore}</span>
            <span className="text-[10px] text-slate-500 block -mt-1">/100</span>
          </div>
        </div>

        <div className="text-xs space-y-1.5 flex-1">
          <p className="text-slate-300 font-medium leading-snug">
            {normalizedScore >= 75
              ? 'Strong keyword density and clear section hierarchy ready for Fortune 500 ATS.'
              : normalizedScore >= 60
              ? 'Good structure, but could benefit from more quantified metrics and technical keywords.'
              : 'Contains formatting issues or missing key technical skills for target role.'}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            <span>Target benchmark: 80+</span>
          </div>
        </div>
      </div>

      {breakdown && (
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-[11px]">
          {Object.entries(breakdown).slice(0, 4).map(([key, val]) => (
            <div key={key} className="bg-slate-900/50 p-2 rounded-lg border border-slate-800/50">
              <span className="text-slate-400 capitalize block truncate">
                {key.replace(/([A-Z])/g, ' $1')}
              </span>
              <span className="font-bold text-white">
                {typeof val === 'object' && val?.raw !== undefined ? `${val.raw}%` : typeof val === 'number' ? `${val}%` : val}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
