import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Zap, LayoutTemplate, FileText, User, Briefcase, GraduationCap, Wrench,
  FolderGit2, Award, Gauge, Brain, Wand2, Lightbulb, Download, CheckCircle2,
  AlertTriangle, ArrowRight, Send, Search, Eye, MousePointerClick, Check,
} from 'lucide-react';
import {
  FadeIn, SectionHeader, ScoreRing, ProgressBar, ResumeMock, CtaButton, Badge, useAppNav,
} from '../components/landing/MarketingBits';
import { usePageMeta } from '../hooks/usePageMeta';

/* ════════════════════════════════════════════════════════════════════
   HOW IT WORKS — Public marketing page
   ════════════════════════════════════════════════════════════════════ */

const BUILDER_SECTIONS = [
  { icon: User, name: 'Personal details' },
  { icon: FileText, name: 'Summary' },
  { icon: Briefcase, name: 'Experience' },
  { icon: GraduationCap, name: 'Education' },
  { icon: Wrench, name: 'Skills' },
  { icon: FolderGit2, name: 'Projects' },
  { icon: Award, name: 'Certifications' },
];

const ANALYSIS_DIMS = [
  { label: 'Structure', value: 95 },
  { label: 'Keywords', value: 88 },
  { label: 'Formatting', value: 94 },
  { label: 'Skills', value: 82 },
  { label: 'Experience', value: 90 },
  { label: 'Content', value: 86 },
];

const TIMELINE = [
  { icon: LayoutTemplate, title: 'Template', desc: 'Pick an ATS-friendly design' },
  { icon: FileText, title: 'Resume Builder', desc: 'Fill guided, structured sections' },
  { icon: Gauge, title: 'ATS Analysis', desc: 'See exactly what ATS sees' },
  { icon: Brain, title: 'AI Optimization', desc: 'Apply intelligent suggestions' },
  { icon: CheckCircle2, title: 'Final Resume', desc: 'Polished and PDF-ready' },
  { icon: Send, title: 'Job Application', desc: 'Apply with confidence' },
];

/* Example scoring model — the live product scoring algorithm may differ. */
const SCORE_MODEL = [
  { label: 'Keywords', points: 30, color: '#6366f1' },
  { label: 'Formatting', points: 20, color: '#3b82f6' },
  { label: 'Skills', points: 20, color: '#06b6d4' },
  { label: 'Experience', points: 15, color: '#8b5cf6' },
  { label: 'Sections', points: 10, color: '#ec4899' },
  { label: 'Readability', points: 5, color: '#f59e0b' },
];

const BEFORE_ITEMS = [
  { icon: AlertTriangle, text: 'Low keyword relevance for the roles you want' },
  { icon: AlertTriangle, text: 'Weak bullet points with no measurable outcomes' },
  { icon: AlertTriangle, text: 'Formatting that ATS parsers may misread' },
];

const AFTER_ITEMS = [
  { icon: CheckCircle2, text: 'Better keyword alignment with the job description' },
  { icon: CheckCircle2, text: 'Stronger, achievement-focused bullet points' },
  { icon: CheckCircle2, text: 'Cleaner, ATS-friendly structure throughout' },
];

/* ── Step shell: numbered header + shared card layout ────────────── */
function StepShell({ num, title, desc, icon: Icon, children }) {
  return (
    <FadeIn>
      <div
        className="rounded-3xl border p-6 sm:p-10"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)', boxShadow: 'var(--shadow-sm)' }}
      >
        <div className="flex items-start gap-4 mb-7">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-black text-lg"
            style={{ background: 'var(--accent-gradient)', color: 'var(--text-on-accent)', boxShadow: 'var(--shadow-accent)' }}
            aria-hidden="true"
          >
            {num}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {title}
            </h2>
            <p className="mt-1 text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
              {desc}
            </p>
          </div>
          <Icon
            className="w-6 h-6 ml-auto hidden sm:block shrink-0"
            style={{ color: 'var(--text-tertiary)' }}
            aria-hidden="true"
          />
        </div>
        {children}
      </div>
    </FadeIn>
  );
}

