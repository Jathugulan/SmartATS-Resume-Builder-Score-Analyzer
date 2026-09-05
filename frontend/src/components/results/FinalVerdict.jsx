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
        className="rounded-xl p-6 shadow-lg border border-amber-200 bg-amber-50"
      >
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-amber-800">
          <TriangleAlert className="text-amber-500 shrink-0" size={20} />
          Final Verdict — Fallback Analysis
        </h3>

        <div className="flex gap-3 rounded-lg bg-amber-100 border border-amber-300 px-4 py-3 mb-0">
          <p className="text-sm text-amber-900 leading-relaxed">{bodyText}</p>
        </div>

        {parsingConfidence !== null && parsingConfidence !== undefined && (
          <div className="mt-4 pt-4 border-t border-amber-200">
            <p className="text-xs text-amber-700">
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
      className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-white shadow-lg"
    >
      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
        <Scale className="text-blue-400" size={20} />
        Final Verdict
      </h3>
      <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">{verdict}</p>
      {parsingConfidence !== null && parsingConfidence !== undefined && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-xs text-slate-400">
            Parsing Confidence: {Math.round(parsingConfidence * 100)}%
            {parsingConfidence < 0.6 && ' (Low confidence — document may have extraction limitations)'}
          </p>
        </div>
      )}
    </motion.div>
  );
}
