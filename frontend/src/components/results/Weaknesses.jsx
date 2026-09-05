import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export default function Weaknesses({ weaknesses }) {
  if (!weaknesses || weaknesses.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-xl border border-amber-200 p-6 shadow-sm"
    >
      <h3 className="text-lg font-bold text-amber-800 mb-4 flex items-center gap-2">
        <AlertCircle className="text-amber-500" size={20} />
        Weaknesses ({weaknesses.length})
      </h3>
      <ul className="space-y-2">
        {weaknesses.map((w, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
            <span className="text-amber-500 mt-0.5 shrink-0">•</span>
            <span>{w}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