export default function HowItWorks() {
  usePageMeta({
    title: 'How Our ATS Resume Builder Works',
    description:
      'Build your perfect resume in 5 simple steps: choose a template, add your information, analyze your resume, optimize with AI, and download a PDF ready for job applications.',
  });

  const { goBuilder } = useAppNav();
  const [activeSection, setActiveSection] = useState(0);

  return (
    <div className="w-full overflow-hidden">
      {/* ── SECTION 01: HERO ─────────────────────────────────────── */}
      <section className="relative">
        <div className="absolute inset-0 hero-gradient pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-accent)', color: 'var(--text-accent)' }}
          >
            <MousePointerClick className="w-3.5 h-3.5" aria-hidden="true" />
            One Simple Workflow
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] max-w-3xl mx-auto"
            style={{ color: 'var(--text-primary)' }}
          >
            Build Your Perfect Resume in <span className="gradient-text">5 Simple Steps</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            Create, analyze, optimize, and download your resume from one simple workflow.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <CtaButton size="lg" onClick={goBuilder} icon={Zap}>
              Start Building
            </CtaButton>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 02: STEP 01 — CHOOSE A TEMPLATE ─────────────── */}
      <section className="py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <StepShell
            num="01"
            icon={LayoutTemplate}
            title="Choose a Template"
            desc="Select a professional, ATS-friendly template that fits your career."
          >
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {['Browse', 'Preview', 'Select'].map((s, i) => (
                <span key={s} className="inline-flex items-center gap-2">
                  {i > 0 && (
                    <ArrowRight className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} aria-hidden="true" />
                  )}
                  <span
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold border"
                    style={{ backgroundColor: 'var(--bg-tag)', borderColor: 'var(--border-accent)', color: 'var(--text-accent)' }}
                  >
                    {s}
                  </span>
                </span>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { variant: 'classic', tone: 'blue', name: 'Professional Classic' },
                { variant: 'minimal', tone: 'indigo', name: 'Modern Minimal' },
                { variant: 'developer', tone: 'emerald', name: 'Developer Resume' },
              ].map((t) => (
                <FadeIn key={t.name}>
                  <div
                    className="group rounded-2xl border p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}
                  >
                    <ResumeMock variant={t.variant} tone={t.tone} className="transition-transform duration-500 group-hover:scale-[1.02]" />
                    <div className="text-center text-xs font-bold mt-3" style={{ color: 'var(--text-primary)' }}>
                      {t.name}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </StepShell>

          {/* ── STEP 02 — ADD YOUR INFORMATION ──────────────────────── */}
          <StepShell
            num="02"
            icon={FileText}
            title="Add Your Information"
            desc="Fill in guided sections — the builder handles structure and formatting for you."
          >
            <div
              className="rounded-2xl border p-4 sm:p-6"
              style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-separator)' }}
            >
              <div
                className="flex items-center justify-between mb-4 pb-3 border-b"
                style={{ borderColor: 'var(--border-separator)' }}
              >
                <div className="inline-flex items-center gap-2 text-sm font-extrabold" style={{ color: 'var(--text-primary)' }}>
                  <FileText className="w-4 h-4" style={{ color: 'var(--accent)' }} aria-hidden="true" />
                  Resume Editor
                </div>
                <Badge tone="indigo">Guided inputs</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  {BUILDER_SECTIONS.map((s, i) => (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => setActiveSection(i)}
                      aria-pressed={activeSection === i}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border text-left transition-all cta-focus"
                      style={
                        activeSection === i
                          ? { backgroundColor: 'var(--bg-tag)', borderColor: 'var(--border-accent)', color: 'var(--text-accent)' }
                          : { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)', color: 'var(--text-secondary)' }
                      }
                    >
                      <s.icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      {s.name}
                    </button>
                  ))}
                </div>
                <div className="flex items-start justify-center">
                  <ResumeMock variant="modern" tone="indigo" className="!aspect-auto max-h-72" />
                </div>
              </div>
            </div>
          </StepShell>

          {/* ── STEP 03 — ANALYZE YOUR RESUME ───────────────────────── */}
          <StepShell
            num="03"
            icon={Gauge}
            title="Analyze Your Resume"
            desc="Run an ATS analysis to see how your resume scores across key dimensions."
          >
            <div
              className="rounded-2xl border p-4 sm:p-6"
              style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-separator)' }}
            >
              <div
                className="flex items-center justify-between mb-5 pb-3 border-b"
                style={{ borderColor: 'var(--border-separator)' }}
              >
                <div className="inline-flex items-center gap-2 text-sm font-extrabold" style={{ color: 'var(--text-primary)' }}>
                  <Gauge className="w-4 h-4" style={{ color: 'var(--accent)' }} aria-hidden="true" />
                  ATS Analysis Report
                </div>
                <Badge tone="emerald">Analysis Complete</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 items-center">
                <div className="flex justify-center">
                  <ScoreRing score={87} suffix="/100" sub="ATS Score" />
                </div>
                <div className="space-y-4">
                  {ANALYSIS_DIMS.map((d) => (
                    <ProgressBar key={d.label} label={d.label} value={d.value} />
                  ))}
                </div>
              </div>
            </div>
          </StepShell>

          {/* ── STEP 04 — OPTIMIZE YOUR RESUME ──────────────────────── */}
          <StepShell
            num="04"
            icon={Wand2}
            title="Optimize Your Resume"
            desc="Apply intelligent recommendations to strengthen weak sections."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="rounded-2xl border p-5"
                style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-separator)' }}
              >
                <div className="space-y-2 mb-3">
                  <Badge tone="amber">Missing Keyword</Badge>
                </div>
                <div className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>
                  REST API
                </div>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Consider adding REST API to your Skills or Experience section if it accurately
                  reflects your experience.
                </p>
              </div>
              <div
                className="rounded-2xl border p-5"
                style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-separator)' }}
              >
                <div className="space-y-2 mb-3">
                  <Badge tone="emerald">AI Suggestion</Badge>
                </div>
                <div className="text-base font-extrabold" style={{ color: 'var(--text-primary)' }}>
                  Strengthen this bullet point
                </div>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  &ldquo;Worked on web applications&rdquo; &rarr; &ldquo;Developed responsive web applications using
                  React.js and RESTful APIs, improving performance and user experience.&rdquo;
                </p>
                <div className="flex gap-2 pt-3">
                  <Badge tone="indigo">Apply</Badge>
                  <Badge tone="slate">Dismiss</Badge>
                </div>
              </div>
            </div>
          </StepShell>

          {/* ── STEP 05 — DOWNLOAD & APPLY ──────────────────────────── */}
          <StepShell
            num="05"
            icon={Download}
            title="Download & Apply"
            desc="Export a polished PDF and apply with confidence."
          >
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              {['Build', 'Analyze', 'Improve', 'Download', 'Apply'].map((s, i) => (
                <span key={s} className="inline-flex items-center gap-2">
                  {i > 0 && (
                    <ArrowRight className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} aria-hidden="true" />
                  )}
                  <span
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold border"
                    style={{ backgroundColor: 'var(--bg-tag)', borderColor: 'var(--border-accent)', color: 'var(--text-accent)' }}
                  >
                    {s}
                  </span>
                </span>
              ))}
            </div>
            <div
              className="rounded-2xl border p-6 text-center space-y-3"
              style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-separator)' }}
            >
              <div
                className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center"
                style={{ background: 'var(--accent-gradient)', boxShadow: 'var(--shadow-accent)' }}
                aria-hidden="true"
              >
                <Download className="w-5 h-5" style={{ color: 'var(--text-on-accent)' }} />
              </div>
              <div className="text-base font-extrabold" style={{ color: 'var(--text-primary)' }}>
                Your resume is ready for any job portal
              </div>
              <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
                High-fidelity PDF with selectable text — parsed cleanly by ATS and easy for
                recruiters to read.
              </p>
              <CtaButton size="lg" onClick={goBuilder} icon={Download}>
                Create My Resume
              </CtaButton>
            </div>
          </StepShell>
        </div>
      </section>
      {/* ── SECTION 07: COMPLETE WORKFLOW ────────────────────────── */}
      <section className="py-14 sm:py-20" style={{ backgroundColor: 'var(--bg-elevated)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <FadeIn>
            <SectionHeader
              label="End-to-End Workflow"
              heading="From Blank Page to Job Application"
              sub="Every stage is connected — your resume moves through the whole pipeline without ever leaving the platform."
            />
          </FadeIn>

          <div className="relative max-w-2xl mx-auto">
            {/* vertical rail connecting the stage tiles */}
            <div
              className="absolute left-6 top-6 bottom-6 w-0.5 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, var(--border-accent), var(--border-subtle))' }}
              aria-hidden="true"
            />
            <div className="space-y-5">
              {TIMELINE.map((stage, i) => (
                <FadeIn key={stage.title} delay={i * 0.06}>
                  <div className="relative flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 relative z-10"
                      style={{ background: 'var(--accent-gradient)', boxShadow: 'var(--shadow-accent)' }}
                      aria-hidden="true"
                    >
                      <stage.icon className="w-5 h-5" style={{ color: 'var(--text-on-accent)' }} />
                    </div>
                    <div
                      className="flex-1 rounded-2xl border p-4 sm:p-5"
                      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-[11px] font-black tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="text-sm sm:text-base font-extrabold" style={{ color: 'var(--text-primary)' }}>
                          {stage.title}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {stage.desc}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 08: ATS SCORING EXPLANATION ──────────────────── */}
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <FadeIn>
            <SectionHeader
              label="Full Transparency"
              heading="How Your ATS Score Is Calculated"
              sub="A sample scoring model showing how the analyzer weighs each part of your resume. The live product algorithm may differ as the analyzer evolves."
            />
          </FadeIn>

          <FadeIn delay={0.1}>
            <div
              className="max-w-4xl mx-auto rounded-3xl border p-6 sm:p-10"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)', boxShadow: 'var(--shadow-sm)' }}
            >
              <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-start">
                <div className="flex flex-col items-center gap-3">
                  <ScoreRing score={100} size={128} sub="Total Points" />
                  <Badge tone="indigo">Example Model</Badge>
                </div>
                <div className="space-y-4">
                  {SCORE_MODEL.map((row) => (
                    <div key={row.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                          {row.label}
                        </span>
                        <span
                          className="text-xs font-black px-2 py-0.5 rounded-md"
                          style={{ backgroundColor: 'var(--bg-tag)', color: 'var(--text-accent)' }}
                        >
                          {row.points} pts
                        </span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-muted)' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(row.points / 30) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: row.color }}
                        />
                      </div>
                    </div>
                  ))}
                  <div
                    className="pt-3 mt-2 border-t flex items-center justify-between"
                    style={{ borderColor: 'var(--border-separator)' }}
                  >
                    <span className="text-sm font-extrabold" style={{ color: 'var(--text-primary)' }}>
                      Total
                    </span>
                    <span className="text-sm font-black" style={{ color: 'var(--text-accent)' }}>
                      100 points
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── SECTION 09: BEFORE & AFTER ───────────────────────────── */}
      <section className="py-14 sm:py-20" style={{ backgroundColor: 'var(--bg-elevated)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <FadeIn>
            <SectionHeader
              label="The Difference"
              heading="What Optimization Changes"
              sub="The analyzer pinpoints weaknesses, then AI recommendations strengthen every section of your resume."
            />
          </FadeIn>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-stretch">
            {/* BEFORE panel */}
            <FadeIn>
              <div
                className="h-full rounded-3xl border p-6 sm:p-7"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}
              >
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest mb-5"
                  style={{ backgroundColor: 'var(--bg-danger)', color: 'var(--text-danger)' }}
                >
                  <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" /> Before
                </div>
                <ul className="space-y-4">
                  {BEFORE_ITEMS.map((item) => (
                    <li key={item.text} className="flex items-start gap-3">
                      <AlertTriangle
                        className="w-4 h-4 mt-0.5 shrink-0"
                        style={{ color: 'var(--text-danger)' }}
                        aria-hidden="true"
                      />
                      <span className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            {/* connector arrow */}
            <div className="hidden md:flex items-center justify-center" aria-hidden="true">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center"
                style={{ background: 'var(--accent-gradient)', boxShadow: 'var(--shadow-accent)' }}
              >
                <ArrowRight className="w-5 h-5" style={{ color: 'var(--text-on-accent)' }} />
              </div>
            </div>

            {/* AFTER panel */}
            <FadeIn delay={0.12}>
              <div
                className="h-full rounded-3xl border p-6 sm:p-7"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-accent)',
                  boxShadow: 'var(--shadow-accent)',
                }}
              >
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest mb-5"
                  style={{ backgroundColor: 'var(--bg-success)', color: 'var(--text-success)' }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" /> After
                </div>
                <ul className="space-y-4">
                  {AFTER_ITEMS.map((item) => (
                    <li key={item.text} className="flex items-start gap-3">
                      <CheckCircle2
                        className="w-4 h-4 mt-0.5 shrink-0"
                        style={{ color: 'var(--text-success)' }}
                        aria-hidden="true"
                      />
                      <span className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── SECTION 10: FINAL CTA ────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div
              className="relative rounded-3xl border p-10 sm:p-14 text-center overflow-hidden"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-accent)' }}
            >
              <div className="absolute inset-0 bg-radial-glow opacity-70 pointer-events-none" aria-hidden="true" />
              <div className="relative space-y-5">
                <div
                  className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center"
                  style={{ background: 'var(--accent-gradient)', boxShadow: 'var(--shadow-accent)' }}
                  aria-hidden="true"
                >
                  <Zap className="w-6 h-6" style={{ color: 'var(--text-on-accent)' }} fill="currentColor" />
                </div>
                <h2
                  className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Your Next Job Starts With a <span className="gradient-text">Better Resume.</span>
                </h2>
                <p className="max-w-xl mx-auto text-base sm:text-lg" style={{ color: 'var(--text-secondary)' }}>
                  Free to start — build, analyze, and download your first resume in minutes. No credit card required.
                </p>
                <div className="flex justify-center pt-2">
                  <CtaButton size="lg" onClick={goBuilder} icon={Zap}>
                    Build My Resume
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
