import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export default function Weaknesses({ weaknesses }) {
  if (!weaknesses || weaknesses.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="surface-card rounded-xl border p-6 shadow-sm"
      style={{ borderColor: 'var(--border-base)' }}
    >
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 tone-text-warning">
        <AlertCircle size={20} />
        Weaknesses ({weaknesses.length})
      </h3>
      <ul className="space-y-2">
        {weaknesses.map((w, i) => (
          <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <span className="tone-text-warning mt-0.5 shrink-0">•</span>
            <span>{w}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
