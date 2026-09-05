import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutTemplate,
  Sparkles,
  ShieldCheck,
  Eye,
  FileCode,
  Download,
  Copy,
  Check,
  ArrowRight,
  Code2,
  CheckCircle2,
  X,
  Layers,
  FileText,
  Briefcase,
  GraduationCap,
  Terminal,
} from 'lucide-react';
import { templateApi } from '../api/templateApi';
import { builderApi } from '../api/builderApi';
import { generateClientLatex, downloadTexFile } from '../utils/clientLatexRenderer';

// Predefined metadata for exactly the 4 templates
const GALLERY_TEMPLATES = [
  {
    templateId: 'template-01',
    name: 'Classic Professional',
    subtitle: 'Template 01',
    description: 'Traditional corporate LaTeX resume featuring Computer Modern typography, compact tabular contact header, and clean horizontal section dividers.',
    bestFor: 'Corporate / Graduate Applications',
    atsRating: 'Excellent',
    atsScore: 98,
    badgeColor: 'emerald',
    paperSize: 'A4',
    engine: 'pdflatex / standard TeXLive',
    packages: ['titlesec', 'tabularx', 'enumitem', 'hyperref', 'fontawesome5'],
    sectionsOrder: ['Professional Summary', 'Education', 'Technical Skills', 'Experience', 'Projects', 'Certifications', 'Referees'],
    icon: GraduationCap,
    previewStyle: 'classic',
  },
  {
    templateId: 'template-02',
    name: 'Modern ATS',
    subtitle: 'Template 02',
    description: 'Ultra-clean modern software engineering resume built with Roboto sans-serif typography, prominent candidate name, and crisp divider rules.',
    bestFor: 'Software Engineering / IT',
    atsRating: 'Excellent',
    atsScore: 99,
    badgeColor: 'cyan',
    paperSize: 'A4',
    engine: 'pdflatex with roboto font',
    packages: ['roboto', 'titlesec', 'tabularx', 'glyphtounicode', 'hyperref'],
    sectionsOrder: ['Professional Summary', 'Education', 'Technical Skills', 'Experience', 'Projects', 'Certifications', 'Referees'],
    icon: Briefcase,
    previewStyle: 'modern',
  },
  {
    templateId: 'template-03',
    name: 'ModernCV Professional',
    subtitle: 'Template 03',
    description: 'Prestigious ModernCV banking layout featuring elegant header styling, contact icons, and balanced section spacing for high-impact applications.',
    bestFor: 'Professional / Academic Applications',
    atsRating: 'Very Good',
    atsScore: 94,
    badgeColor: 'purple',
    paperSize: 'A4',
    engine: 'pdflatex / moderncv standard',
    packages: ['moderncv', 'banking', 'geometry', 'multicol', 'fontawesome5'],
    sectionsOrder: ['Professional Summary (Profile)', 'Education', 'Technical Skills', 'Experience', 'Projects', 'Certifications', 'Referees'],
    icon: Layers,
    previewStyle: 'moderncv',
  },
  {
    templateId: 'template-04',
    name: 'Minimal Developer',
    subtitle: 'Template 04',
    description: 'Clean developer-focused resume inspired by sb2nov with Lato typography, prominent GitHub and LinkedIn presence, and compact technical skills.',
    bestFor: 'Full Stack / Software Developer',
    atsRating: 'Excellent',
    atsScore: 98,
    badgeColor: 'amber',
    paperSize: 'A4',
    engine: 'pdflatex with lato font',
    packages: ['lato', 'titlesec', 'fontawesome5', 'tabularx', 'glyphtounicode'],
    sectionsOrder: ['Professional Summary', 'Education', 'Technical Skills', 'Experience', 'Projects', 'Certifications', 'Referees'],
    icon: Terminal,
    previewStyle: 'developer',
  },
];

