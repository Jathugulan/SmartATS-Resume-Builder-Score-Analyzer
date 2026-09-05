import { motion } from 'framer-motion';

function SkillTag({ skill, variant = 'default' }) {
  const styles = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    matched: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    missing: 'bg-red-50 text-red-700 border-red-200',
    partial: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[variant]}`}>
      {skill}
    </span>
  );
}

export default function SkillsSection({ skills, matching, jdProvided }) {
  const allDetected = [
    ...(skills?.technical || []),
    ...(skills?.tools || []),
    ...(skills?.soft || []),
    ...(skills?.domain || []),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-6"
    >
      {allDetected.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-3">Detected Skills ({allDetected.length})</h3>
          <div className="flex flex-wrap gap-2">
            {allDetected.map((s, i) => (
              <SkillTag key={i} skill={s} />
            ))}
          </div>

          {skills?.technical?.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <h4 className="text-sm font-semibold text-slate-600 mb-2">Technical Skills</h4>
              <div className="flex flex-wrap gap-2">
                {skills.technical.map((s, i) => (
                  <SkillTag key={i} skill={s} />
                ))}
              </div>
            </div>
          )}

          {skills?.tools?.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-semibold text-slate-600 mb-2">Tools & Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {skills.tools.map((s, i) => (
                  <SkillTag key={i} skill={s} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {jdProvided && matching && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matching.matchedSkills?.length > 0 && (
            <div className="bg-white rounded-xl border border-emerald-200 p-5 shadow-sm">
              <h4 className="text-sm font-bold text-emerald-700 mb-3">
                Matched Skills ({matching.matchedSkills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {matching.matchedSkills.map((s, i) => (
                  <SkillTag key={i} skill={s} variant="matched" />
                ))}
              </div>
            </div>
          )}

          {matching.missingSkills?.length > 0 && (
            <div className="bg-white rounded-xl border border-red-200 p-5 shadow-sm">
              <h4 className="text-sm font-bold text-red-700 mb-3">
                Missing Skills ({matching.missingSkills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {matching.missingSkills.map((s, i) => (
                  <SkillTag key={i} skill={s} variant="missing" />
                ))}
              </div>
            </div>
          )}

          {matching.partialSkills?.length > 0 && (
            <div className="bg-white rounded-xl border border-amber-200 p-5 shadow-sm md:col-span-2">
              <h4 className="text-sm font-bold text-amber-700 mb-3">
                Partial Skills ({matching.partialSkills.length})
              </h4>
              <div className="space-y-2">
                {matching.partialSkills.map((ps, i) => (
                  <div key={i} className="bg-amber-50 rounded-lg px-3 py-2">
                    <span className="text-sm font-medium text-amber-800">{ps.skill}</span>
                    {ps.context && (
                      <p className="text-xs text-amber-600 mt-0.5">{ps.context}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!jdProvided && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
          No Job Description was provided. Skill matching is based on general ATS benchmarks.
        </div>
      )}
    </motion.div>
  );
}
