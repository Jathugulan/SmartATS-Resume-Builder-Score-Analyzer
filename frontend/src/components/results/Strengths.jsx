import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export default function Strengths({ strengths }) {
  if (!strengths || strengths.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="bg-white rounded-xl border border-emerald-200 p-6 shadow-sm"
    >
      <h3 className="text-lg font-bold text-emerald-800 mb-4 flex items-center gap-2">
        <CheckCircle className="text-emerald-500" size={20} />
        Strengths ({strengths.length})
      </h3>
      <ul className="space-y-2">
        {strengths.map((s, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
            <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
