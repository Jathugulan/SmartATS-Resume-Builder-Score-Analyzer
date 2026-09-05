import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatScore } from '../../utils/score';

const COLORS = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE', '#CBD5E1'];

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
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">Score Visualization</h3>
        <span className="text-xs text-slate-400">0 - 100 Raw Scale</span>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }}
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
