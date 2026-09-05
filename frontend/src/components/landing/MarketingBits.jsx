/**
 * MarketingBits — shared building blocks for the public marketing pages
 * (Home / Features / Templates / How It Works / Pricing).
 *
 * Every primitive consumes the centralized theme tokens defined in
 * index.css (`var(--bg-card)`, `var(--text-primary)`, `var(--accent)`…)
 * so all five pages stay fully theme-aware in Light AND Dark mode.
 *
 * Exports:
 *   useAppNav, FadeIn, SectionHeader, useCounter, ScoreRing,
 *   ProgressBar, ResumeMock, CtaButton, Badge, AiBeforeAfter
 */
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

/* ═════════════════════ CTA NAVIGATION HELPERS ═════════════════════ */

/**
 * Central CTA destinations for all public marketing pages.
 * Logged-in users go straight into the app; guests land on /register.
 */
export function useAppNav() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const goBuilder = () => (user ? navigate('/resumes/new') : navigate('/register'));
  const goAnalyze = () => (user ? navigate('/upload') : navigate('/register'));
  const goRegister = () => navigate('/register');
  const goLogin = () => navigate('/login');
  const goDashboard = () => (user ? navigate('/dashboard') : navigate('/register'));

  return { user, navigate, goBuilder, goAnalyze, goRegister, goLogin, goDashboard };
}

/* ═════════════════════ REVEAL ON SCROLL ═════════════════════ */

const EASE = [0.16, 1, 0.3, 1];

export function FadeIn({ delay = 0, y = 20, className = '', children, ...rest }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay, ease: EASE }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* ═════════════════════ SECTION HEADER ═════════════════════ */

export function SectionHeader({ label, heading, sub, align = 'center' }) {
  const isCenter = align === 'center';
  return (
    <div className={`flex flex-col gap-4 ${isCenter ? 'items-center text-center' : 'items-start text-left'}`}>
      {label && (
        <span
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold tracking-wide"
          style={{
            backgroundColor: 'var(--bg-tag)',
            borderColor: 'var(--border-accent)',
            color: 'var(--text-accent)',
          }}
        >
          {label}
        </span>
      )}
      <h2
        className="text-3xl sm:text-4xl lg:text-[2.6rem] font-black tracking-tight leading-tight max-w-3xl"
        style={{ color: 'var(--text-primary)' }}
      >
        {heading}
      </h2>
      {sub && (
        <p className="text-base sm:text-lg leading-relaxed max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
          {sub}
        </p>
      )}
    </div>
  );
}

/* ═════════════════════ ANIMATED COUNTER ═════════════════════ */

/**
 * Returns { ref, count } — attach `ref` to the element that should
 * trigger the count when it scrolls into view. Respects reduced motion.
 */
export function useCounter(target, { duration = 1400 } = {}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(target);
      return undefined;
    }
    let raf;
    const startedAt = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  return { ref, count };
}

/* ═════════════════════ ANIMATED SCORE RING ═════════════════════ */

/**
 * Circular ATS score gauge. Animates from 0 → score when scrolled
 * into view. Theme-aware via tokens; honors reduced-motion.
 */
export function ScoreRing({ score = 0, size = 150, suffix = '%', sub, stroke = 12 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(score);
      return undefined;
    }
    let raf;
    const startedAt = performance.now();
    const tick = (now) => {
      const p = Math.min((now - startedAt) / 1200, 1);
      setShown(score * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, score]);

  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      ref={ref}
      className="relative inline-flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${sub || 'Score'}: ${score} out of 100`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-subtle)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (shown / 100) * circumference}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span
          className="font-black tabular-nums leading-none"
          style={{ fontSize: Math.round(size * 0.27), color: 'var(--text-primary)' }}
        >
          {Math.round(shown)}
          <span style={{ fontSize: Math.round(size * 0.13), color: 'var(--text-tertiary)' }}>{suffix}</span>
        </span>
        {sub && (
          <span
            className="mt-1.5 text-[11px] font-bold uppercase tracking-widest"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}

/* ═════════════════════ PROGRESS BAR ═════════════════════ */

/**
 * Labeled animated progress bar. `color` overrides the accent gradient
 * fill (used for category-specific colors).
 */
export function ProgressBar({ label, value = 0, color, showValue = true }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    const target = Math.max(0, Math.min(100, value));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setWidth(target);
      return undefined;
    }
    let raf;
    const startedAt = performance.now();
    const tick = (now) => {
      const p = Math.min((now - startedAt) / 900, 1);
      setWidth(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <div ref={ref}>
      {(label || showValue) && (
        <div className="flex items-center justify-between gap-3 mb-1.5">
          <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
            {label}
          </span>
          {showValue && (
            <span className="text-xs font-black tabular-nums shrink-0" style={{ color: 'var(--text-accent)' }}>
              {Math.round(value)}%
            </span>
          )}
        </div>
      )}
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border-subtle)' }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            background: color || 'var(--accent-gradient)',
            transition: 'width 90ms linear',
          }}
        />
      </div>
    </div>
  );
}

