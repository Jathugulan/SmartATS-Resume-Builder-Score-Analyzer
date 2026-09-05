import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, FileText, BarChart3, Search, Download, CheckCircle2,
  AlertTriangle, Layers, Printer, ArrowRight, ShieldCheck,
  Check, Brain, Eye, Save, Copy, Edit3, RefreshCw, Target, Zap,
  Gauge, KeyRound, Wand2, ListChecks, GripVertical, MonitorCheck,
  User, Briefcase, GraduationCap, Wrench, FolderGit2, Award,
  Languages, Plus, Lightbulb, Star, TrendingUp,
} from 'lucide-react';
import {
  FadeIn, SectionHeader, ScoreRing, ProgressBar, useAppNav, ResumeMock, CtaButton, Badge,
} from '../components/landing/MarketingBits';
import { usePageMeta } from '../hooks/usePageMeta';

/* ═══════════════════════════════════════════════════════════════════
   FEATURES — Public marketing page
   ═══════════════════════════════════════════════════════════════════ */

const BUILDER_SECTIONS = [
  { icon: User, name: 'Personal Information' },
  { icon: FileText, name: 'Professional Summary' },
  { icon: Briefcase, name: 'Work Experience' },
  { icon: GraduationCap, name: 'Education' },
  { icon: Wrench, name: 'Skills' },
  { icon: FolderGit2, name: 'Projects' },
  { icon: Award, name: 'Certifications' },
  { icon: Languages, name: 'Languages' },
  { icon: Plus, name: 'Custom Sections' },
];

const ANALYSIS_CATEGORIES = [
  { label: 'ATS Compatibility', value: 87, color: '#6366f1' },
  { label: 'Keywords', value: 82, color: '#3b82f6' },
  { label: 'Skills', value: 85, color: '#8b5cf6' },
  { label: 'Experience', value: 90, color: '#10b981' },
  { label: 'Education', value: 92, color: '#f59e0b' },
  { label: 'Formatting', value: 94, color: '#ec4899' },
  { label: 'Section Completeness', value: 88, color: '#06b6d4' },
  { label: 'Readability', value: 79, color: '#f97316' },
];

const IMPROVE_TIPS = [
  'Add more keywords from the target job description',
  'Strengthen bullets with measurable results and numbers',
  'Move the most relevant skills closer to the top',
  'Replace vague phrasing with specific action verbs',
];

const AI_IMPROVEMENTS = [
  { icon: Wand2, title: 'Rewrite Weak Bullet Points', desc: 'Turn passive, generic statements into confident, results-driven lines.' },
  { icon: FileText, title: 'Improve Professional Summary', desc: 'Craft a concise summary that captures your value proposition.' },
  { icon: Zap, title: 'Suggest Action Verbs', desc: 'Replace weak openers with strong, recruiter-recognized verbs.' },
  { icon: Lightbulb, title: 'Improve Clarity', desc: 'Make every sentence easier to skim in the first few seconds.' },
  { icon: RefreshCw, title: 'Remove Unnecessary Wording', desc: 'Cut filler phrases that waste valuable resume space.' },
  { icon: TrendingUp, title: 'Improve Impact', desc: 'Emphasize outcomes, scale, and deliverables over duties.' },
  { icon: ShieldCheck, title: 'Improve Professional Tone', desc: 'Keep a consistent, polished tone across every section.' },
  { icon: Star, title: 'Highlight Measurable Achievements', desc: 'Surface quantifiable wins recruiters look for first.' },
];

const JD_MATCH = {
  match: 82,
  matched: ['React', 'Node.js', 'REST APIs'],
  missing: ['TypeScript', 'Git'],
  required: ['React', 'TypeScript', 'REST APIs', 'Git', 'Node.js'],
  recommended: ['Redux', 'Next.js', 'GraphQL', 'AWS'],
  experience: 'Strong — 4+ years building production web applications.',
};

const KEYWORD_ANALYSIS = [
  { label: 'Technical Keywords', items: ['React.js', 'TypeScript', 'Node.js', 'REST APIs', 'MongoDB', 'AWS'] },
  { label: 'Industry Keywords', items: ['Agile', 'SaaS', 'CI/CD', 'Cross-functional', 'Code review'] },
  { label: 'Job-Specific Terms', items: ['Frontend architecture', 'Performance tuning', 'Design systems'] },
  { label: 'Missing Keywords', items: ['GraphQL', 'Next.js', 'Kubernetes'] },
  { label: 'Overused Keywords', items: ['Experience', 'Responsible'] },
];

