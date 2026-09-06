import { motion } from 'framer-motion';

function SkillTag({ skill, variant = 'default' }) {
  const styles = {
    default: 'tone-slate',
    matched: 'tone-success',
    missing: 'tone-danger',
    partial: 'tone-warning',
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
        <div className="surface-card rounded-xl border p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Detected Skills ({allDetected.length})</h3>
          <div className="flex flex-wrap gap-2">
            {allDetected.map((s, i) => (
              <SkillTag key={i} skill={s} />
            ))}
          </div>

          {skills?.technical?.length > 0 && (
            <div className="mt-4 pt-4 border-t theme-divider">
              <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Technical Skills</h4>
              <div className="flex flex-wrap gap-2">
                {skills.technical.map((s, i) => (
                  <SkillTag key={i} skill={s} />
                ))}
              </div>
            </div>
          )}

          {skills?.tools?.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Tools & Technologies</h4>
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
            <div className="surface-card rounded-xl border p-5 shadow-sm" style={{ borderColor: 'var(--border-base)' }}>
              <h4 className="text-sm font-bold mb-3 tone-text-success">
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
            <div className="surface-card rounded-xl border p-5 shadow-sm" style={{ borderColor: 'var(--border-base)' }}>
              <h4 className="text-sm font-bold mb-3 tone-text-danger">
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
            <div className="surface-card rounded-xl border p-5 shadow-sm md:col-span-2" style={{ borderColor: 'var(--border-base)' }}>
              <h4 className="text-sm font-bold mb-3 tone-text-warning">
                Partial Skills ({matching.partialSkills.length})
              </h4>
              <div className="space-y-2">
                {matching.partialSkills.map((ps, i) => (
                  <div key={i} className="rounded-lg px-3 py-2 tone-warning">
                    <span className="text-sm font-medium">{ps.skill}</span>
                    {ps.context && (
                      <p className="text-xs mt-0.5 opacity-90">{ps.context}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!jdProvided && (
        <div className="rounded-xl border p-4 text-sm tone-info">
          No Job Description was provided. Skill matching is based on general ATS benchmarks.
        </div>
      )}
    </motion.div>
  );
}
