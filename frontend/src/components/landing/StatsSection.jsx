import { FileText, BarChart3, Star, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StatsSection() {
  const stats = [
    {
      icon: FileText,
      value: '10K+',
      label: 'Resumes Created',
      iconColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
    {
      icon: BarChart3,
      value: '85%',
      label: 'Get More Interviews',
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      icon: Star,
      value: '4.8/5',
      label: 'User Satisfaction',
      iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      icon: CheckCircle,
      value: '100%',
      label: 'ATS Optimized',
      iconColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl bg-slate-900/50 border border-white/[0.08] backdrop-blur-xl p-5 sm:p-6 shadow-xl"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08]">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`flex items-center gap-3.5 ${
                  idx !== 0 ? 'pt-4 sm:pt-0 sm:pl-6' : ''
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center border flex-shrink-0 ${item.iconColor}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
                    {item.value}
                  </div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5 whitespace-nowrap">
                    {item.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
