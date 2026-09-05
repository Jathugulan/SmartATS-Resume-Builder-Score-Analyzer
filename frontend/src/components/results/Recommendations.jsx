import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { getPriorityColor } from '../../utils/score';

export default function Recommendations({ recommendations }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
      className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
    >
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Lightbulb className="text-amber-500" size={20} />
        Recommendations ({recommendations.length})
      </h3>
      <div className="space-y-3">
        {recommendations.map((rec, i) => (
          <div key={i} className={`rounded-lg border p-4 ${getPriorityColor(rec.priority)}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase">{rec.priority}</span>
              {rec.category && <span className="text-xs opacity-70">&middot; {rec.category}</span>}
            </div>
            <p className="text-sm font-medium text-slate-800">{rec.recommendation}</p>
            {rec.evidence && (
              <p className="text-xs text-slate-500 mt-1">Evidence: {rec.evidence}</p>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
