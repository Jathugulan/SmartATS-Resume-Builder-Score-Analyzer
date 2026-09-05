import { useState } from 'react';
import { X, Play, CheckCircle2, FileText, Zap, BarChart3, Download, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DemoModal({ isOpen, onClose, onGetStarted }) {
  const [activeStep, setActiveStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: '1. Upload & Deep Extraction',
      description: 'Drag & drop any PDF or DOCX resume. SmartATS extracts hard skills, metrics, and section hierarchies with zero data hallucination.',
      icon: FileText,
      badge: 'PDF / DOCX Parsing',
      badgeColor: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      preview: (
        <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono">Senior_Software_Engineer_Resume.pdf</span>
            <span className="text-emerald-400 font-bold">Extracted 100%</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 w-full animate-pulse" />
          </div>
          <div className="flex gap-2 text-[10px] text-slate-400">
            <span className="px-2 py-0.5 rounded bg-slate-800">4 Experience blocks</span>
            <span className="px-2 py-0.5 rounded bg-slate-800">18 Technical Skills</span>
            <span className="px-2 py-0.5 rounded bg-slate-800">3 Certifications</span>
          </div>
        </div>
      ),
    },
    {
      title: '2. 7-Dimensional ATS Scoring',
      description: 'Our proprietary verification engine benchmarks your resume across ATS format, keyword density, quantified impact, and readability.',
      icon: Zap,
      badge: 'Real-time AI Diagnostic',
      badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      preview: (
        <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white">ATS Compatibility Result</span>
            <span className="text-xl font-extrabold text-cyan-400">87% Passed</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-slate-900 border border-white/5">
              <div className="text-slate-400 text-[10px]">Keyword Match</div>
              <div className="text-emerald-400 font-bold">92% High</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-white/5">
              <div className="text-slate-400 text-[10px]">Format Cleanliness</div>
              <div className="text-cyan-400 font-bold">98% Strict</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '3. LaTeX Studio & Overleaf Export',
      description: 'Switch between 4 pre-approved ATS templates without losing your data. Export clean compilable .tex or high-resolution vector PDF.',
      icon: Download,
      badge: 'Overleaf Grade Output',
      badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      preview: (
        <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-cyan-300">\documentclass&#123;article&#125;</span>
            <span className="text-slate-400">4 Templates Available</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 text-[11px] font-mono text-slate-300 border border-white/5">
            <div>\begin&#123;document&#125;</div>
            <div className="pl-3 text-purple-300">\resumeSection&#123;Summary&#125;</div>
            <div className="pl-3 text-cyan-300">\resumeSection&#123;Technical Skills&#125;</div>
            <div>\end&#123;document&#125;</div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl rounded-3xl bg-slate-900/95 border border-white/15 p-6 sm:p-8 shadow-2xl shadow-indigo-950/50 backdrop-blur-2xl z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                <Play className="w-4 h-4 fill-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">SmartATS Product Demo</h3>
                <p className="text-xs text-slate-400">See how SmartATS turns raw resumes into 90%+ ATS-ready documents</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive Steps Bar */}
          <div className="grid grid-cols-3 gap-2 my-5">
            {steps.map((s, idx) => (
              <button
                key={s.title}
                onClick={() => setActiveStep(idx)}
                className={`py-2 px-3 rounded-xl text-left transition-all border cursor-pointer ${
                  activeStep === idx
                    ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/30 border-cyan-400/50 text-white shadow-md'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-[11px] font-bold truncate">Step 0{idx + 1}</div>
                <div className="text-[10px] text-slate-400 truncate">{s.title.split('. ')[1]}</div>
              </button>
            ))}
          </div>

          {/* Active Step Content */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-white">{steps[activeStep].title}</h4>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${steps[activeStep].badgeColor}`}>
                {steps[activeStep].badge}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {steps[activeStep].description}
            </p>
            {steps[activeStep].preview}
          </div>

          {/* Modal Footer CTA */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  onGetStarted?.();
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer border border-white/20"
              >
                Try SmartATS Now →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
