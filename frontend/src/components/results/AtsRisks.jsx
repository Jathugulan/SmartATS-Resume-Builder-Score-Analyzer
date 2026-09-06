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
      className="surface-card rounded-xl border p-6 shadow-sm"
    >
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
        <AlertTriangle className="tone-text-warning" size={20} />
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
                    <span className="text-xs opacity-80">&middot; {risk.category}</span>
                  )}
                </div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{risk.issue}</p>
                {risk.remediation && (
                  <p className="text-xs mt-1 opacity-90" style={{ color: 'var(--text-secondary)' }}>Remediation: {risk.remediation}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
