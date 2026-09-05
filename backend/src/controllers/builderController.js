const Resume = require('../models/Resume');
const ResumeVersion = require('../models/ResumeVersion');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const { renderLatexResume } = require('../services/latexTemplateRenderer');
const { compileLatexToPdf } = require('../services/latexCompilerService');
const { createOverleafZip, createApplicationPackageZip } = require('../services/exportService');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Get all resumes for current user
 */
const getResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    return successResponse(res, { resumes }, 'Resumes retrieved successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new resume
 */
const createResume = async (req, res, next) => {
  try {
    const resume = new Resume({
      userId: req.user._id,
      title: req.body.title || 'My Professional Resume',
      targetRole: req.body.targetRole || 'Software Engineer',
      templateId: req.body.templateId || 'template-01',
      personal: {
        fullName: req.user.name || 'Candidate Name',
        email: req.user.email || 'candidate@email.com',
        phone: req.body.personal?.phone || '',
        location: req.body.personal?.location || '',
        linkedin: req.body.personal?.linkedin || '',
        github: req.body.personal?.github || '',
      },
      skills: req.body.skills || {
        technical: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
        programmingLanguages: ['JavaScript', 'TypeScript'],
        frameworks: ['React', 'Node.js', 'Express'],
      },
      summary: req.body.summary || 'Results-driven software engineer with experience developing scalable web applications.',
    });

    await resume.save();

    // Create Initial Version
    await ResumeVersion.create({
      resumeId: resume._id,
      userId: req.user._id,
      versionNumber: 1,
      versionName: 'Version 1.0 (Initial Draft)',
      targetRole: resume.targetRole,
      templateId: resume.templateId,
      contentSnapshot: resume.toObject(),
    });

    return successResponse(res, { resume }, 'Resume created successfully', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Get single resume by ID
 */
const getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return errorResponse(res, 'Resume not found', 'NOT_FOUND', 404);
    }
    return successResponse(res, { resume }, 'Resume retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Update resume details
 */
const updateResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: req.body },
      { new: true }
    );
    if (!resume) {
      return errorResponse(res, 'Resume not found', 'NOT_FOUND', 404);
    }
    return successResponse(res, { resume }, 'Resume updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Delete resume
 */
const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return errorResponse(res, 'Resume not found', 'NOT_FOUND', 404);
    }
    await ResumeVersion.deleteMany({ resumeId: req.params.id });
    return successResponse(res, { id: req.params.id }, 'Resume deleted successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Render pure LaTeX source
 */
const renderResumeLatex = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return errorResponse(res, 'Resume not found', 'NOT_FOUND', 404);
    }
    const templateId = req.query.templateId || resume.templateId || 'template-01';
    const latexSource = renderLatexResume(resume.toObject(), templateId);
    return successResponse(res, { latexSource, templateId }, 'LaTeX rendered successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Compile resume to vector PDF
 */
const compileResumePdf = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return errorResponse(res, 'Resume not found', 'NOT_FOUND', 404);
    }
    const templateId = req.query.templateId || resume.templateId || 'template-01';
    const latexSource = renderLatexResume(resume.toObject(), templateId);
    const { pdfBuffer, compiler, logs } = await compileLatexToPdf(latexSource, resume.toObject(), templateId);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="resume_${resume.personal?.fullName?.replace(/\s+/g, '_') || 'candidate'}.pdf"`);
    return res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
};

/**
 * Export Overleaf Project ZIP
 */
const exportOverleafZip = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return errorResponse(res, 'Resume not found', 'NOT_FOUND', 404);
    }
    const templateId = req.query.templateId || resume.templateId || 'template-01';
    const zipBuffer = createOverleafZip(resume.toObject(), templateId);

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="Overleaf_${resume.personal?.fullName?.replace(/\s+/g, '_') || 'Resume'}_Project.zip"`);
    return res.send(zipBuffer);
  } catch (err) {
    next(err);
  }
};

/**
 * Export Complete Application Package ZIP
 */
