import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, Zap, ShieldCheck, Sparkles, FileText, Brain, Gauge, Infinity as InfinityIcon,
} from 'lucide-react';
import {
  FadeIn, SectionHeader, useAppNav, CtaButton, Badge,
} from '../components/landing/MarketingBits';
import { usePageMeta } from '../hooks/usePageMeta';

/* ------ Pricing tiers ---------------------------------------------- */
const PLANS = [
  {
    name: 'Free',
    price: 0,
    tagline: 'Everything you need to start building great resumes.',
    features: [
      '1 active resume',
      '10+ ATS-friendly templates',
      'Basic ATS score analysis',
      'PDF export',
    ],
    cta: { label: 'Start Free', onClickKey: 'goRegister' },
    popular: false,
  },
  {
    name: 'Pro',
    price: 9,
    tagline: 'For active job seekers who want every edge.',
    features: [
      'Unlimited resumes',
      'AI resume optimization',
      'Advanced ATS & keyword analysis',
      'Job description matching',
      'All templates & custom styling',
      'Priority support',
    ],
    cta: { label: 'Go Pro', onClickKey: 'goRegister' },
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 29,
    tagline: 'For teams, coaches, and career services.',
    features: [
      'Everything in Pro',
      'Team workspaces',
      'Bulk resume audits',
      'Custom branding & templates',
      'API access',
      'Dedicated account manager',
    ],
    cta: { label: 'Contact Us', onClickKey: 'goRegister' },
    popular: false,
  },
];

const FAQ = [
  {
    q: 'Can I really build a resume for free?',
    a: 'Yes. The Free plan includes unlimited editing, all core templates, basic ATS analysis and PDF export — no credit card required.',
  },
  {
    q: 'What makes a resume ATS-friendly?',
    a: 'Applicant tracking systems parse standard section names, single-column layouts, and machine-readable text cleanly. Every template and analysis here is built around those rules.',
  },
  {
    q: 'Can I cancel or change plans anytime?',
    a: 'Absolutely. You can upgrade, downgrade, or cancel in one click from your settings. Pro features remain accessible until the end of your billing period.',
  },
  {
    q: 'Is my data private?',
    a: 'Your resumes and job descriptions are never sold. We only use your content to run analysis and optimization while you are signed in.',
  },
];

/* ═══════════════════════════════════════════════════════════════════
   PRICING — Public marketing page
   ═══════════════════════════════════════════════════════════════════ */
