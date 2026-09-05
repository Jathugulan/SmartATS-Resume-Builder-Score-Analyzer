import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ArrowRight, CheckCircle2, AlertTriangle, FileText, LayoutTemplate,
  Brain, Search, Eye, User, Briefcase, GraduationCap, Wrench, FolderGit2, Award,
  BarChart3, Wand2, ShieldCheck, Zap, Target, Clock, Gauge, ListChecks,
} from 'lucide-react';
import {
  FadeIn, SectionHeader, useCounter, ScoreRing, ProgressBar, useAppNav,
  ResumeMock, CtaButton, Badge,
} from '../components/landing/MarketingBits';
import { usePageMeta } from '../hooks/usePageMeta';

/* ═══════════════════════════════════════════════════════════════════
   HOME — Public marketing page
   ═══════════════════════════════════════════════════════════════════ */

/* ── Trust / statistics ─────────────────────────────────────────────
   NOTE: numeric `value` entries animate with a counter on scroll.
   These are placeholder metrics — replace with real product data. */
const STATS = [
  { value: 95, suffix: '%+', label: 'ATS Compatibility', icon: ShieldCheck, delay: 0 },
  { value: 10, suffix: '+', label: 'Professional Templates', icon: LayoutTemplate, delay: 0.1 },
  { value: null, text: 'Instant', suffix: '', label: 'Resume Analysis', icon: Zap, delay: 0.2 },
  { value: null, text: 'Minutes', suffix: '', label: 'To Build Your Resume', icon: Clock, delay: 0.3 },
];

/* ── Core features grid ──────────────────────────────────────────── */
const FEATURES = [
  {
    icon: FileText,
    title: 'Smart Resume Builder',
    desc: 'Create professional resumes with structured sections and real-time preview.',
    tone: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  },
  {
    icon: Gauge,
    title: 'ATS Score Analyzer',
    desc: 'Analyze your resume and understand how ATS systems may interpret it.',
    tone: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
  },
  {
    icon: Brain,
    title: 'AI Resume Optimization',
    desc: 'Improve weak content, bullet points, summaries, and professional wording.',
    tone: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  },
  {
    icon: Search,
    title: 'Keyword Matching',
    desc: 'Identify important keywords from your target job description.',
    tone: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    icon: LayoutTemplate,
    title: 'Professional Templates',
    desc: 'Choose clean, modern and ATS-friendly resume layouts.',
    tone: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  },
  {
    icon: Eye,
    title: 'Real-Time Preview',
    desc: 'See changes instantly while building your resume.',
    tone: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
  },
];

/* ── ATS intelligence workflow ───────────────────────────────────── */
const ATS_FLOW = ['Resume', 'ATS Scan', 'Score', 'Keyword Analysis', 'Recommendations', 'Improved Resume'];

const ATS_BREAKDOWN = [
  { label: 'Keyword Match', value: 88 },
  { label: 'Formatting', value: 94 },
  { label: 'Skills', value: 82 },
  { label: 'Experience', value: 90 },
  { label: 'Sections', value: 95 },
];

/* ── Builder preview sections ────────────────────────────────────── */
const BUILDER_SECTIONS = [
  { icon: User, name: 'Personal Information', hint: 'Name, contact, links' },
  { icon: FileText, name: 'Summary', hint: 'Your professional pitch' },
  { icon: Briefcase, name: 'Experience', hint: 'Roles, impact, metrics' },
  { icon: GraduationCap, name: 'Education', hint: 'Degrees & training' },
  { icon: Wrench, name: 'Skills', hint: 'Technical & soft skills' },
  { icon: FolderGit2, name: 'Projects', hint: 'Notable work samples' },
  { icon: Award, name: 'Certifications', hint: 'Credentials & badges' },
];

const PREVIEW_CONTENT = {
  'Personal Information': ['Alex Morgan', 'alex.morgan@email.com', 'Seattle, WA', 'linkedin.com/in/alexmorgan'],
  'Summary': ['Results-driven frontend engineer with 5+ years of experience building accessible web applications that scale to millions of requests.'],
  'Experience': ['Senior Frontend Engineer · Northwind Labs · 2021 – Present', 'Reduced page load time by 38% through code-splitting and caching.', 'Led migration from a legacy stack to React and TypeScript.'],
  'Education': ['B.S. Computer Science', 'University of Washington · 2018'],
  'Skills': ['React', 'TypeScript', 'Node.js', 'REST APIs', 'MongoDB'],
  'Projects': ['TaskFlow — Real-time collaboration app with 12k monthly users.'],
  'Certifications': ['AWS Certified Developer – Associate', 'Meta Front-End Developer Certificate'],
};