/* ═════════════════════ RESUME MOCK PREVIEW ═════════════════════ */

/**
 * Pure-CSS, theme-aware miniature resume sheet used across the
 * marketing pages (template galleries, builder preview, steps).
 * Paper/ink colors come from --resume-* tokens; the accent tone is
 * decorative only, so contrast holds in both themes.
 */

const RESUME_TONES = {
  blue:    { solid: '#3b82f6' },
  indigo:  { solid: '#6366f1' },
  slate:   { solid: '#64748b' },
  emerald: { solid: '#10b981' },
  cyan:    { solid: '#06b6d4' },
  rose:    { solid: '#f43f5e' },
  amber:   { solid: '#f59e0b' },
  purple:  { solid: '#a855f7' },
};

const MockLine = ({ w = '100%', h = 4, c = 'var(--resume-line)', className = '' }) => (
  <div className={`rounded-full ${className}`} style={{ width: w, height: h, backgroundColor: c }} />
);

const MockChip = ({ w = 30 }) => (
  <div
    className="rounded-full"
    style={{
      width: w,
      height: 11,
      backgroundColor: 'var(--resume-tint)',
      border: '1px solid var(--resume-line)',
    }}
  />
);

const MockSection = ({ titleW = 38, children }) => (
  <div className="mb-2">
    <div className="flex items-center gap-1.5 mb-1.5">
      <div
        style={{ width: titleW, height: 5, borderRadius: 3, backgroundColor: 'var(--resume-accent)' }}
      />
      <div className="flex-1" style={{ height: 1, backgroundColor: 'var(--resume-line)' }} />
    </div>
    {children}
  </div>
);

const MockTextBlock = ({ lines = [100, 92, 96] }) => (
  <div className="space-y-1">
    {lines.map((w, i) => (
      <MockLine key={i} w={`${w}%`} />
    ))}
  </div>
);

const MockExperience = () => (
  <div className="flex gap-1.5 mb-1.5">
    <div
      className="rounded-full shrink-0 mt-1"
      style={{ width: 5, height: 5, backgroundColor: 'var(--resume-accent)' }}
    />
    <div className="flex-1 space-y-1">
      <MockLine w="55%" h={5} c="var(--resume-ink)" />
      <MockLine w="100%" />
      <MockLine w="82%" />
    </div>
  </div>
);

