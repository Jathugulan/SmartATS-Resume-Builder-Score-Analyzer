import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export default function Strengths({ strengths }) {
  if (!strengths || strengths.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="surface-card rounded-xl border p-6 shadow-sm"
      style={{ borderColor: 'var(--border-base)' }}
    >
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 tone-text-success">
        <CheckCircle size={20} />
        Strengths ({strengths.length})
      </h3>
      <ul className="space-y-2">
        {strengths.map((s, i) => (
          <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <span className="tone-text-success mt-0.5 shrink-0">•</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