/* ── Job matcher data ────────────────────────────────────────────── */
const CANDIDATE_SKILLS = ['React', 'JavaScript', 'Node.js', 'REST APIs', 'MongoDB'];
const REQUIRED_SKILLS = ['React', 'TypeScript', 'REST APIs', 'Git', 'Node.js'];
const MATCHED = ['React', 'Node.js', 'REST APIs'];
const MISSING = ['TypeScript', 'Git'];

/* ═══════════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function Home() {
  usePageMeta({
    title: 'ATS Smart Resume Builder & Score Analyzer',
    description:
      'Create ATS-friendly resumes, analyze your resume score, match job descriptions, and optimize every section with intelligent resume tools.',
  });

  const { goBuilder, goAnalyze, goRegister } = useAppNav();

  /* ── SECTION 01: HERO ─────────────────────────────────────────── */
  return (
    <div className="w-full overflow-hidden">
      <section className="relative">
        <div className="absolute inset-0 hero-gradient pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 lg:pt-24 pb-16 sm:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Copy */}
            <div className="text-center lg:text-left space-y-7 max-w-xl lg:max-w-none mx-auto">
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-accent)', color: 'var(--text-accent)' }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered ATS Optimization
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]"
                style={{ color: 'var(--text-primary)' }}
              >
                Build a Resume That{' '}
                <span className="gradient-text">Gets Noticed</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.12 }}
                className="text-base sm:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0"
                style={{ color: 'var(--text-secondary)' }}
              >
                Create ATS-friendly resumes, analyze your resume score, match job
                descriptions, and optimize every section with intelligent resume tools.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3"
              >
                <CtaButton size="lg" onClick={goBuilder} icon={Zap}>
                  Build My Resume
                </CtaButton>
                <CtaButton size="lg" variant="outline" onClick={goAnalyze} icon={BarChart3}>
                  Analyze My Resume
                </CtaButton>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-xs font-semibold flex items-center justify-center lg:justify-start gap-2"
                style={{ color: 'var(--text-tertiary)' }}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Built for modern job seekers
              </motion.p>
            </div>

            {/* Hero visual — premium dashboard composition */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-lg mx-auto w-full"
            >
              <HeroDashboard />
            </motion.div>
          </div>
        </div>
      </section>
/* ── Templates preview ───────────────────────────────────────────── */
const TEMPLATE_PREVIEWS = [
  { name: 'Professional Classic', tone: 'blue', variant: 'classic', category: 'Professional' },
  { name: 'Modern Minimal', tone: 'indigo', variant: 'minimal', category: 'Modern' },
  { name: 'Executive', tone: 'slate', variant: 'executive', category: 'Executive' },
  { name: 'Developer', tone: 'emerald', variant: 'developer', category: 'Developer' },
];

{/* ── SECTION 02: TRUST / STATISTICS ───────────────────────── */}
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <FadeIn key={stat.label} delay={stat.delay}>
                  <div
                    className="group rounded-2xl p-6 border text-center space-y-3 transition-all duration-300 hover:-translate-y-1"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-base)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div className="mx-auto w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <StatValue stat={stat} />
                    <div className="text-xs sm:text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                      {stat.label}
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 03: CORE FEATURES ────────────────────────────── */}
      <section className="py-14 sm:py-24" style={{ backgroundColor: 'var(--bg-elevated)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <FadeIn>
            <SectionHeader
              label="Core Features"
              heading="Everything You Need to Build a Better Resume"
              sub="From creating your resume to optimizing it for a specific job, everything works together in one platform."
            />
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <FadeIn key={feature.title} delay={(i % 3) * 0.08}>
                  <div
                    className="group relative rounded-2xl p-6 sm:p-7 border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg h-full flex flex-col"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-base)',
                    }}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl"
                      style={{ background: 'radial-gradient(ellipse at 30% 0%, rgba(99,102,241,0.10), transparent 60%)' }} />
                    <div className={`relative w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${feature.tone}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="relative text-lg font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {feature.title}
                    </h3>
                    <p className="relative text-sm leading-relaxed flex-1" style={{ color: 'var(--text-secondary)' }}>
                      {feature.desc}
                    </p>
                    <Link
                      to="/features"
                      className="relative mt-4 inline-flex items-center gap-1.5 text-sm font-bold transition-colors"
                      style={{ color: 'var(--text-accent)' }}
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </FadeIn>
              );
            })}
          </div>

          <FadeIn className="text-center pt-2">
            <CtaButton to="/features" size="lg" icon={Sparkles}>
              Explore All Features
            </CtaButton>
          </FadeIn>
        </div>
      </section>
/* ── How-it-works preview ────────────────────────────────────────── */
const STEPS = ['Choose Template', 'Add Information', 'Analyze Resume', 'Optimize', 'Download & Apply'];
{/* ── SECTION 04: ATS INTELLIGENCE ───────────────────────────── */}
      <section className="py-14 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border p-6 sm:p-10 lg:p-12 relative overflow-hidden"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}>
            <div className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 80% 20%, #6366f1, transparent 60%)' }} />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              {/* Workflow */}
              <div className="space-y-7">
                <SectionHeader
                  center={false}
                  label="ATS Intelligence"
                  heading="Understand What ATS Sees"
                  sub="Recruiters and applicant tracking systems parse your resume in seconds. See how your document travels through the pipeline."
                />
                <FadeIn>
                  <ol className="space-y-1">
                    {ATS_FLOW.map((step, idx) => (
                      <li key={step}>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-7 h-7 rounded-full text-[11px] font-black flex items-center justify-center shrink-0 border"
                            style={{
                              backgroundColor: idx === ATS_FLOW.length - 1 ? 'var(--accent)' : 'var(--bg-elevated)',
                              borderColor: 'var(--border-accent)',
                              color: idx === ATS_FLOW.length - 1 ? '#fff' : 'var(--text-accent)',
                            }}
                          >
                            {idx + 1}
                          </div>
                          <div
                            className="px-4 py-2.5 rounded-xl text-sm font-bold border flex-1"
                            style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)', color: idx === ATS_FLOW.length - 1 ? 'var(--text-accent)' : 'var(--text-primary)' }}
                          >
                            {step}
                          </div>
                        </div>
                        {idx < ATS_FLOW.length - 1 && (
                          <div className="ml-3.5 h-4 w-px" style={{ backgroundColor: 'var(--border-base)' }} />
                        )}
                      </li>
                    ))}
                  </ol>
                </FadeIn>
              </div>

              {/* Sample ATS dashboard */}
              <FadeIn delay={0.1}>
                <div className="rounded-2xl border p-6 sm:p-8"
                  style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-base)', boxShadow: 'var(--shadow-lg)' }}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                      ATS Analysis Report
                    </div>
                    <Badge tone="emerald">Scan Complete</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 items-center sm:items-start">
                    <div className="flex justify-center">
                      <ScoreRing score={87} sub="ATS Score" />
                    </div>
                    <div className="space-y-4">
                      {ATS_BREAKDOWN.map((b) => (
                        <ProgressBar key={b.label} label={b.label} value={b.value} />
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
                    style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                      Your resume is well-positioned for most ATS systems.
{/* ── SECTION 06: JOB DESCRIPTION MATCHER ───────────────────── */}
      <section className="py-14 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <FadeIn>
            <SectionHeader
              label="Job Matching"
              heading="Tailor Your Resume to Every Job"
              sub="Compare your skills against a job description and close the gap before you apply."
            />
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
              <div className="rounded-2xl border p-6"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="text-sm font-extrabold" style={{ color: 'var(--text-primary)' }}>Your Resume</div>
                </div>
                <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>
                  Candidate skills
                </div>
                <div className="flex flex-wrap gap-2">
                  {CANDIDATE_SKILLS.map((s) => (
                    <span key={s} className="px-3 py-1.5 rounded-lg text-xs font-semibold border"
                      style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border p-6"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                    <Target className="w-4 h-4" />
                  </div>
                  <div className="text-sm font-extrabold" style={{ color: 'var(--text-primary)' }}>Job Description</div>
                </div>
                <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>
                  Required
                </div>
                <div className="flex flex-wrap gap-2">
                  {REQUIRED_SKILLS.map((s) => (
                    <span key={s} className="px-3 py-1.5 rounded-lg text-xs font-semibold border"
                      style={{ borderColor: 'var(--border-accent)', color: 'var(--text-accent)' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="rounded-2xl border p-6 sm:p-8 max-w-3xl mx-auto"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)', boxShadow: 'var(--shadow-md)' }}>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="shrink-0">
                  <ScoreRing score={82} size={128} suffix="%" sub="Job Match" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 flex-1 w-full">
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-success)' }}>
                      Matching
                    </div>
                    {MATCHED.map((s) => (
                      <div key={s} className="flex items-center gap-2 text-sm font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span style={{ color: 'var(--text-primary)' }}>{s}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-warning)' }}>
                      Missing
                    </div>
                    {MISSING.map((s) => (
                      <div key={s} className="flex items-center gap-2 text-sm font-semibold">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                        <span style={{ color: 'var(--text-primary)' }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t text-center" style={{ borderColor: 'var(--border-subtle)' }}>
                <CtaButton onClick={goAnalyze} icon={Target}>
                  Match My Resume
                </CtaButton>
              </div>
{/* ── SECTION 07: AI OPTIMIZATION BEFORE / AFTER ─────────────── */}
      <section className="py-14 sm:py-24" style={{ backgroundColor: 'var(--bg-elevated)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <FadeIn>
            <SectionHeader
              label="AI Optimization"
              heading="Turn Weak Resume Content Into Stronger Statements"
              sub="AI analyzes your bullet points and rewrites them with action verbs, measurable impact, and relevant keywords."
            />
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="rounded-2xl p-6 border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>
                  Before
                </div>
                <p className="text-base font-medium line-through" style={{ color: 'var(--text-tertiary)' }}>
                  Worked on web applications.
                </p>
              </div>

              <div className="flex items-center justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-accent)', color: 'var(--text-accent)' }}>
                  <Wand2 className="w-3.5 h-3.5" />
                  AI Optimization Applied
                </div>
              </div>

              <div className="rounded-2xl p-6 border-2"
                style={{ borderColor: 'var(--border-accent)', backgroundColor: 'var(--bg-card)' }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-accent)' }}>
                  After
                </div>
                <p className="text-base font-semibold leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  <span className="bg-blue-500/15 text-blue-600 dark:text-blue-400 px-1 rounded font-bold">Developed</span>{' '}
                  responsive web applications using{' '}
                  <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-1 rounded font-bold">React.js</span>{' '}
                  and{' '}
                  <span className="bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 px-1 rounded font-bold">RESTful APIs</span>, improving{' '}
                  <span className="bg-amber-500/15 text-amber-600 dark:text-amber-400 px-1 rounded font-bold">application performance</span>{' '}
                  and{' '}
                  <span className="bg-purple-500/15 text-purple-600 dark:text-purple-400 px-1 rounded font-bold">user experience</span>.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-500 dark:text-blue-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-500/40" /> Action Verbs
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-500 dark:text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/40" /> Technical Skills
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-500 dark:text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/40" /> Measurable Impact
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-indigo-500 dark:text-indigo-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500/40" /> Relevant Keywords
                </span>
              </div>

              <div className="text-center pt-4">
                <CtaButton onClick={goBuilder} icon={Wand2}>
                  Optimize My Resume
                </CtaButton>
{/* ── SECTION 08: TEMPLATES PREVIEW ──────────────────────────── */}
      <section className="py-14 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <FadeIn>
            <SectionHeader
              label="Templates"
              heading="Choose a Resume Design That Fits Your Career"
              sub="Clean, modern and ATS-friendly layouts — every template parses cleanly into applicant tracking systems."
            />
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {TEMPLATE_PREVIEWS.map((tpl, i) => (
              <FadeIn key={tpl.name} delay={i * 0.08}>
                <div className="group rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}>
                  <div className="relative overflow-hidden rounded-xl mb-4 group-hover:scale-[1.02] transition-transform duration-500">
                    <ResumeMock variant={tpl.variant} tone={tpl.tone} />
                  </div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div>
                      <div className="text-sm font-extrabold" style={{ color: 'var(--text-primary)' }}>{tpl.name}</div>
                      <div className="text-[11px] font-semibold mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{tpl.category}</div>
                    </div>
                    <Badge tone="emerald">
                      <ShieldCheck className="w-3 h-3" /> ATS Friendly
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <CtaButton to="/templates" variant="outline" size="sm" className="flex-1">
                      Preview
                    </CtaButton>
                    <CtaButton size="sm" className="flex-1" onClick={goRegister}>
                      Use Template
                    </CtaButton>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="text-center pt-4">
            <CtaButton to="/templates" size="lg" variant="outline" icon={LayoutTemplate}>
              View All Templates
            </CtaButton>
          </FadeIn>
{/* ── SECTION 09: HOW IT WORKS PREVIEW ───────────────────────── */}
      <section className="py-14 sm:py-24" style={{ backgroundColor: 'var(--bg-elevated)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <FadeIn>
            <SectionHeader
              label="How It Works"
              heading="From Zero to Job-Ready in Five Steps"
              sub="A simple, guided workflow that keeps you moving from blank page to final application."
            />
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 md:gap-3 relative">
              {STEPS.map((step, i) => (
                <div key={step} className="relative flex md:flex-col items-center md:text-center gap-3 md:gap-0">
                  <div
                    className="w-12 h-12 rounded-2xl font-black flex items-center justify-center border shadow-sm md:mb-3 text-base shrink-0"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-accent)',
                      color: 'var(--text-accent)',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="text-xs sm:text-sm font-bold px-1" style={{ color: 'var(--text-primary)' }}>
                    {step}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-[calc(50%+1.6rem)] w-[calc(100%-3.2rem)] h-px"
                      style={{ backgroundColor: 'var(--border-base)' }}>
                      <ArrowRight className="absolute -top-[7px] right-0 w-3.5 h-3.5" style={{ color: 'var(--text-accent)' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn className="text-center">
            <CtaButton to="/how-it-works" size="lg" icon={ListChecks}>
              See How It Works
            </CtaButton>
          </FadeIn>
        </div>
      </section>

      {/* ── SECTION 10: FINAL CTA ───────────────────────────────── */}
      <section className="py-16 sm:py-28">
        <div className="max-w-5xl mx-auto px-4">
          <FadeIn>
            <div className="relative overflow-hidden rounded-3xl border p-10 sm:p-16 text-center"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-accent)', boxShadow: 'var(--shadow-lg)' }}>
              <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, #6366f1 0%, transparent 70%)' }} />
              <div className="relative space-y-7">
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight" style={{ color: 'var(--text-primary)' }}>
                  Ready to Build a Resume That Stands Out?
                </h2>
                <p className="text-base sm:text-lg leading-relaxed max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                  Create, analyze, optimize, and download your resume with powerful ATS-focused tools.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <CtaButton size="lg" onClick={goRegister} icon={Zap}>
                    Start Building Free
                  </CtaButton>
                  <CtaButton to="/templates" size="lg" variant="outline" icon={LayoutTemplate}>
                    Explore Templates
                  </CtaButton>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
/* ═══════════════════════════════════════════════════════════════════
   SUPPORTING COMPONENTS
   ═══════════════════════════════════════════════════════════════════ */

/* ── Statistic value with animated counter when numeric ──────────── */
function StatValue({ stat }) {
  const { ref, count } = useCounter(stat.value ?? 0);

  if (stat.value === null) {
    return (
      <div
        className="text-3xl sm:text-4xl font-black tracking-tight"
        style={{ color: 'var(--text-primary)' }}
      >
        {stat.text}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="text-3xl sm:text-4xl font-black tracking-tight tabular-nums"
      style={{ color: 'var(--text-primary)' }}
    >
      {count}
      {stat.suffix}
    </div>
  );
}

/* ── Hero dashboard composition ──────────────────────────────────── */
function HeroDashboard() {
  return (
    <div className="relative w-full animate-float">
      {/* Main analysis card */}
      <div
        className="rounded-2xl border p-5 sm:p-6"
        style={{
          backgroundColor: 'rgba(15, 18, 26, 0.9)',
          borderColor: 'var(--border-base)',
          boxShadow: 'var(--shadow-lg)',
          backdropFilter: 'blur(14px)',
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="text-[11px] font-bold" style={{ color: 'var(--text-tertiary)' }}>
            ATS Resume Analysis
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-4 items-start">
          <ResumeMock variant="modern" tone="indigo" className="!aspect-auto" />

          <div className="space-y-3">
            <div className="flex justify-center">
              <ScoreRing score={87} size={104} />
            </div>
            <div className="rounded-xl border p-3 space-y-2.5" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'var(--border-subtle)' }}>
              {[
                { label: 'Job Match', value: '82%', color: 'text-emerald-400' },
                { label: 'Keywords', value: '24/30', color: 'text-blue-300' },
                { label: 'Formatting', value: 'Excellent', color: 'text-amber-300' },
              ].map((m) => (
                <div key={m.label} className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-semibold text-slate-400">{m.label}</span>
                  <span className={`font-black ${m.color}`}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating chip: AI recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="absolute -top-5 -left-3 sm:-left-6 rounded-xl border px-3.5 py-2.5 shadow-xl flex items-center gap-2"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-accent)' }}
      >
        <Sparkles className="w-4 h-4 text-indigo-400" />
        <div className="text-[11px] leading-tight">
          <div className="font-bold" style={{ color: 'var(--text-primary)' }}>AI Recommendations</div>
          <div className="text-[10px] font-semibold" style={{ color: 'var(--text-tertiary)' }}>3 suggestions ready</div>
        </div>
      </motion.div>

      {/* Floating chip: skills */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.5 }}
        className="absolute -bottom-5 -right-2 sm:-right-5 rounded-xl border px-3.5 py-2.5 shadow-xl flex items-center gap-2"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}
      >
        <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
          <Brain className="w-3.5 h-3.5" />
        </div>
/* ── Interactive split builder preview ───────────────────────────── */
function BuilderShowcase({ goBuilder }) {
  const [active, setActive] = useState('Personal Information');
  const current = PREVIEW_CONTENT[active] || [];

  return (
    <FadeIn delay={0.1}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        {/* Editor controls */}
        <div className="rounded-2xl border p-5 sm:p-6"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}>
          <div className="flex items-center justify-between mb-5">
            <div className="text-sm font-extrabold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Wrench className="w-4 h-4 text-indigo-400" /> Resume Editor
            </div>
            <Badge tone="indigo">
              <ListChecks className="w-3 h-3" /> Edit → Preview → Improve
            </Badge>
          </div>

          <div className="space-y-2" role="tablist" aria-label="Resume sections">
            {BUILDER_SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = active === section.name;
              return (
                <button
                  key={section.name}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(section.name)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200 cursor-pointer"
                  style={{
                    backgroundColor: isActive ? 'var(--accent-muted)' : 'var(--bg-elevated)',
                    borderColor: isActive ? 'var(--border-accent)' : 'var(--border-subtle)',
                  }}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-indigo-500 text-white' : 'bg-indigo-500/10 text-indigo-500'}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{section.name}</span>
                    <span className="block text-[11px] font-medium" style={{ color: 'var(--text-tertiary)' }}>{section.hint}</span>
                  </span>
                  <ArrowRight className={`w-4 h-4 transition-all ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1'}`} style={{ color: 'var(--text-accent)' }} />
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            <CtaButton className="w-full" onClick={goBuilder} icon={ArrowRight}>
              Start Building
            </CtaButton>
          </div>
        </div>

        {/* Live preview */}
        <div className="rounded-2xl border p-5 sm:p-6 flex flex-col"
          style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-base)', boxShadow: 'var(--shadow-md)' }}>
          <div className="flex items-center justify-between mb-5">
            <div className="text-sm font-extrabold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Eye className="w-4 h-4 text-indigo-400" /> Live Resume Preview
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-success)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
            </div>
          </div>

          <div className="flex-1 rounded-xl bg-white p-6 min-h-[340px]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-lg font-black text-slate-900">Alex Morgan</div>
                <div className="text-[11px] font-semibold text-slate-500">Frontend Engineer</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-black">
                AM
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-3">
                  {active}
                </div>
                <ul className="space-y-2">
                  {current.map((line, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                      <span className="text-xs font-medium text-slate-700 leading-relaxed">{line}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
        <div className="text-[11px] leading-tight">
          <div className="font-bold" style={{ color: 'var(--text-primary)' }}>Skills Analysis</div>
          <div className="text-[10px] font-semibold" style={{ color: 'var(--text-tertiary)' }}>8 matched · 2 missing</div>
        </div>
      </motion.div>
    </div>
  );
}
    </div>
  );
}
        </div>
      </section>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
            </div>
          </FadeIn>
        </div>
      </section>
                    </div>
                    <CtaButton size="sm" onClick={goAnalyze}>
                      Check My ATS Score
                    </CtaButton>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 05: RESUME BUILDER PREVIEW (interactive) ───── */}
      <section id="builder-preview" className="py-14 sm:py-24" style={{ backgroundColor: 'var(--bg-elevated)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <FadeIn>
            <SectionHeader
              label="Smart Resume Builder"
              heading="Build Your Resume"
              sub="Choose a section in the editor and watch the live resume preview update instantly — no refresh required."
            />
          </FadeIn>

          <BuilderShowcase goBuilder={goBuilder} />
        </div>
      </section>