const TEMPLATE_CHECKLIST = [
  'Clean layouts',
  'Professional typography',
  'ATS-safe structure',
  'Standard sections',
  'Customizable formatting',
  'Multiple professional styles',
];

/* ═══════════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function Features() {
  usePageMeta({
    title: 'Resume Builder & ATS Analyzer Features',
    description:
      'Explore powerful ATS resume tools: smart resume builder, ATS score analyzer, AI optimization, keyword matching, and real-time preview.',
  });

  const { goBuilder, goAnalyze } = useAppNav();

  return (
    <div className="w-full overflow-hidden">
      {/* ── SECTION 01: HERO ─────────────────────────────────────── */}
      <section className="relative">
        <div className="absolute inset-0 hero-gradient pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-accent)', color: 'var(--text-accent)' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Every Tool. One Workflow.
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] max-w-3xl mx-auto"
            style={{ color: 'var(--text-primary)' }}
          >
            Everything You Need to Build an{' '}
            <span className="gradient-text">ATS-Ready Resume</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            Powerful tools designed to help you create, analyze, optimize, and customize your resume.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
          >
            <CtaButton size="lg" onClick={goBuilder} icon={Zap}>
              Start Building
            </CtaButton>
            <CtaButton size="lg" variant="outline" onClick={goAnalyze} icon={BarChart3}>
              Analyze a Resume
            </CtaButton>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 02: SMART RESUME BUILDER ────────────────────── */}
      <section className="py-14 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <FadeIn>
            <SectionHeader
              label="Smart Resume Builder"
              heading="A Structured Editor That Keeps You Organized"
              sub="Every section of a professional resume, arranged and reorderable — with a live preview that updates as you type."
            />
          </FadeIn>
{/* ── SECTION 03: ATS SCORE ANALYZER ──────────────────────── */}
      <section className="py-14 sm:py-24" style={{ backgroundColor: 'var(--bg-elevated)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <FadeIn>
            <SectionHeader
              label="ATS Score Analyzer"
              heading="See How ATS Systems Read Your Resume"
              sub="An instant diagnostic across eight categories reveals parsing risks and keyword gaps."
            />
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl border p-6 sm:p-8"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)', boxShadow: 'var(--shadow-md)' }}>
                <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 items-center mb-6">
                  <div className="flex justify-center">
                    <ScoreRing score={87} sub="Overall Score" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-extrabold" style={{ color: 'var(--text-primary)' }}>Strong standing</div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      Your resume clears most major applicant tracking systems, with room to improve keyword coverage.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {ANALYSIS_CATEGORIES.map((c) => (
                    <ProgressBar key={c.label} label={c.label} value={c.value} color={c.color} />
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border p-6 sm:p-8 flex flex-col"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-accent)' }}>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div className="text-base font-extrabold" style={{ color: 'var(--text-primary)' }}>Improve Your Score</div>
                </div>
                <ul className="space-y-3.5 flex-1">
                  {IMPROVE_TIPS.map((tip, i) => (
                    <li key={tip} className="flex items-start gap-3">
                      <span className="mt-0.5 w-6 h-6 rounded-lg text-[11px] font-black flex items-center justify-center shrink-0 border"
                        style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)', color: 'var(--text-accent)' }}>
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium leading-relaxed" style={{ color: 'var(--text-primary)' }}>{tip}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <CtaButton className="w-full" onClick={goAnalyze} icon={TrendingUp}>
                    Run Full Analysis
                  </CtaButton>
                </div>
              </div>
            </div>
          </FadeIn>
{/* ── SECTION 04: AI RESUME OPTIMIZATION ───────────────────── */}
      <section className="py-14 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <FadeIn>
            <SectionHeader
              label="AI Resume Optimization"
              heading="Turn Average Bullets Into ATS Magnets"
              sub="Intelligent suggestions that rewrite weak content, strengthen tone, and surface measurable achievements."
            />
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {AI_IMPROVEMENTS.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={f.title}
                    className="group rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}>
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-extrabold mb-1.5" style={{ color: 'var(--text-primary)' }}>{f.title}</div>
                    <div className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</div>
                  </div>
                );
              })}
            </div>
          </FadeIn>

          <AiBeforeAfter goBuilder={goBuilder} />
{/* ── SECTION 05: JOB DESCRIPTION MATCHER ──────────────────── */}
      <section className="py-14 sm:py-24" style={{ backgroundColor: 'var(--bg-elevated)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <FadeIn>
            <SectionHeader
              label="Job Description Matcher"
              heading="Match Your Resume to the Job"
              sub="Paste a job description and instantly see every skill you hit — and every keyword you are missing."
            />
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-2xl border p-6 sm:p-10"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)', boxShadow: 'var(--shadow-md)' }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-extrabold" style={{ color: 'var(--text-primary)' }}>Resume</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'JavaScript', 'Node.js', 'REST APIs', 'MongoDB'].map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-lg text-xs font-bold border"
                        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)', color: 'var(--text-primary)' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                      <Target className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-extrabold" style={{ color: 'var(--text-primary)' }}>Job Description</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {JD_MATCH.required.map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-lg text-xs font-bold border"
                        style={{ borderColor: 'var(--border-accent)', color: 'var(--text-accent)' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 items-center">
                <div className="flex flex-col items-center gap-3">
                  <ScoreRing score={JD_MATCH.match} size={140} suffix="%" sub="Match" />
                  <Badge tone="emerald">
                    <CheckCircle2 className="w-3 h-3" /> Good alignment
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2.5">
                    <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-success)' }}>
                      Matching Keywords
                    </div>
                    {JD_MATCH.matched.map((s) => (
                      <div key={s} className="flex items-center gap-2 text-sm font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span style={{ color: 'var(--text-primary)' }}>{s}</span>
                      </div>
                    ))}
                    <div className="text-xs font-bold uppercase tracking-wider pt-3" style={{ color: 'var(--text-warning)' }}>
                      Missing Keywords
                    </div>
                    {JD_MATCH.missing.map((s) => (
                      <div key={s} className="flex items-center gap-2 text-sm font-semibold">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <span style={{ color: 'var(--text-primary)' }}>{s}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2.5">
                    <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                      Recommended Skills
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {JD_MATCH.recommended.map((s) => (
                        <span key={s} className="px-2.5 py-1 rounded-lg text-xs font-bold border"
                          style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider pt-1" style={{ color: 'var(--text-secondary)' }}>
                      Experience Relevance
                    </div>
                    <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                      {JD_MATCH.experience}
                    </p>
                  </div>
                </div>
              </div>
{/* ── SECTION 06: KEYWORD INTELLIGENCE ─────────────────────── */}
      <section className="py-14 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <FadeIn>
            <SectionHeader
              label="Keyword Intelligence"
              heading="Know Exactly Which Keywords to Add"
              sub="Understand how often skills appear in your resume and which terms to emphasize for your target roles."
            />
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Keyword cloud */}
              <div className="rounded-2xl border p-6 sm:p-8"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div className="text-base font-extrabold" style={{ color: 'var(--text-primary)' }}>Skill Frequency</div>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 py-4 min-h-[180px]">
                  {[
                    { word: 'React.js', cls: 'text-2xl font-black text-indigo-500' },
                    { word: 'TypeScript', cls: 'text-lg font-extrabold text-blue-500' },
                    { word: 'Node.js', cls: 'text-2xl font-black text-emerald-500' },
                    { word: 'REST APIs', cls: 'text-xl font-extrabold text-purple-500' },
                    { word: 'MongoDB', cls: 'text-base font-bold text-cyan-500' },
                    { word: 'Git', cls: 'text-sm font-semibold text-rose-500' },
                    { word: 'AWS', cls: 'text-base font-bold text-amber-500' },
                    { word: 'Docker', cls: 'text-sm font-semibold text-teal-500' },
                    { word: 'CI/CD', cls: 'text-base font-bold text-pink-500' },
                    { word: 'Testing', cls: 'text-xs font-medium text-slate-500' },
                  ].map((k) => (
                    <span key={k.word} className={k.cls + ' hover:scale-110 transition-transform cursor-default'}>{k.word}</span>
                  ))}
                </div>
                <div className="pt-4 border-t text-[11px] font-semibold" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-tertiary)' }}>
                  Font size reflects how often each term appears in your resume.
                </div>
              </div>

              {/* Structured keyword analysis */}
              <div className="space-y-4">
                {KEYWORD_ANALYSIS.map((group, i) => (
                  <FadeIn key={group.label} delay={i * 0.06}>
                    <div className="rounded-2xl border p-5"
                      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-accent)' }}>
                          {group.label}
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                          style={{ color: 'var(--text-tertiary)', borderColor: 'var(--border-subtle)' }}>
                          {group.items.length}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map((item) => (
                          <span key={item} className="px-2.5 py-1 rounded-lg text-xs font-semibold border"
                            style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── SECTION 07: ATS-FRIENDLY TEMPLATES ─────────────────── */}
      <section className="py-14 sm:py-24" style={{ backgroundColor: 'var(--bg-elevated)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <FadeIn>
            <SectionHeader
              label="ATS-Friendly Templates"
              heading="Designs That Parse Cleanly, Every Time"
              sub="Built on standard section names and single-column structures that applicant tracking systems read without issues."
            />
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEMPLATE_CHECKLIST.map((item, i) => (
              <FadeIn key={item} delay={(i % 3) * 0.08}>
                <div className="flex items-center gap-3 rounded-2xl border p-5"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}>
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-sm font-extrabold" style={{ color: 'var(--text-primary)' }}>{item}</div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="text-center pt-2 flex justify-center">
            <CtaButton to="/templates" size="lg" variant="outline" icon={ShieldCheck}>
{/* ── SECTION 08: REAL-TIME RESUME PREVIEW ──────────────────── */}
      <section className="py-14 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <FadeIn>
            <SectionHeader
              label="Real-Time Preview"
              heading="Edit on the Left. See the Result on the Right."
              sub="Every keystroke updates the live resume instantly."
            />
          </FadeIn>

          <RealTimePreview />
        </div>
      </section>

      {/* ── SECTION 09: RESUME MANAGEMENT ───────────────────────── */}
      <section className="py-14 sm:py-24" style={{ backgroundColor: 'var(--bg-elevated)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <FadeIn>
            <SectionHeader
              label="Resume Management"
              heading="Manage Every Version of Your Resume"
              sub="Keep role-specific versions organized and export them whenever you need."
            />
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {MGMT_FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <FadeIn key={f.label} delay={(i % 4) * 0.07}>
                  <div className="group rounded-2xl border p-5 flex items-start gap-3 transition-all duration-300 hover:-translate-y-1"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}>
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-sm font-bold py-1" style={{ color: 'var(--text-primary)' }}>{f.label}</div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 10: FEATURE CTA ─────────────────────────────── */}
      <section className="py-16 sm:py-28">
        <div className="max-w-5xl mx-auto px-4">
          <FadeIn>
            <div className="relative overflow-hidden rounded-3xl border p-10 sm:p-16 text-center"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-accent)', boxShadow: 'var(--shadow-lg)' }}>
              <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, #6366f1 0%, transparent 70%)' }} />
              <div className="relative space-y-7">
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight" style={{ color: 'var(--text-primary)' }}>
                  Build Smarter. Optimize Better. Apply With Confidence.
                </h2>
                <p className="text-base sm:text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                  Start building your ATS-optimized resume today — free.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <CtaButton size="lg" onClick={goBuilder} icon={Zap}>
                    Start Building Your Resume
                  </CtaButton>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
/* ═══════════════════════════════════════════════════════════════════
   SUPPORTING COMPONENTS
   ═══════════════════════════════════════════════════════════════════ */

/* ── Interactive structured editor mockup ────────────────────────── */
function BuilderEditorShowcase({ goBuilder }) {
  const [active, setActive] = useState('Professional Summary');

  const sectionFieldMap = {
    'Personal Information': ['Full Name', 'Email', 'Phone', 'Location'],
    'Professional Summary': ['Headline', 'Summary', 'Keywords'],
    'Work Experience': ['Job Title', 'Company', 'Dates', 'Achievements'],
    'Education': ['Degree', 'Institution', 'Years'],
    'Skills': ['Technical Skills', 'Soft Skills', 'Tools'],
    'Projects': ['Project Name', 'URL', 'Description'],
    'Certifications': ['Certification', 'Issuer', 'Year'],
    'Languages': ['Language', 'Proficiency'],
    'Custom Sections': ['Section Title', 'Content'],
  };

  return (
    <FadeIn delay={0.1}>
      <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-6 items-stretch">
        {/* Section list */}
        <div className="rounded-2xl border p-5 sm:p-6"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}>
          <div className="flex items-center justify-between mb-5">
            <div className="text-sm font-extrabold" style={{ color: 'var(--text-primary)' }}>
              Structured Sections
            </div>
            <Badge tone="indigo">
              <GripVertical className="w-3 h-3" /> Drag to reorder
            </Badge>
          </div>
          <div className="space-y-1.5">
            {BUILDER_SECTIONS.map((s, i) => {
              const Icon = s.icon;
              const isActive = active === s.name;
              return (
                <button
                  key={s.name}
                  onClick={() => setActive(s.name)}
                  aria-pressed={isActive}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all cursor-pointer"
                  style={{
                    backgroundColor: isActive ? 'var(--accent-muted)' : 'var(--bg-elevated)',
                    borderColor: isActive ? 'var(--border-accent)' : 'var(--border-subtle)',
                  }}
                >
                  <GripVertical className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--text-tertiary)' }} />
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-indigo-500 text-white' : 'bg-indigo-500/10 text-indigo-500'}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <span className="flex-1 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{s.name}</span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded" style={{ color: 'var(--text-tertiary)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Editor form + mini preview */}
        <div className="rounded-2xl border p-5 sm:p-6 flex flex-col"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}>
          <div className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-secondary)' }}>
            Editing — {active}
          </div>
          <div className="space-y-3 mb-6">
            {(sectionFieldMap[active] || []).map((field) => (
              <label key={field} className="block">
                <span className="block text-[11px] font-bold mb-1.5" style={{ color: 'var(--text-tertiary)' }}>{field}</span>
                <div className="h-10 rounded-lg px-3 flex items-center text-xs font-medium cursor-not-allowed"
                  style={{ backgroundColor: 'var(--bg-input)', border: '1.5px solid var(--border-input)', color: 'var(--text-disabled)' }}>
                  Sample {field.toLowerCase()}
                </div>
              </label>
            ))}
          </div>

          <div className="pt-5 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                Real-time preview
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider justify-end" style={{ color: 'var(--text-success)' }}>
                <MonitorCheck className="w-3.5 h-3.5" /> Updates as you type
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ResumeMock variant="modern" tone="indigo" />
              <div className="hidden sm:block" />
            </div>
          </div>

          <div className="mt-6">
            <CtaButton className="w-full" onClick={goBuilder} icon={ArrowRight}>
              Start Building
            </CtaButton>
/* ── AI Before / After toggle ────────────────────────────────────── */
const BEFORE_BULLETS = [
  'Worked on web applications.',
  'Helped with the frontend.',
  'Responsible for some features.',
];

const AFTER_BULLETS = [
  'Developed responsive web applications using React.js and RESTful APIs, improving performance and UX.',
  'Implemented reusable component library adopted by 3 product teams, cutting build time by 20%.',
  'Spearheaded accessibility improvements that raised Lighthouse scores from 68 to 96.',
];

function AiBeforeAfter({ goBuilder }) {
  const [view, setView] = useState('after');

  const Bullet = ({ text, tone }) => (
    <li className="flex items-start gap-2.5">
      <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${tone}`} />
      <span className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>{text}</span>
    </li>
  );

  return (
    <FadeIn delay={0.1}>
      <div className="max-w-3xl mx-auto">
        <div className="inline-flex p-1 border rounded-full mb-6 w-full"
          style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-base)' }}
          role="tablist" aria-label="AI optimization view">
          {['before', 'after'].map((v) => (
            <button
              key={v}
              role="tab"
              aria-selected={view === v}
              onClick={() => setView(v)}
              className="flex-1 py-2.5 px-4 rounded-full text-sm font-bold transition-all cursor-pointer"
              style={{
                backgroundColor: view === v ? 'var(--accent)' : 'transparent',
                color: view === v ? '#fff' : 'var(--text-secondary)',
              }}
            >
              {v === 'before' ? 'Before' : 'After AI'}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border p-6 sm:p-8"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: view === 'after' ? 'var(--border-accent)' : 'var(--border-base)',
            boxShadow: 'var(--shadow-md)',
          }}>
          <div className="flex items-center justify-between mb-5">
            <div className="text-sm font-extrabold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              {view === 'after' ? <Wand2 className="w-4 h-4 text-purple-400" /> : <ListChecks className="w-4 h-4 text-slate-400" />}
              {view === 'after' ? 'AI-Enhanced Bullet Points' : 'Original Bullet Points'}
            </div>
            {view === 'after' && (
              <Badge tone="emerald">
                <Check className="w-3 h-3" /> Stronger impact
              </Badge>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.ul
              key={view}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-3.5"
            >
              {(view === 'after' ? AFTER_BULLETS : BEFORE_BULLETS).map((b, i) => (
                <Bullet key={i} text={b} tone={view === 'after' ? 'bg-emerald-500' : 'bg-slate-400'} />
              ))}
            </motion.ul>
          </AnimatePresence>

          <div className="mt-7 pt-5 border-t text-center" style={{ borderColor: 'var(--border-subtle)' }}>
            <CtaButton onClick={goBuilder} icon={Wand2}>
              Optimize My Resume
/* ── Real-time preview (typed input updates the mock resume) ─────── */
function RealTimePreview() {
  const [summary, setSummary] = useState('Results-driven frontend engineer with 5+ years shipping accessible web apps.');

  return (
    <FadeIn delay={0.1}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Editor */}
        <div className="rounded-2xl border p-6 flex flex-col"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}>
          <div className="flex items-center justify-between mb-5">
            <div className="text-sm font-extrabold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Edit3 className="w-4 h-4 text-indigo-400" /> Editor
            </div>
            <Badge tone="emerald">
              <Zap className="w-3 h-3" /> No refresh required
            </Badge>
          </div>

          <label className="block">
            <span className="block text-[11px] font-bold mb-1.5" style={{ color: 'var(--text-tertiary)' }}>Professional Summary</span>
            <textarea
              rows={4}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Write your professional summary…"
              className="w-full resize-none text-sm font-medium p-3.5 outline-none"
              style={{ backgroundColor: 'var(--bg-input)', border: '1.5px solid var(--border-input)', borderRadius: '0.75rem', color: 'var(--text-primary)' }}
            />
          </label>

          <label className="block mt-4">
            <span className="block text-[11px] font-bold mb-1.5" style={{ color: 'var(--text-tertiary)' }}>Job Title</span>
            <input
              type="text"
              defaultValue="Frontend Engineer"
              className="w-full h-11 rounded-xl px-3.5 text-sm font-medium outline-none"
              style={{ backgroundColor: 'var(--bg-input)', border: '1.5px solid var(--border-input)', color: 'var(--text-primary)' }}
            />
          </label>

          <div className="mt-6 pt-5 border-t text-[11px] font-bold flex items-center gap-2"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-tertiary)' }}>
            <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />
            Changes sync to the preview instantly — try typing above.
          </div>
        </div>

        {/* Live resume */}
        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-5 border-b border-slate-200 pb-4">
            <div>
              <div className="text-xl font-black text-slate-900">Alex Morgan</div>
              <div className="text-xs font-semibold text-slate-500">alex.morgan@email.com · Seattle, WA</div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
            </div>
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2">Professional Summary</div>
          <p className="text-sm font-medium text-slate-700 leading-relaxed mb-6">{summary || 'Your summary will appear here as you type…'}</p>
          <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-3">Experience</div>
          <div className="space-y-2">
            {['Built and scaled React applications serving 1M+ monthly users.', 'Introduced performance budgets, cutting load times by 38%.'].map((b) => (
              <div key={b} className="flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                <span className="text-xs font-medium text-slate-600">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
            </CtaButton>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
      </section>
    </div>
  );
}
              Explore Templates
            </CtaButton>
          </FadeIn>
        </div>
      </section>
            </div>
          </FadeIn>
        </div>
      </section>
        </div>
      </section>
        </div>
      </section>
          <BuilderEditorShowcase goBuilder={goBuilder} />
        </div>
      </section>
const MGMT_FEATURES = [
  { icon: Save, label: 'Save Resume' },
  { icon: Copy, label: 'Duplicate Resume' },
  { icon: Edit3, label: 'Rename Resume' },
  { icon: RefreshCw, label: 'Edit Resume' },
  { icon: Layers, label: 'Multiple Versions' },
  { icon: Download, label: 'Download PDF' },
  { icon: Printer, label: 'Print Resume' },
];