const SAMPLE_RESUME_DATA = {
  personal: {
    fullName: 'Alex Morgan',
    location: 'San Francisco, CA',
    phone: '+1 (555) 234-5678',
    email: 'alex.morgan@email.com',
    github: 'https://github.com/alexmorgan',
    linkedin: 'https://linkedin.com/in/alexmorgan',
  },
  summary: 'Results-driven Software Engineer with 4+ years of experience designing high-throughput microservices, scalable distributed backends, and responsive cloud web architectures. Adept at leveraging modern DevOps and engineering best practices to reduce latency and accelerate product velocity.',
  education: [
    {
      degree: 'B.S. in Computer Science',
      institution: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      startDate: '2018',
      endDate: '2022',
      grade: '3.85 / 4.0',
      description: 'Relevant Coursework: Data Structures & Algorithms, Distributed Systems, Database Architecture.',
    },
  ],
  technicalSkills: [
    { category: 'Programming Languages', skills: 'Python, TypeScript, JavaScript, Go, C++, SQL' },
    { category: 'Frontend & Frameworks', skills: 'React, Next.js, Redux Toolkit, Tailwind CSS, HTML5/CSS3' },
    { category: 'Backend & Cloud', skills: 'Node.js, Express, FastAPI, PostgreSQL, MongoDB, Redis, Docker, AWS' },
    { category: 'Developer Tools', skills: 'Git, GitHub Actions, CI/CD, Linux, Postman, Jest, Agile Scrum' },
  ],
  experience: [
    {
      role: 'Senior Software Engineer',
      company: 'TechNova Solutions',
      location: 'San Francisco, CA',
      startDate: '2022',
      endDate: 'Present',
      employmentType: 'Full-time',
      bulletPoints: [
        'Architected high-throughput microservices handling 2M+ daily requests, reducing average API response times by 38%.',
        'Engineered distributed caching layer using Redis Cluster, mitigating relational database load spikes by 60%.',
        'Led migration of core monolith into containerized Kubernetes services, boosting operational uptime to 99.98%.',
      ],
    },
    {
      role: 'Software Engineer Intern',
      company: 'Apex Digital Labs',
      location: 'San Jose, CA',
      startDate: '2021',
      endDate: '2022',
      employmentType: 'Internship',
      bulletPoints: [
        'Developed interactive analytics dashboard with React and Chart.js, increasing daily internal user engagement by 25%.',
        'Automated integration test suites using Jest and Cypress, preventing critical production regressions.',
      ],
    },
  ],
  projects: [
    {
      name: 'CloudPulse Monitoring Platform',
      technologies: 'Go, React, Prometheus, Docker',
      date: '2023',
      github: 'https://github.com/alexmorgan/cloudpulse',
      url: 'cloudpulse-demo.app',
      description: 'Distributed cloud metrics telemetry agent and interactive dashboard.',
      bulletPoints: [
        'Built low-overhead telemetry agent collecting system metrics from 50+ Linux hosts with sub-second polling.',
        'Designed automated alerting module dispatching immediate webhook notifications to Slack and PagerDuty.',
      ],
    },
  ],
  certifications: [
    {
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      date: '2023',
      credentialId: 'AWS-PSA-89421',
    },
  ],
  referees: [
    {
      fullName: 'Dr. Sarah Jenkins',
      position: 'VP of Engineering',
      organization: 'TechNova Solutions',
      email: 'sjenkins@technova.io',
      phone: '+1 (555) 987-6543',
      relationship: 'Direct Manager',
    },
  ],
};

