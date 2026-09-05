const Resume = require('../models/Resume');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const JobMatch = require('../models/JobMatch');
const { analyzeResumeAts } = require('../services/smartAtsAnalyzerService');
const { renderLatexResume } = require('../services/latexTemplateRenderer');
const { compileLatexToPdf } = require('../services/latexCompilerService');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * GET /api/resumes
 * Retrieve all resumes belonging to the authenticated user
 */
const getResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    return successResponse(res, resumes, 'User resumes retrieved successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/resumes
 * Create a new resume with defaults
 */
const createResume = async (req, res, next) => {
  try {
    const { title, templateId, personal, summary, education, technicalSkills, experience, projects, certifications, referees } = req.body;

    const newResume = new Resume({
      userId: req.user._id,
      title: title || 'My ATS Resume',
      templateId: templateId || 'template-01',
      personal: personal || {
        fullName: req.user.name || 'Alex Morgan',
        professionalTitle: 'Software Engineer',
        email: req.user.email || 'alex.morgan@email.com',
        phone: '+1 (555) 234-5678',
        location: 'San Francisco, CA',
        github: 'github.com/alexmorgan',
        linkedin: 'linkedin.com/in/alexmorgan',
        portfolio: 'alexmorgan.dev',
      },
      summary: summary || 'Results-driven Software Engineer with 4+ years of experience designing scalable distributed web architectures, high-throughput microservices, and responsive user interfaces.',
      education: education || [
        {
          degree: 'Bachelor of Science in Computer Science',
          institution: 'University of California, Berkeley',
          location: 'Berkeley, CA',
          startDate: '2018',
          endDate: '2022',
          grade: '3.8 GPA',
          description: 'Specialized in Distributed Systems and Algorithms.',
        },
      ],
      technicalSkills: technicalSkills || [
        { category: 'Programming Languages', skills: 'TypeScript, JavaScript, Python, Go, SQL' },
        { category: 'Frontend & UI', skills: 'React, Next.js, Tailwind CSS, Redux Toolkit, HTML5/CSS3' },
        { category: 'Backend & Cloud', skills: 'Node.js, Express, PostgreSQL, MongoDB, Redis, Docker, AWS' },
        { category: 'Tools & DevOps', skills: 'Git, GitHub Actions, Linux, Jest, Vite' },
      ],
      experience: experience || [
        {
          jobTitle: 'Senior Full Stack Engineer',
          role: 'Senior Full Stack Engineer',
          company: 'TechFlow Systems',
          location: 'San Francisco, CA',
          startDate: '2022',
          endDate: 'Present',
          current: true,
          bulletPoints: [
            'Architected and deployed high-performance microservices handling 45,000+ daily active requests with 99.98% uptime.',
            'Engineered responsive React frontend reducing initial page load latency by 38% via code-splitting and asset caching.',
            'Integrated automated CI/CD pipeline using Docker and GitHub Actions, cutting production release cycle by 50%.',
          ],
        },
      ],
      projects: projects || [
        {
          name: 'CloudScale Analytics Dashboard',
          technologies: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
          github: 'github.com/alexmorgan/cloudscale',
          liveDemo: 'cloudscale.demo.dev',
          description: 'Real-time telemetry and resource usage monitoring dashboard for distributed container clusters.',
          bulletPoints: [
            'Implemented WebSocket streaming for sub-second system metric visualizations.',
            'Optimized relational query patterns reducing median query latency from 180ms to 24ms.',
          ],
        },
      ],
      certifications: certifications || [
        {
          certificate: 'AWS Certified Solutions Architect – Associate',
          name: 'AWS Certified Solutions Architect – Associate',
          organization: 'Amazon Web Services',
          date: '2023',
          credentialId: 'AWS-ARCH-98231',
        },
      ],
      referees: referees || [
        {
          name: 'Dr. Evelyn Reed',
          fullName: 'Dr. Evelyn Reed',
          position: 'VP of Engineering',
          organization: 'TechFlow Systems',
          email: 'e.reed@techflow.io',
          phone: '+1 (555) 019-2831',
          relationship: 'Direct Engineering Manager',
        },
      ],
    });

    await newResume.save();
    return successResponse(res, newResume, 'Resume created successfully', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/resumes/:id
 * Retrieve a specific resume by ID
 */
const getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return errorResponse(res, 'Resume not found', 'NOT_FOUND', 404);
    }
    return successResponse(res, resume, 'Resume retrieved successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/resumes/:id
 * Update resume contents
 */
const updateResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return errorResponse(res, 'Resume not found', 'NOT_FOUND', 404);
    }

    const fields = [
      'title',
      'templateId',
      'personal',
      'summary',
      'education',
      'technicalSkills',
      'experience',
      'projects',
      'certifications',
      'referees',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        resume[field] = req.body[field];
      }
    });

    await resume.save();
    return successResponse(res, resume, 'Resume updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/resumes/:id
 * Delete resume by ID
 */
const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return errorResponse(res, 'Resume not found', 'NOT_FOUND', 404);
    }
    return successResponse(res, { id: req.params.id }, 'Resume deleted successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/resumes/:id/analyze
 * Calculate Estimated ATS Compatibility Score
 */
const analyzeResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return errorResponse(res, 'Resume not found', 'NOT_FOUND', 404);
    }

    const { jobDescription } = req.body;
    const analysisResult = await analyzeResumeAts(resume.toObject(), jobDescription);

    // Save record in ResumeAnalysis
    const record = new ResumeAnalysis({
      userId: req.user._id,
      resumeId: resume._id,
      fileName: `${resume.title}.pdf`,
      atsScore: analysisResult.score,
      score: analysisResult.score,
      rating: analysisResult.score >= 85 ? 'Excellent' : analysisResult.score >= 70 ? 'Good' : 'Needs Improvement',
      categories: analysisResult.categories,
      strengths: analysisResult.strengths,
      weaknesses: analysisResult.issues,
      recommendations: analysisResult.recommendations.map((rec) => ({
        priority: 'high',
        category: 'ATS Optimization',
        recommendation: rec,
      })),
      finalVerdict: `Estimated ATS Compatibility Score: ${analysisResult.score}/100. Follow the targeted recommendations to maximize employer match.`,
    });

    await record.save();

    return successResponse(res, analysisResult, 'Resume analysis completed successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/resumes/:id/job-match
 * Compare resume with job description and return match score & keywords
 */
const matchJobDescription = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return errorResponse(res, 'Resume not found', 'NOT_FOUND', 404);
    }

    const { jobDescription } = req.body;
    if (!jobDescription || jobDescription.trim().length === 0) {
      return errorResponse(res, 'Job description text is required for comparison', 'VALIDATION_ERROR', 400);
    }

    const analysis = await analyzeResumeAts(resume.toObject(), jobDescription);

    // Contextual recommendations for job matching
    const recommendations = [
      'If you have experience with these technologies, consider describing that experience using relevant terminology from the job description.',
      'Ensure primary keywords appear organically within project and work experience bullet points.',
      'Align your professional title with the role specified in the job description if applicable to your career history.',
    ];

    const matchRecord = new JobMatch({
      userId: req.user._id,
      resumeId: resume._id,
      jobDescription: jobDescription.trim(),
      score: analysis.score,
      overallMatchScore: analysis.score,
      matchedKeywords: analysis.matchedKeywords,
      missingKeywords: analysis.missingKeywords,
      recommendedKeywords: analysis.missingKeywords.slice(0, 6),
      recommendations,
    });

    await matchRecord.save();

    return successResponse(
      res,
      {
        jobMatchScore: analysis.score,
        matchedKeywords: analysis.matchedKeywords,
        missingKeywords: analysis.missingKeywords,
        recommendedKeywords: analysis.missingKeywords.slice(0, 6),
        matchedCount: analysis.matchedKeywords.length,
        missingCount: analysis.missingKeywords.length,
        recommendations,
      },
      'Job description comparison completed successfully'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/resumes/:id/latex
 * Generate LaTeX for resume with selected template
 */
const exportLatex = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return errorResponse(res, 'Resume not found', 'NOT_FOUND', 404);
    }

    const templateId = req.body.templateId || resume.templateId || 'template-01';
    const latexSource = renderLatexResume(resume.toObject(), templateId);

    return successResponse(
      res,
      {
        templateId,
        latexSource,
        fileName: `${(resume.personal?.fullName || 'resume').toLowerCase().replace(/\s+/g, '_')}_${templateId}.tex`,
      },
      'LaTeX source generated successfully'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/resumes/:id/pdf
 * Stream rendered vector PDF
 */
const exportPdf = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return errorResponse(res, 'Resume not found', 'NOT_FOUND', 404);
    }

    const templateId = req.body.templateId || resume.templateId || 'template-01';
    const latexSource = renderLatexResume(resume.toObject(), templateId);
    const { pdfBuffer } = await compileLatexToPdf(latexSource, resume.toObject(), templateId);

    const safeName = (resume.personal?.fullName || 'SmartATS_Resume').replace(/[^a-zA-Z0-9_-]/g, '_');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    return res.end(pdfBuffer);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getResumes,
  createResume,
  getResumeById,
  updateResume,
  deleteResume,
  analyzeResume,
  matchJobDescription,
  exportLatex,
  exportPdf,
};