function ResumeBody({ variant, accent }) {
  if (variant === 'executive') {
    return (
      <div className="flex h-full">
        <div
          className="w-[30%] shrink-0 p-2.5 space-y-2"
          style={{ backgroundColor: 'var(--resume-tint)', borderRight: '1px solid var(--resume-line)' }}
        >
          <div className="rounded-full mx-auto" style={{ width: 26, height: 26, backgroundColor: accent, opacity: 0.85 }} />
          <MockLine w="90%" h={4} c="var(--resume-ink)" className="mx-auto" />
          <MockLine w="70%" className="mx-auto" />
          <div className="pt-1 space-y-1.5">
            {[80, 64, 74, 58].map((w, i) => (
              <MockLine key={i} w={`${w}%`} />
            ))}
          </div>
        </div>
        <div className="flex-1 p-2.5 space-y-2">
          <MockLine w="72%" h={7} c="var(--resume-ink)" />
          <MockLine w="46%" />
          <MockSection titleW={34}>
            <MockExperience />
            <MockExperience />
          </MockSection>
          <MockSection titleW={26}>
            <MockTextBlock lines={[96, 84]} />
          </MockSection>
        </div>
      </div>
    );
  }

  if (variant === 'creative') {
    return (
      <div className="h-full">
        <div className="p-2.5 pb-2" style={{ backgroundColor: accent }}>
          <div className="rounded-sm" style={{ width: '58%', height: 7, backgroundColor: 'rgba(255,255,255,0.95)' }} />
          <div className="mt-1.5 rounded-full" style={{ width: '34%', height: 4, backgroundColor: 'rgba(255,255,255,0.65)' }} />
        </div>
        <div className="p-2.5 space-y-2">
          <div className="grid grid-cols-2 gap-1.5">
            <MockLine w="90%" />
            <MockLine w="70%" />
          </div>
          <MockSection titleW={34}>
            <MockExperience />
          </MockSection>
          <MockSection titleW={24}>
            <div className="flex flex-wrap gap-1">
              {[22, 30, 26, 34].map((w, i) => (
                <MockChip key={i} w={w} />
              ))}
            </div>
          </MockSection>
        </div>
      </div>
    );
  }

  if (variant === 'developer') {
    return (
      <div className="h-full p-2.5">
        <div className="flex items-end justify-between mb-2 gap-2">
          <div className="space-y-1.5 flex-1">
            <MockLine w="62%" h={7} c="var(--resume-ink)" />
            <MockLine w="40%" />
          </div>
          <div className="flex flex-wrap gap-1 justify-end max-w-[46%]">
            {[24, 20, 26].map((w, i) => (
              <MockChip key={i} w={w} />
            ))}
          </div>
        </div>
        <MockSection titleW={22}>
          <div className="flex flex-wrap gap-1 mb-1">
            {[28, 34, 24, 30, 22].map((w, i) => (
              <MockChip key={i} w={w} />
            ))}
          </div>
        </MockSection>
        <MockSection titleW={28}>
          <MockExperience />
          <MockExperience />
        </MockSection>
        <MockSection titleW={26}>
          <MockTextBlock lines={[94, 78]} />
        </MockSection>
      </div>
    );
  }

  if (variant === 'student') {
    return (
      <div className="h-full p-2.5">
        <div className="space-y-1.5 mb-2">
          <MockLine w="58%" h={7} c="var(--resume-ink)" />
          <MockLine w="38%" />
        </div>
        <MockSection titleW={32}>
          <div
            className="rounded-md p-2 mb-1.5"
            style={{ backgroundColor: 'var(--resume-tint)', border: '1px solid var(--resume-line)' }}
          >
            <MockLine w="64%" h={5} c="var(--resume-ink)" />
            <div className="mt-1.5">
              <MockLine w="88%" />
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {[24, 30, 26].map((w, i) => (
              <MockChip key={i} w={w} />
            ))}
          </div>
        </MockSection>
        <MockSection titleW={26}>
          <MockExperience />
        </MockSection>
        <MockSection titleW={30}>
          <MockTextBlock lines={[90, 70]} />
        </MockSection>
      </div>
    );
  }

  if (variant === 'minimal' || variant === 'modern') {
    const isModern = variant === 'modern';
    return (
      <div className="h-full p-2.5">
        <div className={`mb-2.5 ${isModern ? 'flex items-center gap-2' : 'space-y-1.5'}`}>
          {isModern && <div className="rounded-sm shrink-0" style={{ width: 6, height: 22, backgroundColor: accent }} />}
          <div className="space-y-1.5 flex-1">
            <MockLine w="56%" h={7} c="var(--resume-ink)" />
            <MockLine w="34%" />
          </div>
        </div>
        <MockSection titleW={30}>
          <MockExperience />
          <MockExperience />
        </MockSection>
        <MockSection titleW={24}>
          {isModern ? (
            <div className="grid grid-cols-2 gap-1">
              {[40, 30, 34, 26].map((w, i) => (
                <MockChip key={i} w={w} />
              ))}
            </div>
          ) : (
            <MockTextBlock lines={[92, 84, 60]} />
          )}
        </MockSection>
      </div>
    );
  }

  /* classic (default) */
  return (
    <div className="h-full p-2.5">
      <div className="text-center space-y-1.5 mb-2">
        <MockLine w="52%" h={7} c="var(--resume-ink)" className="mx-auto" />
        <MockLine w="36%" className="mx-auto" />
        <div className="flex justify-center gap-1.5">
          {[18, 22, 16].map((w, i) => (
            <MockLine key={i} w={w} h={3} />
          ))}
        </div>
      </div>
      <div className="mb-2" style={{ height: 1.5, backgroundColor: accent, opacity: 0.55 }} />
      <MockSection titleW={34}>
        <MockExperience />
        <MockExperience />
      </MockSection>
      <MockSection titleW={26}>
        <MockTextBlock lines={[94, 86, 66]} />
      </MockSection>
    </div>
  );
}

/**
 * Miniature resume sheet — aspect-locked A4-style page.
 * Callers can pass `!aspect-auto` to stretch it inside larger panels.
 */
export function ResumeMock({ variant = 'classic', tone = 'indigo', className = '' }) {
  const accent = (RESUME_TONES[tone] || RESUME_TONES.indigo).solid;

  return (
    <div
      role="img"
      aria-label={`${variant} resume template preview`}
      className={`w-full overflow-hidden rounded-lg select-none ${className}`}
      style={{
        aspectRatio: '8.5 / 11',
        backgroundColor: 'var(--resume-paper)',
        border: '1px solid var(--resume-line)',
        boxShadow: 'var(--shadow-md)',
        color: 'var(--resume-ink)',
      }}
    >
      <ResumeBody variant={variant} accent={accent} />
    </div>
  );
}