export default function TemplateGallery() {
  const navigate = useNavigate();
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [previewLatex, setPreviewLatex] = useState('');
  const [copied, setCopied] = useState(false);
  const [creatingTemplateId, setCreatingTemplateId] = useState(null);

  const handleUseTemplate = async (templateId) => {
    setCreatingTemplateId(templateId);
    try {
      // Store preferred template ID in localStorage so ResumeEditor picks it up immediately
      localStorage.setItem('ats_selected_template', templateId);

      // Attempt to create a resume in the backend if user is authenticated
      const token = localStorage.getItem('ats_token');
      if (token) {
        try {
          const tpl = GALLERY_TEMPLATES.find((t) => t.templateId === templateId);
          const resume = await builderApi.createResume({
            title: `${tpl?.name || 'Professional'} Resume`,
            templateId,
            personal: SAMPLE_RESUME_DATA.personal,
            summary: SAMPLE_RESUME_DATA.summary,
            education: SAMPLE_RESUME_DATA.education,
            technicalSkills: SAMPLE_RESUME_DATA.technicalSkills,
            experience: SAMPLE_RESUME_DATA.experience,
            projects: SAMPLE_RESUME_DATA.projects,
            certifications: SAMPLE_RESUME_DATA.certifications,
            referees: SAMPLE_RESUME_DATA.referees,
          });
          navigate(`/builder/${resume._id}`);
          return;
        } catch (apiErr) {
          console.warn('Backend resume creation bypassed; opening builder directly:', apiErr);
        }
      }

      // Guest / Direct access mode
      navigate('/builder');
    } finally {
      setCreatingTemplateId(null);
    }
  };

  const openPreviewModal = (template) => {
    setSelectedPreview(template);
    const code = generateClientLatex(SAMPLE_RESUME_DATA, template.templateId);
    setPreviewLatex(code);
  };

  const handleCopyLatex = () => {
    if (!previewLatex) return;
    navigator.clipboard.writeText(previewLatex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSampleTex = (template) => {
    const code = generateClientLatex(SAMPLE_RESUME_DATA, template.templateId);
    downloadTexFile(code, `${template.templateId}_${template.name.toLowerCase().replace(/\s+/g, '_')}.tex`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div
        className="relative overflow-hidden rounded-3xl p-6 sm:p-10 border shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-elevated) 100%)',
          borderColor: 'var(--border-base)',
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-300 border border-indigo-500/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
              Overleaf & TeXLive Standard • A4 Native
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              LaTeX Resume Template Gallery
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Explore 4 professionally engineered LaTeX resume designs. Every template shares a common data architecture with our mandatory 7-section ATS order: <strong style={{ color: 'var(--text-primary)' }}>Summary → Education → Skills → Experience → Projects → Certifications → Referees</strong>.
            </p>
          </div>

          <button
            onClick={() => navigate('/builder')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 transition-all cursor-pointer shrink-0"
          >
            <FileCode className="w-4 h-4" />
            <span>Open Resume Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Templates Grid: Exactly 4 Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {GALLERY_TEMPLATES.map((tpl) => {
          const Icon = tpl.icon;
          return (
            <div
              key={tpl.templateId}
              className="group rounded-2xl border p-6 shadow-xl transition-all flex flex-col justify-between hover:shadow-2xl hover:border-indigo-500/50"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-base)',
              }}
            >
              <div className="space-y-5">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {tpl.subtitle}
                      </span>
                      <h3 className="text-xl font-bold tracking-tight group-hover:text-indigo-500 dark:group-hover:text-indigo-300 transition-colors" style={{ color: 'var(--text-primary)' }}>
                        {tpl.name}
                      </h3>
                    </div>
                  </div>

                  {/* ATS Rating Pill */}
                  <div className="flex flex-col items-end">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                      ATS: {tpl.atsRating} ({tpl.atsScore}%)
                    </span>
                  </div>
                </div>

                {/* Mock Visual Thumbnail */}
                <div
                  onClick={() => openPreviewModal(tpl)}
                  className="w-full h-44 rounded-xl bg-white p-4 overflow-hidden border border-slate-200 cursor-pointer shadow-inner relative group/thumb hover:ring-2 hover:ring-indigo-500 transition-all select-none"
                  title="Click to Preview Template"
                >
                  <div className="text-[9px] text-slate-800 space-y-1.5 font-sans pointer-events-none">
                    <div className={`text-center pb-1 border-b border-slate-300 ${tpl.previewStyle === 'classic' ? 'font-serif' : ''}`}>
                      <p className="font-bold text-[11px] uppercase tracking-wider text-slate-900">Alex Morgan</p>
                      <p className="text-[7.5px] text-slate-500">San Francisco, CA • +1 (555) 234-5678 • alex.morgan@email.com • github.com/alexmorgan</p>
                    </div>

                    {/* Section Summary Mock */}
                    <div className="pt-1">
                      <div className="flex items-center justify-between border-b border-slate-300 pb-0.5 mb-1">
                        <span className="font-bold uppercase tracking-wider text-[8px] text-slate-800">Professional Summary</span>
                      </div>
                      <p className="text-[7.5px] text-slate-600 leading-tight line-clamp-2">
                        Senior Full-Stack Engineer with 6+ years driving cloud microservices, scalable distributed architectures, and modern React ecosystems.
                      </p>
                    </div>

                    {/* Education Mock */}
                    <div className="pt-0.5">
                      <div className="flex items-center justify-between border-b border-slate-300 pb-0.5 mb-0.5">
                        <span className="font-bold uppercase tracking-wider text-[8px] text-slate-800">Education</span>
                      </div>
                      <div className="flex justify-between text-[7px] text-slate-600">
                        <span className="font-semibold text-slate-800">B.S. in Computer Science</span>
                        <span>2016 – 2020</span>
                      </div>
                    </div>

                    {/* Technical Skills Mock */}
                    <div className="pt-0.5">
                      <div className="flex items-center justify-between border-b border-slate-300 pb-0.5 mb-0.5">
                        <span className="font-bold uppercase tracking-wider text-[8px] text-slate-800">Technical Skills</span>
                      </div>
                      <p className="text-[7px] text-slate-600 truncate">
                        TypeScript, React, Node.js, Python, PostgreSQL, AWS, Docker, Kubernetes
                      </p>
                    </div>
                  </div>

                  {/* Hover Overlay Hint */}
                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                      <Eye className="w-3.5 h-3.5" />
                      Click to Preview Code & Structure
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {tpl.description}
                </p>

                {/* Best For Tag */}
                <div className="p-3 rounded-xl border text-xs" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
                  🎯 Best For: <strong style={{ color: 'var(--text-primary)' }}>{tpl.bestFor}</strong>
                </div>

                {/* Key Features List */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                    Architecture Highlights
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {tpl.features?.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* LaTeX Engine Meta */}
                <div className="flex items-center justify-between pt-2 border-t text-xs" style={{ borderColor: 'var(--border-separator)', color: 'var(--text-tertiary)' }}>
                  <span>Engine: <strong style={{ color: 'var(--text-secondary)' }}>{tpl.engine}</strong></span>
                  <span>Geometry: <strong style={{ color: 'var(--text-secondary)' }}>{tpl.geometry}</strong></span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-between gap-3 pt-5 mt-5 border-t" style={{ borderColor: 'var(--border-separator)' }}>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openPreviewModal(tpl)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--border-base)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                    <span>Preview Code</span>
                  </button>

                  <button
                    onClick={() => handleDownloadSampleTex(tpl)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--border-base)',
                      color: 'var(--text-secondary)',
                    }}
                    title="Download .tex sample source"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                    <span>.tex</span>
                  </button>
                </div>

                <button
                  onClick={() => handleUseTemplate(tpl.templateId)}
                  disabled={creatingTemplateId === tpl.templateId}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {creatingTemplateId === tpl.templateId ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <span>Use Template</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Preview Modal */}
      {selectedPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div
            className="border rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b flex items-center justify-between" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-base)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    {selectedPreview.name}
                    <span className="text-xs font-normal" style={{ color: 'var(--text-tertiary)' }}>({selectedPreview.subtitle})</span>
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    A4 Paper • {selectedPreview.engine} • ATS {selectedPreview.atsRating} ({selectedPreview.atsScore}%)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLatex}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)', color: 'var(--text-primary)' }}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy LaTeX'}</span>
                </button>

                <button
                  onClick={() => handleDownloadSampleTex(selectedPreview)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)', color: 'var(--text-primary)' }}
                >
                  <Download className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Download .tex</span>
                </button>

                <button
                  onClick={() => setSelectedPreview(null)}
                  className="p-1.5 rounded-lg transition-all"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Tabs or Code View */}
            <div className="flex-1 overflow-auto p-4" style={{ backgroundColor: 'var(--bg-base)' }}>
              <div className="rounded-xl border p-4 font-mono text-xs" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-base)', color: 'var(--text-primary)' }}>
                <div className="flex items-center justify-between pb-2 mb-3 border-b text-[11px]" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-tertiary)' }}>
                  <span>compilable_resume.tex</span>
                  <span>100% Compilable Standalone</span>
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[55vh]" style={{ color: 'var(--text-primary)' }}>
                  {previewLatex}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t flex items-center justify-between" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-base)' }}>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Mandatory order: Summary → Education → Skills → Experience → Projects → Certifications → Referees
              </span>

              <button
                onClick={() => {
                  setSelectedPreview(null);
                  handleUseTemplate(selectedPreview.templateId);
                }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-all cursor-pointer"
              >
                <span>Use This Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
