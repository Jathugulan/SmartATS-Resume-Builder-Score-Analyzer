import { FileText, BarChart3, Search, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: FileText,
    title: 'Professional Templates',
    description: '4+ ATS-friendly templates',
    iconBg: 'from-purple-600/25 to-indigo-600/35 border-purple-500/30 text-purple-300',
    glowColor: 'group-hover:border-purple-500/50 group-hover:shadow-purple-500/10',
  },
  {
    icon: BarChart3,
    title: 'AI Resume Analysis',
    description: 'Get instant ATS score',
    iconBg: 'from-emerald-600/25 to-teal-600/35 border-emerald-500/30 text-emerald-300',
    glowColor: 'group-hover:border-emerald-500/50 group-hover:shadow-emerald-500/10',
  },
  {
    icon: Search,
    title: 'Job Matching',
    description: 'Keyword suggestions',
    iconBg: 'from-amber-600/25 to-orange-600/35 border-amber-500/30 text-amber-300',
    glowColor: 'group-hover:border-amber-500/50 group-hover:shadow-amber-500/10',
  },
  {
    icon: Download,
    title: 'Download & Share',
    description: 'PDF, LaTeX, and more',
    iconBg: 'from-cyan-600/25 to-blue-600/35 border-cyan-500/30 text-cyan-300',
    glowColor: 'group-hover:border-cyan-500/50 group-hover:shadow-cyan-500/10',
  },
];

export default function FeatureCards() {
  return (
    <section id="features" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {features.map((feat, index) => {
          const Icon = feat.icon;
          return (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className={`group p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/85 border border-white/[0.08] backdrop-blur-xl transition-all duration-300 shadow-lg ${feat.glowColor} cursor-default`}
            >
              <div className="flex flex-col items-start gap-3.5">
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feat.iconBg} border flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white tracking-tight group-hover:text-cyan-200 transition-colors">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    {feat.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
