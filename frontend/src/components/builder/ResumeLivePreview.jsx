import React, { useState } from 'react';
import {
  Download,
  FileCode,
  Archive,
  Eye,
  ZoomIn,
  ZoomOut,
  Mail,
  Phone,
  MapPin,
  Globe,
  Link2,
  ExternalLink,
  Copy,
  Check,
  Package,
  Layers,
  Sparkles,
  Maximize2,
} from 'lucide-react';
import { builderApi } from '../../api/builderApi';
import { downloadTexFile } from '../../utils/clientLatexRenderer';

const TEMPLATE_NAMES = {
  'template-01': 'Template 01: Classic Professional',
  'template-02': 'Template 02: Modern ATS',
  'template-03': 'Template 03: ModernCV Professional',
  'template-04': 'Template 04: Minimal Developer',
};

export default function ResumeLivePreview({
  resume,
  latexSource = '',
  currentTemplate = 'template-01',
  onTemplateChange,
}) {
  const [viewMode, setViewMode] = useState('preview'); // 'preview' | 'latex'
  const [zoom, setZoom] = useState(100);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingTex, setDownloadingTex] = useState(false);
  const [copiedLatex, setCopiedLatex] = useState(false);

  if (!resume) {
    return (
      <div className="h-full flex items-center justify-center p-8 text-slate-500 text-xs">
        No resume data available. Fill in the form on the left to begin.
      </div>
    );
  }

  const {
    personal,
    summary,
    education = [],
    technicalSkills = [],
    skills = {},
    experience = [],
    projects = [],
    certifications = [],
    referees = [],
  } = resume;

  const activeTpl = currentTemplate || resume.templateId || 'template-01';

  // Normalize technical skills for display
  const displaySkills = Array.isArray(technicalSkills) && technicalSkills.length > 0
    ? technicalSkills
    : [
        skills.programmingLanguages?.length && { category: 'Programming Languages', skills: skills.programmingLanguages.join(', ') },
        skills.frameworks?.length && { category: 'Frontend & Frameworks', skills: skills.frameworks.join(', ') },
        (skills.databases?.length || skills.cloud?.length) && { category: 'Databases & Cloud', skills: [...(skills.databases || []), ...(skills.cloud || [])].join(', ') },
        skills.tools?.length && { category: 'Developer Tools', skills: skills.tools.join(', ') },
        skills.technical?.length && !skills.programmingLanguages?.length && { category: 'Core Skills', skills: skills.technical.join(', ') },
      ].filter(Boolean);

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      if (resume._id) {
        await builderApi.downloadPdf(resume._id, activeTpl, personal?.fullName || 'resume');
      } else {
        alert('PDF compilation requires saving to cloud. You can download the .tex file directly right now.');
      }
    } catch (err) {
      alert('Failed to download PDF. Please try again.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadTex = () => {
    setDownloadingTex(true);
    try {
      const fileName = `${(personal?.fullName || 'resume').toLowerCase().replace(/\s+/g, '_')}_${activeTpl}.tex`;
      downloadTexFile(latexSource, fileName);
    } catch (err) {
      alert('Failed to download .tex file.');
    } finally {
      setTimeout(() => setDownloadingTex(false), 800);
    }
  };

  const copyLatexToClipboard = () => {
    if (!latexSource) return;
    navigator.clipboard.writeText(latexSource);
    setCopiedLatex(true);
    setTimeout(() => setCopiedLatex(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950/90 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Action Toolbar */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* View mode toggle & Template Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'preview'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </button>
            <button
              onClick={() => setViewMode('latex')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'latex'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>LaTeX (.tex)</span>
            </button>
          </div>

          {/* Template Switcher Dropdown */}
          {onTemplateChange && (
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-500 font-medium">Design:</span>
              <select
                value={activeTpl}
                onChange={(e) => onTemplateChange(e.target.value)}
                className="bg-transparent text-indigo-300 font-semibold focus:outline-none cursor-pointer pr-1"
              >
                <option value="template-01" className="bg-slate-900 text-white">Template 01 – Classic Professional</option>
                <option value="template-02" className="bg-slate-900 text-white">Template 02 – Modern ATS</option>
                <option value="template-03" className="bg-slate-900 text-white">Template 03 – ModernCV Professional</option>
                <option value="template-04" className="bg-slate-900 text-white">Template 04 – Minimal Developer</option>
              </select>
            </div>
          )}
        </div>

        {/* Zoom & Export Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          {viewMode === 'preview' && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setZoom((z) => Math.max(70, z - 10))}
                className="hover:text-white p-0.5 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] w-10 text-center text-slate-200">{zoom}%</span>
              <button
                onClick={() => setZoom((z) => Math.min(130, z + 10))}
                className="hover:text-white p-0.5 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(100)}
                className="hover:text-white p-0.5 ml-1 text-[10px] text-slate-400 hover:text-indigo-300 cursor-pointer"
                title="Reset Zoom (100%)"
              >
                100%
              </button>
            </div>
          )}

          {/* Download .tex */}
          <button
            onClick={handleDownloadTex}
            disabled={downloadingTex}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
            title="Download complete compilable .tex file"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>{downloadingTex ? 'Saving...' : '.tex'}</span>
          </button>

          {/* Download PDF */}
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
            title="Compile & Download Vector PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadingPdf ? 'Compiling...' : 'PDF'}</span>
          </button>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start bg-slate-950/70">
        {viewMode === 'latex' ? (
          <div className="w-full max-w-4xl rounded-xl bg-slate-900 border border-slate-800 p-4 font-mono text-xs text-slate-300 relative shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">{TEMPLATE_NAMES[activeTpl] || 'LaTeX 2ε Source'}</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-indigo-300 border border-slate-700">A4 • Compilable</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyLatexToClipboard}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all cursor-pointer"
                >
                  {copiedLatex ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLatex ? 'Copied to Clipboard' : 'Copy LaTeX'}</span>
                </button>
                <button
                  onClick={handleDownloadTex}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .tex</span>
                </button>
              </div>
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed text-slate-200 max-h-[75vh]">
              {latexSource || '% Generating LaTeX code from resume model...'}
            </pre>
          </div>
        ) : (
          /* Live Document Render Sheet */
          <div
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
            className={`resume-sheet w-full max-w-[800px] bg-white text-slate-900 rounded-lg shadow-2xl p-8 sm:p-12 transition-transform duration-200 border border-slate-200 min-h-[1050px] ${
              activeTpl === 'template-01' ? 'font-serif' : 'font-sans'
            }`}
          >
            {/* Header: Template-specific styling */}
            {activeTpl === 'template-03' ? (
              /* ModernCV Banking Header */
              <div className="text-center pb-4 border-b border-slate-900">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 uppercase">
                  {personal?.fullName || 'Alex Morgan'}
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-2 text-[11px] text-slate-700">
                  {personal?.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-800" /> {personal.phone}</span>}
                  {personal?.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-800" /> {personal.email}</span>}
                  {personal?.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-800" /> {personal.location}</span>}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-1 text-[11px] text-blue-800">
                  {personal?.linkedin && (
                    <span className="flex items-center gap-1">
                      <Link2 className="w-3 h-3" /> {personal.linkedin.replace(/^https?:\/\//, '')}
                    </span>
                  )}
                  {personal?.github && (
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {personal.github.replace(/^https?:\/\//, '')}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              /* Classic / Modern ATS / Minimal Developer Header */
              <div className="text-center pb-3 border-b border-slate-300">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  {personal?.fullName || 'Alex Morgan'}
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-600">
                  {personal?.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" /> {personal.location}
                    </span>
                  )}
                  {personal?.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-500" /> {personal.phone}
                    </span>
                  )}
                  {personal?.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-500" /> {personal.email}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-0.5 text-xs text-blue-700">
                  {personal?.github && (
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {personal.github.replace(/^https?:\/\//, '')}
                    </span>
                  )}
                  {personal?.linkedin && (
                    <span className="flex items-center gap-1">
                      <Link2 className="w-3 h-3" /> {personal.linkedin.replace(/^https?:\/\//, '')}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* MANDATORY SECTION 1: PROFESSIONAL SUMMARY */}
            {summary && (
              <div className="mt-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-1.5">
                  1. Professional Summary
                </h2>
                <p className="text-xs leading-relaxed text-slate-700 text-justify">{summary}</p>
              </div>
            )}

            {/* MANDATORY SECTION 2: EDUCATION */}
            {education && education.length > 0 && (
              <div className="mt-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                  2. Education
                </h2>
                <div className="space-y-2">
                  {education.map((edu, idx) => (
                    <div key={idx} className="text-xs">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-900">{edu.institution}</span>
                        <span className="text-[11px] text-slate-500">
                          {edu.startDate && edu.endDate ? `${edu.startDate} – ${edu.endDate}` : edu.endDate}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline text-slate-700">
                        <span>
                          {edu.degree}
                          {edu.grade ? ` (GPA: ${edu.grade})` : ''}
                        </span>
                        {edu.location && <span className="text-[11px] text-slate-500">{edu.location}</span>}
                      </div>
                      {edu.description && <p className="text-[11px] text-slate-600 mt-0.5">{edu.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MANDATORY SECTION 3: TECHNICAL SKILLS */}
            {displaySkills && displaySkills.length > 0 && (
              <div className="mt-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-1.5">
                  3. Technical Skills
                </h2>
                <div className="text-xs space-y-1 text-slate-700">
                  {displaySkills.map((ts, idx) => (
                    <p key={idx}>
                      <strong className="text-slate-900">{ts.category}:</strong> {ts.skills}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* MANDATORY SECTION 4: EXPERIENCE */}
            {experience && experience.length > 0 && (
              <div className="mt-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                  4. Experience
                </h2>
                <div className="space-y-3">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="text-xs">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-900">
                          {exp.company}
                          {exp.employmentType ? <span className="font-normal text-slate-500"> ({exp.employmentType})</span> : ''}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {exp.startDate} {exp.startDate && exp.endDate ? '–' : ''} {exp.endDate || 'Present'}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline text-slate-700">
                        <span className="italic">{exp.role}</span>
                        {exp.location && <span className="text-[11px] text-slate-500">{exp.location}</span>}
                      </div>

                      {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                        <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-slate-700 leading-snug">
                          {exp.bulletPoints.map((bp, bIdx) => (
                            <li key={bIdx}>{bp}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MANDATORY SECTION 5: PROJECTS */}
            {projects && projects.length > 0 && (
              <div className="mt-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                  5. Projects
                </h2>
                <div className="space-y-2.5">
                  {projects.map((proj, idx) => (
                    <div key={idx} className="text-xs">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-900">
                          {proj.name}
                          {proj.technologies && (
                            <span className="font-normal text-slate-600 text-[11px]">
                              {' '}
                              | {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                            </span>
                          )}
                        </span>
                        {(proj.date || proj.endDate) && (
                          <span className="text-[11px] text-slate-500 font-normal">{proj.date || proj.endDate}</span>
                        )}
                      </div>
                      {(proj.url || proj.github) && (
                        <div className="text-[11px] text-blue-700">
                          {(proj.url || proj.github).replace(/^https?:\/\//, '')}
                        </div>
                      )}
                      {proj.description && <p className="text-slate-700 mt-0.5 leading-snug">{proj.description}</p>}
                      {proj.bulletPoints && proj.bulletPoints.length > 0 && (
                        <ul className="list-disc list-outside ml-4 mt-0.5 space-y-0.5 text-slate-700 text-[11px]">
                          {proj.bulletPoints.map((bp, bIdx) => (
                            <li key={bIdx}>{bp}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MANDATORY SECTION 6: CERTIFICATIONS */}
            {certifications && certifications.length > 0 && (
              <div className="mt-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-1.5">
                  6. Certifications
                </h2>
                <div className="space-y-1 text-xs text-slate-700">
                  {certifications.map((cert, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>
                        <strong className="text-slate-900">{cert.name}</strong>
                        {cert.issuer ? ` – ${cert.issuer}` : ''}
                        {cert.credentialId ? ` (ID: ${cert.credentialId})` : ''}
                      </span>
                      {cert.date && <span className="text-slate-500 text-[11px]">{cert.date}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MANDATORY SECTION 7: REFEREES */}
            {referees && referees.length > 0 && (
              <div className="mt-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-1.5">
                  7. Referees
                </h2>
                <div className="space-y-1.5 text-xs text-slate-700">
                  {referees.map((ref, idx) => (
                    <div key={idx}>
                      <span className="font-bold text-slate-900">
                        {ref.fullName}
                      </span>{' '}
                      – {ref.position}, {ref.organization}
                      <div className="text-[11px] text-slate-600">
                        {ref.email && <span>Email: {ref.email}</span>}
                        {ref.phone && <span className="ml-2">| Phone: {ref.phone}</span>}
                        {ref.relationship && <span className="ml-2">| Relationship: {ref.relationship}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
