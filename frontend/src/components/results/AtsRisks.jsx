import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { getSeverityColor } from '../../utils/score';

export default function AtsRisks({ risks }) {
  if (!risks || risks.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
    >
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <AlertTriangle className="text-amber-500" size={20} />
        ATS Risks ({risks.length})
      </h3>
      <div className="space-y-3">
        {risks.map((risk, i) => (
          <div key={i} className={`rounded-lg border p-4 ${getSeverityColor(risk.severity)}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase">{risk.severity}</span>
                  {risk.category && (
                    <span className="text-xs opacity-70">&middot; {risk.category}</span>
                  )}
                </div>
                <p className="text-sm font-medium">{risk.issue}</p>
                {risk.remediation && (
                  <p className="text-xs mt-1 opacity-80">Remediation: {risk.remediation}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