const exportPackageZip = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return errorResponse(res, 'Resume not found', 'NOT_FOUND', 404);
    }
    const templateId = req.query.templateId || resume.templateId || 'template-01';
    const coverLetter = req.body.coverLetter || '';
    const zipBuffer = await createApplicationPackageZip(resume.toObject(), coverLetter, templateId);

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="Application_Package_${resume.personal?.fullName?.replace(/\s+/g, '_') || 'Candidate'}.zip"`);
    return res.send(zipBuffer);
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new builder resume pre-populated from an existing ResumeAnalysis
 */
const createResumeFromAnalysis = async (req, res, next) => {

  try {
    const { analysisId } = req.params;
    const analysis = await ResumeAnalysis.findOne({ _id: analysisId, userId: req.user._id });
    if (!analysis) {
      return errorResponse(res, 'Resume analysis not found', 'NOT_FOUND', 404);
    }

    const cand = analysis.candidate || {};
    const personal = {
      fullName: cand.fullName || req.user.name || 'Candidate Name',
      professionalTitle: cand.professionalTitle || analysis.jobDescription?.targetRole || 'Software Engineer',
      email: cand.email || req.user.email || 'candidate@email.com',
      phone: cand.phone || '',
      location: cand.location || '',
      website: cand.portfolio || '',
      github: cand.gitHub || '',
      linkedin: cand.linkedIn || '',
      portfolio: cand.portfolio || '',
    };

    const experience = (analysis.experience || []).map((exp) => ({
      company: exp.company || 'Company',
      role: exp.jobTitle || 'Role',
      location: '',
      startDate: exp.period?.split('-')[0]?.trim() || '',
      endDate: exp.period?.split('-')[1]?.trim() || 'Present',
      current: exp.period ? exp.period.toLowerCase().includes('present') : true,
      description: '',
      bulletPoints: Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0
        ? exp.responsibilities
        : (exp.quantifiedImpact || []),
    }));

    const education = (analysis.education || []).map((edu) => ({
      institution: edu.institution || 'University',
      degree: edu.degree || 'Bachelor of Science',
      field: edu.field || '',
      location: '',
      startDate: '',
      endDate: edu.graduationYear || '',
      grade: edu.gpa || '',
      description: '',
    }));

    const projects = (analysis.projects || []).map((proj) => ({
      name: proj.title || 'Project',
      description: proj.description || '',
      technologies: proj.technologies || [],
      url: proj.link || '',
      github: '',
      startDate: '',
      endDate: '',
      bulletPoints: proj.description ? [proj.description] : [],
    }));

    const techSkills = analysis.skills?.technical || [];
    const toolSkills = analysis.skills?.tools || [];
    const skills = {
      technical: techSkills,
      programmingLanguages: techSkills.filter((s) => ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'SQL'].some((lang) => s.toLowerCase().includes(lang.toLowerCase()))),
      frameworks: techSkills.filter((s) => ['React', 'Node', 'Express', 'Next', 'Vue', 'Angular', 'Django', 'Spring', 'Flask', 'Tailwind'].some((f) => s.toLowerCase().includes(f.toLowerCase()))),
      libraries: [],
      databases: toolSkills.filter((s) => ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase'].some((db) => s.toLowerCase().includes(db.toLowerCase()))),
      cloud: toolSkills.filter((s) => ['AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes'].some((c) => s.toLowerCase().includes(c.toLowerCase()))),
      tools: toolSkills,
      soft: analysis.skills?.soft || [],
      domain: analysis.skills?.domain || [],
    };

    const certifications = (analysis.certifications || []).map((cert) => ({
      name: cert.name || 'Certification',
      issuer: cert.issuingOrganization || '',
      date: cert.date || '',
      credentialId: cert.credentialId || '',
      url: '',
    }));

    const achievements = (analysis.achievements || []).map((ach) => ({
      title: typeof ach === 'string' ? ach : (ach.title || 'Achievement'),
      organization: '',
      date: '',
      description: typeof ach === 'string' ? ach : (ach.description || ''),
    }));

    const resume = new Resume({
      userId: req.user._id,
      title: `${cand.fullName || 'Candidate'}'s ATS Optimized Resume`,
      targetRole: cand.professionalTitle || analysis.jobDescription?.targetRole || 'Software Engineer',
      templateId: 'template-01',
      personal,
      summary: cand.summary || `Results-driven ${cand.professionalTitle || 'Software Engineer'} with hands-on expertise in modern software design and scalable architecture.`,
      experience: experience.length > 0 ? experience : [
        {
          company: 'Tech Solutions Inc',
          role: cand.professionalTitle || 'Software Engineer',
          startDate: '2022',
          endDate: 'Present',
          current: true,
          bulletPoints: ['Engineered scalable web applications and improved ATS delivery pipelines.'],
        },
      ],
      education: education.length > 0 ? education : [
        {
          institution: 'State University',
          degree: 'Bachelor of Science in Computer Science',
          endDate: '2022',
        },
      ],
      projects,
      skills,
      certifications,
      achievements,
    });

    await resume.save();

    await ResumeVersion.create({
      resumeId: resume._id,
      userId: req.user._id,
      versionNumber: 1,
      versionName: `v1.0 (Imported from ATS Analysis: ${analysis.atsScore} pts)`,
      targetRole: resume.targetRole,
      templateId: resume.templateId,
      contentSnapshot: resume.toObject(),
      atsScore: analysis.atsScore,
    });

    return successResponse(res, { resume }, 'Resume created from ATS analysis successfully', 201);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getResumes,
  createResume,
  createResumeFromAnalysis,
  getResumeById,
  updateResume,
  deleteResume,
  renderResumeLatex,
  compileResumePdf,
  exportOverleafZip,
  exportPackageZip,
};

