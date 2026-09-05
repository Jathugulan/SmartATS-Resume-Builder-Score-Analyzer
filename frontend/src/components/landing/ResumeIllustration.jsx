import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function ResumeIllustration() {
  return (
    <div className="relative w-full max-w-[440px] mx-auto select-none py-6">
      {/* Background ambient glow */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/20 via-blue-600/25 to-purple-600/30 rounded-full blur-3xl -z-10 animate-pulse pointer-events-none" />

      {/* Floating Sparkle Stars */}
      <motion.div
        animate={{ y: [-4, 4, -4], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-2 left-6 text-amber-300 pointer-events-none"
      >
        <Sparkles className="w-5 h-5 drop-shadow-[0_0_8px_rgba(252,211,77,0.8)]" />
      </motion.div>

      <motion.div
        animate={{ y: [4, -4, 4], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-1/2 -right-3 text-cyan-300 pointer-events-none"
      >
        <Sparkles className="w-4 h-4 drop-shadow-[0_0_8px_rgba(103,232,249,0.8)]" />
      </motion.div>

      <motion.div
        animate={{ y: [-3, 3, -3], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-16 -left-3 text-purple-300 pointer-events-none"
      >
        <Sparkles className="w-3.5 h-3.5 drop-shadow-[0_0_8px_rgba(216,180,254,0.8)]" />
      </motion.div>

      {/* Tilted Background Document Layer 2 (Furthest back) */}
      <div className="absolute inset-x-8 top-1 h-80 rounded-2xl bg-gradient-to-br from-indigo-950/70 to-slate-900/80 border border-white/10 -rotate-6 scale-90 -z-10 shadow-xl opacity-60 backdrop-blur-md" />

      {/* Tilted Background Document Layer 1 (Middle) */}
      <div className="absolute inset-x-4 top-3 h-84 rounded-2xl bg-gradient-to-br from-blue-950/80 to-slate-900/90 border border-white/15 3 rotate-3 scale-95 -z-10 shadow-2xl opacity-80 backdrop-blur-md" />

      {/* Main Resume Document Card */}
      <motion.div
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative rounded-2xl bg-gradient-to-b from-white/95 to-slate-100/95 text-slate-900 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/40 backdrop-blur-xl"
      >
        {/* Header with Avatar & Title */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-slate-200/80">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-md flex-shrink-0">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
              <span className="bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent">JA</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">Your Resume</h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                Parsed v2.4
              </span>
            </div>
            <div className="h-2 w-28 bg-slate-300 rounded-full mt-1.5" />
          </div>
        </div>

        {/* Skeleton Document Content */}
        <div className="py-4 space-y-3.5">
          {/* Summary line skeletons */}
          <div className="space-y-1.5">
            <div className="h-1.5 w-full bg-slate-300/80 rounded-full" />
            <div className="h-1.5 w-5/6 bg-slate-300/70 rounded-full" />
            <div className="h-1.5 w-2/3 bg-slate-300/60 rounded-full" />
          </div>

          {/* Experience snippet */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-1.5">
              <div className="h-2.5 w-24 bg-slate-800 rounded-full" />
              <div className="h-2 w-14 bg-slate-300 rounded-full" />
            </div>
            <div className="space-y-1.5 pl-2 border-l-2 border-blue-500">
              <div className="h-1.5 w-11/12 bg-slate-300/80 rounded-full" />
              <div className="h-1.5 w-4/5 bg-slate-300/70 rounded-full" />
            </div>
          </div>

          {/* Skills pills */}
          <div className="pt-1">
            <div className="h-2 w-16 bg-slate-800 rounded-full mb-2" />
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-200">
                React.js
              </span>
              <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-semibold border border-purple-200">
                TypeScript
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                Node.js
              </span>
              <span className="px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-700 text-[10px] font-semibold border border-cyan-200">
                LaTeX
              </span>
            </div>
          </div>

          {/* Education lines */}
          <div className="pt-1">
            <div className="h-2 w-20 bg-slate-800 rounded-full mb-1.5" />
            <div className="h-1.5 w-3/4 bg-slate-300/80 rounded-full" />
          </div>
        </div>
      </motion.div>

      {/* Floating Card 1: Great Job Badge (Top Right) */}
      <motion.div
        animate={{ y: [4, -6, 4] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
        className="absolute -top-3 -right-4 sm:-right-6 rounded-xl bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-slate-900/95 border border-purple-400/40 p-2.5 shadow-xl shadow-purple-950/50 backdrop-blur-xl flex items-center gap-2.5 z-20"
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
          <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
        </div>
        <div>
          <p className="text-xs font-bold text-white leading-none">Great Job!</p>
          <p className="text-[10px] font-medium text-purple-200/90 mt-0.5">Your resume is ATS ready!</p>
        </div>
      </motion.div>

      {/* Floating Card 2: Circular Progress 87% ATS Score (Right Side) */}
      <motion.div
        animate={{ y: [-6, 6, -6] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        className="absolute top-16 -right-5 sm:-right-8 w-22 h-22 sm:w-24 sm:h-24 rounded-full bg-slate-950/95 border border-cyan-500/40 shadow-2xl shadow-cyan-500/20 backdrop-blur-xl flex flex-col items-center justify-center p-2 z-20"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Circular SVG Ring */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
            <circle
              cx="36"
              cy="36"
              r="30"
              className="text-slate-800"
              strokeWidth="5"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="36"
              cy="36"
              r="30"
              strokeWidth="5"
              strokeDasharray={188.4}
              strokeDashoffset={188.4 * (1 - 0.87)}
              strokeLinecap="round"
              stroke="url(#atsScoreGradient)"
              fill="transparent"
            />
            <defs>
              <linearGradient id="atsScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-none">87%</span>
            <span className="text-[9px] font-bold text-cyan-300/90 uppercase tracking-wider mt-0.5">ATS Score</span>
          </div>
        </div>
      </motion.div>

      {/* Floating Card 3: Checklist (Bottom Left) */}
      <motion.div
        animate={{ y: [5, -5, 5] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        className="absolute -bottom-4 -left-4 sm:-left-6 rounded-2xl bg-slate-950/90 border border-white/15 p-3.5 shadow-2xl shadow-black/60 backdrop-blur-xl z-20 space-y-2 min-w-[170px]"
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>ATS Format</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Keyword Match</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Professional Design</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>AI Suggestions</span>
        </div>
      </motion.div>

      {/* Handwritten Style Visual Flow Below */}
      <div className="mt-8 flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-2 font-serif italic text-base sm:text-lg font-bold text-slate-200 tracking-wide">
          <span>Build</span>
          <span className="text-cyan-400">→</span>
          <span>Analyze</span>
          <span className="text-cyan-400">→</span>
          <span className="text-white">Get Hired</span>
        </div>
        {/* Curved hand-drawn swoosh SVG */}
        <svg className="w-44 h-3.5 text-cyan-400 mt-0.5" viewBox="0 0 170 14" fill="none">
          <path
            d="M2 10C35 2 95 2 168 11"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
