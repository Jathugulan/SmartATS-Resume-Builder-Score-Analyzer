import { motion } from 'framer-motion';
import { Scale, TriangleAlert } from 'lucide-react';

export default function FinalVerdict({ verdict, parsingConfidence }) {
  if (!verdict) return null;

  // Detect rule-based fallback messages so we can apply a distinct warning style
  const isFallback = verdict.startsWith('⚠️');

  if (isFallback) {
    // Strip the leading emoji so we render it ourselves with the icon
    const bodyText = verdict.replace(/^⚠️\s*Note:\s*/i, '').trim();

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-xl p-6 shadow-lg border"
      style={{ borderColor: 'color-mix(in srgb, var(--text-warning) 45%, transparent)', backgroundColor: 'var(--bg-warning)' }}
      >
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2 tone-text-warning">
          <TriangleAlert className="shrink-0" size={20} />
          Final Verdict — Fallback Analysis
        </h3>

        <div className="flex gap-3 rounded-lg px-4 py-3 mb-0 border tone-warning">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>{bodyText}</p>
        </div>

        {parsingConfidence !== null && parsingConfidence !== undefined && (
          <div className="mt-4 pt-4 border-t theme-divider">
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Parsing Confidence: {Math.round(parsingConfidence * 100)}%
              {parsingConfidence < 0.6 && ' (Low confidence — document may have extraction limitations)'}
            </p>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="surface-card rounded-xl p-6 shadow-lg border"
      style={{ boxShadow: 'var(--shadow-md)' }}
    >
      <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
        <Scale className="tone-text-info" size={20} />
        Final Verdict
      </h3>
      <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>{verdict}</p>
      {parsingConfidence !== null && parsingConfidence !== undefined && (
        <div className="mt-4 pt-4 border-t theme-divider">
          <p className="text-xs theme-text-tertiary">
            Parsing Confidence: {Math.round(parsingConfidence * 100)}%
            {parsingConfidence < 0.6 && ' (Low confidence — document may have extraction limitations)'}
          </p>
        </div>
      )}
    </motion.div>
  );
}
