import { motion } from 'framer-motion';
import { FileText, Search, Cpu, BarChart3, CheckCircle2, Sparkles } from 'lucide-react';

const stages = [
  { icon: FileText, label: 'Reading document', color: 'text-blue-500' },
  { icon: Search, label: 'Extracting content', color: 'text-indigo-500' },
  { icon: Cpu, label: 'AI analyzing resume', color: 'text-violet-500' },
  { icon: BarChart3, label: 'Calculating ATS score', color: 'text-blue-600' },
  { icon: Sparkles, label: 'Generating recommendations', color: 'text-emerald-500' },
  { icon: CheckCircle2, label: 'Saving analysis', color: 'text-emerald-600' },
];

export default function Analyzing() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md mx-auto"
      >
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          <div className="absolute inset-3 rounded-full bg-blue-50 flex items-center justify-center">
            <Cpu className="text-blue-600" size={32} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-2">Analyzing your resume</h2>
        <p className="text-slate-500 mb-10">Our AI is reviewing your document. This usually takes 10-30 seconds.</p>

        <div className="space-y-3 text-left">
          {stages.map(({ icon: Icon, label, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.3, duration: 0.4 }}
              className="flex items-center gap-3 bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm"
            >
              <Icon size={18} className={color} />
              <span className="text-sm font-medium text-slate-700">{label}</span>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: i * 0.3 + 0.2, duration: 1.5, ease: 'easeInOut' }}
                className="h-1 bg-slate-100 rounded-full ml-auto flex-1 max-w-24"
              >
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ delay: i * 0.3 + 0.4, duration: 1.2, ease: 'easeOut' }}
                  className="h-full bg-blue-500 rounded-full"
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
