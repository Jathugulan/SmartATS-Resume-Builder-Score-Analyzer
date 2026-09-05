import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Save,
  Sparkles,
  Layers,
  ArrowLeft,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Code2,
  GraduationCap,
  Briefcase,
  Terminal,
  Award,
  Users,
  User,
  FileText,
} from 'lucide-react';
import { builderApi } from '../api/builderApi';
import ResumeLivePreview from '../components/builder/ResumeLivePreview';
import { generateClientLatex } from '../utils/clientLatexRenderer';

// Default initial state with clean placeholder data
const DEFAULT_RESUME_DATA = {
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

const SECTIONS = [
  { id: 'personal', name: 'Personal Information', icon: User },
  { id: 'summary', name: '1. Professional Summary', icon: FileText },
  { id: 'education', name: '2. Education', icon: GraduationCap },
  { id: 'skills', name: '3. Technical Skills', icon: Terminal },
  { id: 'experience', name: '4. Experience', icon: Briefcase },
  { id: 'projects', name: '5. Projects', icon: Code2 },
  { id: 'certifications', name: '6. Certifications', icon: Award },
  { id: 'referees', name: '7. Referees', icon: Users },
];

export default function ResumeEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Template state
  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    return localStorage.getItem('ats_selected_template') || 'template-01';
  });

  const [resume, setResume] = useState(() => {
    const cached = localStorage.getItem('ats_builder_data');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_RESUME_DATA;
  });

  const [activeSection, setActiveSection] = useState('personal');
  const [latexSource, setLatexSource] = useState('');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));

  // Load from backend if ID is provided
  useEffect(() => {
    if (id) {
      loadResumeFromApi(id);
    }
  }, [id]);

  const loadResumeFromApi = async (resumeId) => {
    setLoading(true);
    try {
      const res = await builderApi.getResumeById(resumeId);
      if (res) {
        setResume(res);
        if (res.templateId) {
          setSelectedTemplate(res.templateId);
        }
      }
    } catch (err) {
      console.warn('Could not load resume from backend; using local state:', err);
    } finally {
      setLoading(false);
    }
  };

  // Re-generate LaTeX immediately on any state change
  useEffect(() => {
    const code = generateClientLatex(resume, selectedTemplate);
    setLatexSource(code);
    localStorage.setItem('ats_builder_data', JSON.stringify(resume));
    localStorage.setItem('ats_selected_template', selectedTemplate);
  }, [resume, selectedTemplate]);

  // Handle template switch
  const handleTemplateChange = (tplId) => {
    setSelectedTemplate(tplId);
    setResume((prev) => ({ ...prev, templateId: tplId }));
  };

  // Save to backend if authenticated, or localStorage
  const handleSave = async () => {
    setSaving(true);
    try {
      if (resume._id || id) {
        const targetId = resume._id || id;
        const updated = await builderApi.updateResume(targetId, {
          ...resume,
          templateId: selectedTemplate,
        });
        setResume(updated);
      } else {
        const token = localStorage.getItem('ats_token');
        if (token) {
          const created = await builderApi.createResume({
            ...resume,
            title: `${resume.personal?.fullName || 'My'} Resume`,
            templateId: selectedTemplate,
          });
          setResume(created);
          navigate(`/builder/${created._id}`, { replace: true });
        }
      }
      setLastSaved(new Date());
    } catch (err) {
      console.warn('Cloud save error:', err);
      setLastSaved(new Date());
    } finally {
      setSaving(false);
    }
  };

  // Reset form
  const handleResetForm = () => {
    if (window.confirm('Reset all form fields to default sample data? (Your changes will be overwritten)')) {
      setResume(DEFAULT_RESUME_DATA);
      setLastSaved(null);
    }
  };

  // Personal info updater
  const handlePersonalChange = (field, val) => {
    setResume((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: val },
    }));
  };

  // ----------------------------------------------------
  // Dynamic Arrays Handlers
  // ----------------------------------------------------

  // Education
  const addEducation = () => {
    setResume((prev) => ({
      ...prev,
      education: [
        ...(prev.education || []),
        { degree: '', institution: '', location: '', startDate: '', endDate: '', grade: '', description: '' },
      ],
    }));
  };

  const updateEducation = (index, field, val) => {
    setResume((prev) => {
      const list = [...(prev.education || [])];
      list[index] = { ...list[index], [field]: val };
      return { ...prev, education: list };
    });
  };

  const removeEducation = (index) => {
    setResume((prev) => ({
      ...prev,
      education: (prev.education || []).filter((_, i) => i !== index),
    }));
  };

  // Technical Skills
  const addSkillCategory = () => {
    setResume((prev) => ({
      ...prev,
      technicalSkills: [
        ...(prev.technicalSkills || []),
        { category: 'New Category', skills: '' },
      ],
    }));
  };

  const updateSkillCategory = (index, field, val) => {
    setResume((prev) => {
      const list = [...(prev.technicalSkills || [])];
      list[index] = { ...list[index], [field]: val };
      return { ...prev, technicalSkills: list };
    });
  };

  const removeSkillCategory = (index) => {
    setResume((prev) => ({
      ...prev,
      technicalSkills: (prev.technicalSkills || []).filter((_, i) => i !== index),
    }));
  };

  // Experience
  const addExperience = () => {
    setResume((prev) => ({
      ...prev,
      experience: [
        ...(prev.experience || []),
        {
          role: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          employmentType: 'Full-time',
          bulletPoints: [''],
        },
      ],
    }));
  };

  const updateExperience = (index, field, val) => {
    setResume((prev) => {
      const list = [...(prev.experience || [])];
      list[index] = { ...list[index], [field]: val };
      return { ...prev, experience: list };
    });
  };

  const removeExperience = (index) => {
    setResume((prev) => ({
      ...prev,
      experience: (prev.experience || []).filter((_, i) => i !== index),
    }));
  };

  const addExperienceBullet = (expIndex) => {
    setResume((prev) => {
      const list = [...(prev.experience || [])];
      const bullets = [...(list[expIndex]?.bulletPoints || []), ''];
      list[expIndex] = { ...list[expIndex], bulletPoints: bullets };
      return { ...prev, experience: list };
    });
  };

  const updateExperienceBullet = (expIndex, bulletIndex, val) => {
    setResume((prev) => {
      const list = [...(prev.experience || [])];
      const bullets = [...(list[expIndex]?.bulletPoints || [])];
      bullets[bulletIndex] = val;
      list[expIndex] = { ...list[expIndex], bulletPoints: bullets };
      return { ...prev, experience: list };
    });
  };

  const removeExperienceBullet = (expIndex, bulletIndex) => {
    setResume((prev) => {
      const list = [...(prev.experience || [])];
      const bullets = (list[expIndex]?.bulletPoints || []).filter((_, i) => i !== bulletIndex);
      list[expIndex] = { ...list[expIndex], bulletPoints: bullets };
      return { ...prev, experience: list };
    });
  };

  // Projects
  const addProject = () => {
    setResume((prev) => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        {
          name: '',
          technologies: '',
          date: '',
          github: '',
          url: '',
          description: '',
          bulletPoints: [''],
        },
      ],
    }));
  };

  const updateProject = (index, field, val) => {
    setResume((prev) => {
      const list = [...(prev.projects || [])];
      list[index] = { ...list[index], [field]: val };
      return { ...prev, projects: list };
    });
  };

  const removeProject = (index) => {
    setResume((prev) => ({
      ...prev,
      projects: (prev.projects || []).filter((_, i) => i !== index),
    }));
  };

  const addProjectBullet = (projIndex) => {
    setResume((prev) => {
      const list = [...(prev.projects || [])];
      const bullets = [...(list[projIndex]?.bulletPoints || []), ''];
      list[projIndex] = { ...list[projIndex], bulletPoints: bullets };
      return { ...prev, projects: list };
    });
  };

  const updateProjectBullet = (projIndex, bulletIndex, val) => {
    setResume((prev) => {
      const list = [...(prev.projects || [])];
      const bullets = [...(list[projIndex]?.bulletPoints || [])];
      bullets[bulletIndex] = val;
      list[projIndex] = { ...list[projIndex], bulletPoints: bullets };
      return { ...prev, projects: list };
    });
  };

  const removeProjectBullet = (projIndex, bulletIndex) => {
    setResume((prev) => {
      const list = [...(prev.projects || [])];
      const bullets = (list[projIndex]?.bulletPoints || []).filter((_, i) => i !== bulletIndex);
      list[projIndex] = { ...list[projIndex], bulletPoints: bullets };
      return { ...prev, projects: list };
    });
  };

  // Certifications
  const addCertification = () => {
    setResume((prev) => ({
      ...prev,
      certifications: [
        ...(prev.certifications || []),
        { name: '', issuer: '', date: '', credentialId: '', url: '' },
      ],
    }));
  };

  const updateCertification = (index, field, val) => {
    setResume((prev) => {
      const list = [...(prev.certifications || [])];
      list[index] = { ...list[index], [field]: val };
      return { ...prev, certifications: list };
    });
  };

  const removeCertification = (index) => {
    setResume((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).filter((_, i) => i !== index),
    }));
  };

  // Referees
  const addReferee = () => {
    setResume((prev) => ({
      ...prev,
      referees: [
        ...(prev.referees || []),
        { fullName: '', position: '', organization: '', email: '', phone: '', relationship: '' },
      ],
    }));
  };

  const updateReferee = (index, field, val) => {
    setResume((prev) => {
      const list = [...(prev.referees || [])];
      list[index] = { ...list[index], [field]: val };
      return { ...prev, referees: list };
    });
  };

  const removeReferee = (index) => {
    setResume((prev) => ({
      ...prev,
      referees: (prev.referees || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-[1700px] mx-auto space-y-4">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/templates')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
            title="Back to Template Gallery"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">
                LaTeX Resume Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                Single Data Architecture
              </span>
            </div>
            <p className="text-xs text-slate-400">
              One common form • Exactly 4 ATS templates in strict section order
            </p>
          </div>
        </div>

        {/* Template Selector & Save Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400 font-medium">Template:</span>
            <select
              value={selectedTemplate}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="template-01" className="bg-slate-900 text-white">01 – Classic Professional</option>
              <option value="template-02" className="bg-slate-900 text-white">02 – Modern ATS</option>
              <option value="template-03" className="bg-slate-900 text-white">03 – ModernCV Professional</option>
              <option value="template-04" className="bg-slate-900 text-white">04 – Minimal Developer</option>
            </select>
          </div>

          <button
            onClick={handleResetForm}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
            title="Reset Form to Defaults"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Grid: Left Side (Form) | Right Side (Live Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden">
        {/* LEFT COLUMN: Dynamic Resume Information Form (5 cols on large screens) */}
        <div className="lg:col-span-6 flex flex-col bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          {/* Section Navigation Tabs */}
          <div className="p-2 bg-slate-950/80 border-b border-slate-800 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{sec.name}</span>
                </button>
              );
            })}
          </div>

          {/* Form Scroll Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* SECTION 0: PERSONAL INFORMATION */}
            {activeSection === 'personal' && (
              <div className="space-y-4 animate-fade-in">
                <div className="border-b border-slate-800 pb-2">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-400" />
                    Personal Information
                  </h2>
                  <p className="text-xs text-slate-400">Basic contact coordinates for header formatting across all templates.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={resume.personal?.fullName || ''}
                      onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Location *</label>
                    <input
                      type="text"
                      value={resume.personal?.location || ''}
                      onChange={(e) => handlePersonalChange('location', e.target.value)}
                      placeholder="e.g. San Francisco, CA"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number *</label>
                    <input
                      type="text"
                      value={resume.personal?.phone || ''}
                      onChange={(e) => handlePersonalChange('phone', e.target.value)}
                      placeholder="e.g. +1 (555) 234-5678"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Gmail / Email *</label>
                    <input
                      type="email"
                      value={resume.personal?.email || ''}
                      onChange={(e) => handlePersonalChange('email', e.target.value)}
                      placeholder="e.g. alex.morgan@email.com"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Link</label>
                    <input
                      type="text"
                      value={resume.personal?.github || ''}
                      onChange={(e) => handlePersonalChange('github', e.target.value)}
                      placeholder="https://github.com/alexmorgan"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn Link</label>
                    <input
                      type="text"
                      value={resume.personal?.linkedin || ''}
                      onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                      placeholder="https://linkedin.com/in/alexmorgan"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 1: PROFESSIONAL SUMMARY */}
            {activeSection === 'summary' && (
              <div className="space-y-4 animate-fade-in">
                <div className="border-b border-slate-800 pb-2">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    1. Professional Summary
                  </h2>
                  <p className="text-xs text-slate-400">Concise overview highlighting core competencies and career achievements.</p>
                </div>

                <div>
                  <textarea
                    rows={6}
                    value={resume.summary || ''}
                    onChange={(e) => setResume((prev) => ({ ...prev, summary: e.target.value }))}
                    placeholder="Results-driven professional with expertise in..."
                    className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white leading-relaxed focus:border-indigo-500 focus:outline-none resize-none font-sans"
                  />
                  <div className="flex justify-between items-center mt-1 text-[11px] text-slate-500">
                    <span>Character-friendly writing area</span>
                    <span>{(resume.summary || '').length} characters</span>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 2: EDUCATION */}
            {activeSection === 'education' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-indigo-400" />
                      2. Education
                    </h2>
                    <p className="text-xs text-slate-400">Academic degrees, universities, GPAs, and relevant coursework.</p>
                  </div>
                  <button
                    onClick={addEducation}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Degree
                  </button>
                </div>

                {(resume.education || []).map((ed, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 relative group">
                    <button
                      onClick={() => removeEducation(idx)}
                      className="absolute top-3 right-3 p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-900 transition-all cursor-pointer"
                      title="Remove Education Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-6">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Degree / Qualification</label>
                        <input
                          type="text"
                          value={ed.degree}
                          onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                          placeholder="e.g. B.S. in Computer Science"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Institution</label>
                        <input
                          type="text"
                          value={ed.institution}
                          onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                          placeholder="e.g. UC Berkeley"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Location</label>
                        <input
                          type="text"
                          value={ed.location}
                          onChange={(e) => updateEducation(idx, 'location', e.target.value)}
                          placeholder="e.g. Berkeley, CA"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">GPA / CGPA</label>
                        <input
                          type="text"
                          value={ed.grade}
                          onChange={(e) => updateEducation(idx, 'grade', e.target.value)}
                          placeholder="e.g. 3.85 / 4.0"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Start Date</label>
                        <input
                          type="text"
                          value={ed.startDate}
                          onChange={(e) => updateEducation(idx, 'startDate', e.target.value)}
                          placeholder="e.g. 2018"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">End Date</label>
                        <input
                          type="text"
                          value={ed.endDate}
                          onChange={(e) => updateEducation(idx, 'endDate', e.target.value)}
                          placeholder="e.g. 2022"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Description / Relevant Coursework</label>
                      <input
                        type="text"
                        value={ed.description}
                        onChange={(e) => updateEducation(idx, 'description', e.target.value)}
                        placeholder="e.g. Relevant Coursework: Data Structures & Algorithms, Distributed Systems"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SECTION 3: TECHNICAL SKILLS */}
            {activeSection === 'skills' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-indigo-400" />
                      3. Technical Skills
                    </h2>
                    <p className="text-xs text-slate-400">Add skill categories (e.g. Programming Languages, Databases, Cloud).</p>
                  </div>
                  <button
                    onClick={addSkillCategory}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Category
                  </button>
                </div>

                {(resume.technicalSkills || []).map((cat, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 relative group">
                    <button
                      onClick={() => removeSkillCategory(idx)}
                      className="absolute top-3 right-3 p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-900 transition-all cursor-pointer"
                      title="Remove Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-6">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Category Name</label>
                        <input
                          type="text"
                          value={cat.category}
                          onChange={(e) => updateSkillCategory(idx, 'category', e.target.value)}
                          placeholder="e.g. Programming Languages"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Skills (comma-separated)</label>
                        <input
                          type="text"
                          value={cat.skills}
                          onChange={(e) => updateSkillCategory(idx, 'skills', e.target.value)}
                          placeholder="e.g. Python, TypeScript, React, Docker, AWS"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SECTION 4: EXPERIENCE */}
            {activeSection === 'experience' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-indigo-400" />
                      4. Experience
                    </h2>
                    <p className="text-xs text-slate-400">Professional work history with impactful bullet points.</p>
                  </div>
                  <button
                    onClick={addExperience}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Job
                  </button>
                </div>

                {(resume.experience || []).map((exp, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 relative group">
                    <button
                      onClick={() => removeExperience(idx)}
                      className="absolute top-3 right-3 p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-900 transition-all cursor-pointer"
                      title="Remove Experience"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-6">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Job Title *</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                          placeholder="e.g. Senior Software Engineer"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Company / Organization *</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                          placeholder="e.g. TechNova Solutions"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Location</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => updateExperience(idx, 'location', e.target.value)}
                          placeholder="e.g. San Francisco, CA"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Start Date</label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(idx, 'startDate', e.target.value)}
                          placeholder="e.g. 2022"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">End Date</label>
                        <input
                          type="text"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(idx, 'endDate', e.target.value)}
                          placeholder="e.g. Present"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Employment Type</label>
                        <input
                          type="text"
                          value={exp.employmentType || ''}
                          onChange={(e) => updateExperience(idx, 'employmentType', e.target.value)}
                          placeholder="e.g. Full-time, Internship"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Bullet points */}
                    <div className="space-y-2 pt-2 border-t border-slate-800/60">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-slate-300">Responsibilities / Achievements</label>
                        <button
                          onClick={() => addExperienceBullet(idx)}
                          className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer font-medium"
                        >
                          <Plus className="w-3 h-3" /> Add Bullet
                        </button>
                      </div>

                      {(exp.bulletPoints || []).map((bp, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2">
                          <span className="text-slate-500 text-xs">•</span>
                          <input
                            type="text"
                            value={bp}
                            onChange={(e) => updateExperienceBullet(idx, bIdx, e.target.value)}
                            placeholder="Engineered scalable architecture..."
                            className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                          />
                          <button
                            onClick={() => removeExperienceBullet(idx, bIdx)}
                            className="p-1 text-slate-500 hover:text-red-400 transition-all cursor-pointer"
                            title="Remove bullet point"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SECTION 5: PROJECTS */}
            {activeSection === 'projects' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-indigo-400" />
                      5. Projects
                    </h2>
                    <p className="text-xs text-slate-400">Personal & technical projects with repository links and feature highlights.</p>
                  </div>
                  <button
                    onClick={addProject}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Project
                  </button>
                </div>

                {(resume.projects || []).map((proj, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 relative group">
                    <button
                      onClick={() => removeProject(idx)}
                      className="absolute top-3 right-3 p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-900 transition-all cursor-pointer"
                      title="Remove Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-6">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Project Name *</label>
                        <input
                          type="text"
                          value={proj.name}
                          onChange={(e) => updateProject(idx, 'name', e.target.value)}
                          placeholder="e.g. CloudPulse Platform"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Technologies</label>
                        <input
                          type="text"
                          value={Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies || ''}
                          onChange={(e) => updateProject(idx, 'technologies', e.target.value)}
                          placeholder="e.g. Go, React, Prometheus"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Date</label>
                        <input
                          type="text"
                          value={proj.date || proj.startDate || ''}
                          onChange={(e) => updateProject(idx, 'date', e.target.value)}
                          placeholder="e.g. 2023"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">GitHub URL</label>
                        <input
                          type="text"
                          value={proj.github || ''}
                          onChange={(e) => updateProject(idx, 'github', e.target.value)}
                          placeholder="https://github.com/..."
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Live Demo URL</label>
                        <input
                          type="text"
                          value={proj.url || ''}
                          onChange={(e) => updateProject(idx, 'url', e.target.value)}
                          placeholder="https://demo-app.com"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Short Description</label>
                      <input
                        type="text"
                        value={proj.description || ''}
                        onChange={(e) => updateProject(idx, 'description', e.target.value)}
                        placeholder="Brief summary of the architecture and goals..."
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    {/* Project bullet points */}
                    <div className="space-y-2 pt-2 border-t border-slate-800/60">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-slate-300">Feature / Achievement Bullet Points</label>
                        <button
                          onClick={() => addProjectBullet(idx)}
                          className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer font-medium"
                        >
                          <Plus className="w-3 h-3" /> Add Bullet
                        </button>
                      </div>

                      {(proj.bulletPoints || []).map((bp, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2">
                          <span className="text-slate-500 text-xs">•</span>
                          <input
                            type="text"
                            value={bp}
                            onChange={(e) => updateProjectBullet(idx, bIdx, e.target.value)}
                            placeholder="Built distributed metrics collection agent..."
                            className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                          />
                          <button
                            onClick={() => removeProjectBullet(idx, bIdx)}
                            className="p-1 text-slate-500 hover:text-red-400 transition-all cursor-pointer"
                            title="Remove bullet point"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SECTION 6: CERTIFICATIONS */}
            {activeSection === 'certifications' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Award className="w-4 h-4 text-indigo-400" />
                      6. Certifications
                    </h2>
                    <p className="text-xs text-slate-400">Industry credentials, certifications, and licenses.</p>
                  </div>
                  <button
                    onClick={addCertification}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Certificate
                  </button>
                </div>

                {(resume.certifications || []).map((cert, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 relative group">
                    <button
                      onClick={() => removeCertification(idx)}
                      className="absolute top-3 right-3 p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-900 transition-all cursor-pointer"
                      title="Remove Certificate"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-6">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Certificate Name *</label>
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => updateCertification(idx, 'name', e.target.value)}
                          placeholder="e.g. AWS Certified Solutions Architect"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Issuing Organization</label>
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => updateCertification(idx, 'issuer', e.target.value)}
                          placeholder="e.g. Amazon Web Services"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Date</label>
                        <input
                          type="text"
                          value={cert.date}
                          onChange={(e) => updateCertification(idx, 'date', e.target.value)}
                          placeholder="e.g. 2023"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Credential URL / ID</label>
                        <input
                          type="text"
                          value={cert.credentialId || cert.url || ''}
                          onChange={(e) => updateCertification(idx, 'credentialId', e.target.value)}
                          placeholder="e.g. AWS-PSA-89421"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SECTION 7: REFEREES */}
            {activeSection === 'referees' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-indigo-400" />
                      7. Referees
                    </h2>
                    <p className="text-xs text-slate-400">Professional or academic references with contact coordinates.</p>
                  </div>
                  <button
                    onClick={addReferee}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Referee
                  </button>
                </div>

                {(resume.referees || []).map((ref, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 relative group">
                    <button
                      onClick={() => removeReferee(idx)}
                      className="absolute top-3 right-3 p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-900 transition-all cursor-pointer"
                      title="Remove Referee"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-6">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Full Name *</label>
                        <input
                          type="text"
                          value={ref.fullName}
                          onChange={(e) => updateReferee(idx, 'fullName', e.target.value)}
                          placeholder="e.g. Dr. Sarah Jenkins"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Position / Job Title</label>
                        <input
                          type="text"
                          value={ref.position}
                          onChange={(e) => updateReferee(idx, 'position', e.target.value)}
                          placeholder="e.g. VP of Engineering"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Organization / Company</label>
                        <input
                          type="text"
                          value={ref.organization}
                          onChange={(e) => updateReferee(idx, 'organization', e.target.value)}
                          placeholder="e.g. TechNova Solutions"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Email</label>
                        <input
                          type="email"
                          value={ref.email}
                          onChange={(e) => updateReferee(idx, 'email', e.target.value)}
                          placeholder="e.g. sjenkins@technova.io"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Phone</label>
                        <input
                          type="text"
                          value={ref.phone}
                          onChange={(e) => updateReferee(idx, 'phone', e.target.value)}
                          placeholder="e.g. +1 (555) 987-6543"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Optional Relationship / Description</label>
                        <input
                          type="text"
                          value={ref.relationship}
                          onChange={(e) => updateReferee(idx, 'relationship', e.target.value)}
                          placeholder="e.g. Direct Manager, Research Advisor"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Live Resume Preview & LaTeX Source (6 cols on large screens) */}
        <div className="lg:col-span-6 h-full min-h-[500px]">
          <ResumeLivePreview
            resume={resume}
            latexSource={latexSource}
            currentTemplate={selectedTemplate}
            onTemplateChange={handleTemplateChange}
          />
        </div>
      </div>
    </div>
  );
}