export default function Pricing() {
  usePageMeta({
    title: 'Pricing — ATS Resume Builder & Analyzer',
    description:
      'Simple, transparent pricing for building ATS-optimized resumes. Start free and upgrade when you are ready for AI optimization and advanced analysis.',
  });

  const { goRegister, goBuilder } = useAppNav();
  const [billing, setBilling] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(null);

  const handleCta = (key) => {
    if (key === 'goBuilder') goBuilder();
    else goRegister();
  };

  return (
    <div className="w-full overflow-hidden">
      {/* ------ HERO ------------------------------------------------ */}
      <section className="relative">
        <div className="absolute inset-0 hero-gradient pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-accent)', color: 'var(--text-accent)' }}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Simple, Transparent Pricing
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] max-w-3xl mx-auto"
            style={{ color: 'var(--text-primary)' }}
          >
            Pay Only for the Tools{' '}
            <span className="gradient-text">You Need</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            Start free today. Upgrade for AI optimization, unlimited resumes, and deeper analysis — no hidden fees.
          </motion.p>

          {/* Billing toggle */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex p-1 border rounded-full"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}
          >
            {['monthly', 'yearly'].map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className="px-4 py-2 rounded-full text-sm font-bold transition-all cursor-pointer capitalize"
                style={{
                  backgroundColor: billing === b ? 'var(--accent)' : 'transparent',
                  color: billing === b ? '#fff' : 'var(--text-secondary)',
                }}
              >
                {b}
                {b === 'yearly' && <span className="ml-1 text-[10px] font-black opacity-90">-20%</span>}
              </button>
            ))}
          </motion.div>
        </div>
      </section>
{/* ------ PRICING CARDS --------------------------------------- */}
      <section className="py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {PLANS.map((plan, i) => {
              const price = plan.price === 0 ? 0 : billing === 'yearly' ? Math.round(plan.price * 0.8) : plan.price;
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className={`relative rounded-3xl border p-7 flex flex-col transition-all duration-300 hover:-translate-y-1.5 ${
                    plan.popular ? 'hover:shadow-xl' : 'hover:shadow-lg'
                  }`}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: plan.popular ? 'var(--border-accent)' : 'var(--border-base)',
                    boxShadow: plan.popular ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                  }}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge tone="indigo">
                        <Sparkles className="w-3 h-3" /> Most Popular
                      </Badge>
                    </div>
                  )}

                  <div className="mb-2 text-sm font-extrabold uppercase tracking-wider" style={{ color: plan.popular ? 'var(--text-accent)' : 'var(--text-secondary)' }}>
                    {plan.name}
                  </div>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-4xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                      ${price}
                    </span>
                    <span className="text-xs font-semibold mb-1.5" style={{ color: 'var(--text-tertiary)' }}>
                      / month
                    </span>
                  </div>
                  <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{plan.tagline}</p>

                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm font-medium">
                        <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </span>
                        <span style={{ color: 'var(--text-primary)' }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <CtaButton
                    size="lg"
                    variant={plan.popular ? 'primary' : 'outline'}
                    className="w-full"
                    onClick={() => handleCta(plan.cta.onClickKey)}
                    icon={plan.popular ? Zap : Sparkles}
                  >
                    {plan.cta.label}
                  </CtaButton>
                </motion.div>
              );
            })}
          </div>

          <FadeIn className="mt-10 text-center">
            <p className="text-sm font-semibold flex flex-wrap items-center justify-center gap-2" style={{ color: 'var(--text-tertiary)' }}>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Cancel anytime · No hidden fees · 14-day money-back guarantee
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ------ COMPARE / VALUE ------------------------------------- */}
      <section className="py-14 sm:py-20" style={{ backgroundColor: 'var(--bg-elevated)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <FadeIn>
            <SectionHeader
              label="What You Get"
              heading="Every Plan Includes the Core Toolset"
              sub="Build, analyze, and download an ATS-optimized resume — then unlock AI power as you grow."
            />
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {[
                { icon: FileText, title: 'Smart Resume Builder', desc: 'A structured editor with live preview and reorderable sections.' },
                { icon: Gauge, title: 'ATS Score Analyzer', desc: 'Instant diagnostics across formatting, keywords, and completeness.' },
                { icon: Brain, title: 'AI Optimization', desc: 'Rewrite weak bullets, summaries, and skills with AI.' },
                { icon: FileText, title: 'Job Description Matching', desc: 'See every keyword you are hitting and every gap to close.' },
              ].map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}>
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-extrabold mb-1.5" style={{ color: 'var(--text-primary)' }}>{f.title}</div>
                    <div className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</div>
                  </div>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </section>
{/* ------ FAQ ------------------------------------------------ */}
      <section id="faq" className="py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <FadeIn>
            <SectionHeader
              label="FAQ"
              heading="Questions, Answered"
              sub="Everything you need to know about pricing, ATS, and your data."
            />
          </FadeIn>
          <div className="space-y-3">
            {FAQ.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={item.q} className="rounded-2xl border overflow-hidden"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
                  >
                    <span className="text-sm font-extrabold" style={{ color: 'var(--text-primary)' }}>{item.q}</span>
                    <span
                      className="text-xs font-black shrink-0 transition-transform duration-200"
                      style={{ color: 'var(--text-accent)', transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                    >
                      +
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------ CTA ------------------------------------------------ */}
      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <FadeIn>
            <div className="relative overflow-hidden rounded-3xl border p-10 sm:p-16 text-center"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-accent)', boxShadow: 'var(--shadow-lg)' }}>
              <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, #6366f1 0%, transparent 70%)' }} />
              <div className="relative space-y-7">
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight" style={{ color: 'var(--text-primary)' }}>
                  Ready to Build a Resume That Gets Noticed?
                </h2>
                <p className="text-base sm:text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                  Create your first resume free — no credit card required.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <CtaButton size="lg" onClick={goBuilder} icon={Zap}>
                    Start Building Free
                  </CtaButton>
                  <CtaButton size="lg" variant="outline" onClick={goRegister} icon={InfinityIcon}>
                    Compare Plans
                  </CtaButton>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}