import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatScore } from '../../utils/score';

const COLORS = ['#2563EB', '#3B82F6', '#60A5FA', '#818CF8', '#A78BFA', '#7DD3FC', '#94A3B8'];
const AXIS_COLOR = 'var(--text-tertiary)';

export default function ScoreChart({ breakdown, jdProvided = false }) {
  if (!breakdown) return null;

  const categoryLabels = {
    keywordSkillMatch: jdProvided ? 'Keywords' : 'Skills',
    jobDescriptionRelevance: jdProvided ? 'JD Match' : 'Cohesion',
    atsStructure: 'Structure',
    relevantExperience: 'Experience',
    educationCertifications: 'Education',
    achievementsImpact: 'Achievements',
    formattingReadability: 'Formatting',
  };

  const data = Object.entries(categoryLabels).map(([key, label]) => ({
    name: label,
    score: breakdown[key]?.raw || 0,
    weighted: breakdown[key]?.weighted || 0,
  }));

  return (
    <div className="surface-card rounded-xl border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Score Visualization</h3>
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>0 - 100 Raw Scale</span>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: AXIS_COLOR }} stroke="var(--border-separator)" />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: AXIS_COLOR }} stroke="var(--border-separator)" />
          <Tooltip
            cursor={{ fill: 'var(--bg-muted)' }}
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid var(--border-base)',
              fontSize: '12px',
              backgroundColor: 'var(--bg-modal)',
              color: 'var(--text-primary)',
            }}
            labelStyle={{ color: 'var(--text-primary)' }}
            formatter={(value, name, item) => [
              `${formatScore(value)}/100 (${item.payload.weighted} weighted pts)`,
              'Raw Score',
            ]}
          />
          <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {data.map((entry, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