/* ═════════════════════ CTA BUTTON ═════════════════════ */

const CTA_SIZES = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-[15px]',
};

export function CtaButton({ to, onClick, icon: Icon, size = 'md', variant = 'primary', className = '', children }) {
  const base = [
    'inline-flex items-center justify-center gap-2 font-bold rounded-xl',
    'transition-all duration-200 select-none cta-focus',
    'hover:-translate-y-0.5 active:scale-[0.97]',
    CTA_SIZES[size] || CTA_SIZES.md,
    className,
  ].join(' ');

  const style =
    variant === 'outline'
      ? {
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-primary)',
          border: '1.5px solid var(--border-strong)',
        }
      : {
          background: 'var(--accent-gradient)',
          color: 'var(--text-on-accent)',
          border: '1px solid transparent',
          boxShadow: 'var(--shadow-accent)',
        };

  const content = (
    <>
      {Icon && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} aria-hidden="true" />}
      <span>{children}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={base} style={style}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={base} style={style}>
      {content}
    </button>
  );
}

/* ═════════════════════ BADGE ═════════════════════ */

export function Badge({ tone = 'slate', className = '', children }) {
  return <span className={`badge badge-${tone} ${className}`}>{children}</span>;
}

/* ═════════════════════ AI BEFORE / AFTER ═════════════════════ */

const AI_HL = {
  verb:  { bg: 'var(--bg-tag)', border: 'var(--border-accent)', color: 'var(--text-accent)', label: 'Action verb' },
  skill: { bg: 'var(--bg-success)', border: 'rgba(16,185,129,0.4)', color: 'var(--text-success)', label: 'Technical skill' },
  impact:{ bg: 'var(--bg-warning)', border: 'rgba(245,158,11,0.4)', color: 'var(--text-warning)', label: 'Measurable impact' },
  kw:    { bg: 'var(--bg-tag)', border: 'var(--border-accent)', color: 'var(--text-accent)', label: 'Keyword' },
};

const Hl = ({ kind, children }) => (
  <span
    className="rounded-md px-1.5 py-0.5 font-semibold"
    style={{ backgroundColor: AI_HL[kind].bg, border: `1px solid ${AI_HL[kind].border}`, color: AI_HL[kind].color }}
    title={AI_HL[kind].label}
  >
    {children}
  </span>
);

export function AiBeforeAfter({ goBuilder }) {
  const [view, setView] = useState('after');

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)', boxShadow: 'var(--shadow-md)' }}
    >
      {/* View switch */}
      <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b" style={{ borderColor: 'var(--border-separator)' }}>
        <div className="inline-flex rounded-xl p-1" style={{ backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border-subtle)' }}>
          {[
            { id: 'before', label: 'Before' },
            { id: 'after', label: 'After' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setView(t.id)}
              aria-pressed={view === t.id}
              className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={
                view === t.id
                  ? { background: 'var(--accent-gradient)', color: 'var(--text-on-accent)' }
                  : { color: 'var(--text-secondary)' }
              }
            >
              {t.label}
            </button>
          ))}
        </div>
        <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
          AI Optimization
        </span>
      </div>

      <div className="p-5 sm:p-7">
        {view === 'before' ? (
          <motion.div key="before" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <p className="text-[11px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-danger)' }}>
              Before — weak bullet
            </p>
            <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              “Worked on web applications.”
            </p>
            <p className="mt-4 text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              Short, vague, no technologies, no outcome — easy for a recruiter to skip and hard for an
              ATS to match against the job description.
            </p>
          </motion.div>
        ) : (
          <motion.div key="after" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <p className="text-[11px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-success)' }}>
              After — optimized bullet
            </p>
            <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
              “<Hl kind="verb">Developed</Hl> <Hl kind="kw">responsive</Hl> web applications using{' '}
              <Hl kind="skill">React.js</Hl> and <Hl kind="skill">RESTful APIs</Hl>,{' '}
              <Hl kind="impact">improving application performance and user experience</Hl>.”
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone="indigo">Strong action verb</Badge>
              <Badge tone="emerald">Technologies named</Badge>
              <Badge tone="amber">Impact stated</Badge>
            </div>
          </motion.div>
        )}
      </div>

      <div className="px-5 sm:px-7 pb-5 sm:pb-7">
        <CtaButton onClick={goBuilder} icon={Sparkles}>
          Optimize My Resume
        </CtaButton>
      </div>
    </div>
  );
}
