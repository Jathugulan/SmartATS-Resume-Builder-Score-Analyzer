const Resume = require('../models/Resume');
const JobDescription = require('../models/JobDescription');
const JobMatch = require('../models/JobMatch');
const CoverLetter = require('../models/CoverLetter');
const InterviewSession = require('../models/InterviewSession');
const AIUsage = require('../models/AIUsage');

const { buildResumeIntelligence } = require('../services/resumeIntelligenceService');
const { parseJobDescription } = require('../services/jdIntelligenceService');
const { evaluateSemanticMatch } = require('../services/semanticMatchService');
const { evaluateSkillGaps } = require('../services/skillGapService');
const { analyzeCareerPaths } = require('../services/careerPathService');
const { compareResumeAgainstMultipleJobs } = require('../services/multiJobMatchService');
const { generateResumeOptimizations } = require('../services/resumeOptimizationService');
const { improveBulletPoint } = require('../services/bulletGeneratorService');
const { simulateScoreChanges } = require('../services/atsSimulatorService');
const { scanAtsRisks } = require('../services/atsRiskScannerService');
const { analyzeLinkedInConsistency, analyzePortfolioConsistency } = require('../services/consistencyService');
const { generateCoverLetter } = require('../services/coverLetterService');
const { simulateRecruiterReview } = require('../services/recruiterSimulationService');
const { generateInterviewQuestions, evaluateInterviewAnswer } = require('../services/interviewService');
const { answerResumeQuery } = require('../services/resumeChatService');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Increment AI Usage stats
 */
const recordAiAction = async (userId, type) => {
  try {
    const month = new Date().toISOString().slice(0, 7);
    await AIUsage.findOneAndUpdate(
      { userId, month },
      {
        $inc: {
          totalRequests: 1,
          tokenEstimates: 350,
          ...(type === 'analysis' && { analysisCount: 1 }),
          ...(type === 'optimization' && { optimizationCount: 1 }),
          ...(type === 'interview' && { interviewSessions: 1 }),
        },
      },
      { upsert: true }
    );
  } catch (err) {
    // Non-blocking
  }
};

/**
 * Get Resume Intelligence & Evidence Graph
 */
const getResumeIntelligence = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return errorResponse(res, 'Resume not found', 'NOT_FOUND', 404);
    }
    const intelligence = buildResumeIntelligence(resume.toObject());
    await recordAiAction(req.user._id, 'analysis');
    return successResponse(res, { intelligence }, 'Resume Intelligence generated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Analyze Job Description text
 */
const analyzeJob = async (req, res, next) => {
  try {
    const { rawText, title, company } = req.body;
    if (!rawText || rawText.trim().length < 15) {
      return errorResponse(res, 'Please provide sufficient Job Description text', 'INVALID_INPUT', 400);
    }
    const parsed = parseJobDescription(rawText);
    if (title) parsed.title = title;
    if (company) parsed.company = company;

    const jd = new JobDescription({
      userId: req.user._id,
      ...parsed,
    });
    await jd.save();
    await recordAiAction(req.user._id, 'analysis');

    return successResponse(res, { jobDescription: jd }, 'Job Description analyzed', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Match Resume with Job Description
 */
const matchResumeWithJob = async (req, res, next) => {
  try {
    const { resumeId, jobDescriptionId, rawJobText } = req.body;
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) {
      return errorResponse(res, 'Resume not found', 'NOT_FOUND', 404);
    }

    let jd;
    if (jobDescriptionId) {
      jd = await JobDescription.findOne({ _id: jobDescriptionId, userId: req.user._id });
    } else if (rawJobText) {
      const parsed = parseJobDescription(rawJobText);
      jd = new JobDescription({ userId: req.user._id, ...parsed });
      await jd.save();
    }

    if (!jd) {
      return errorResponse(res, 'Target Job Description required', 'INVALID_INPUT', 400);
    }

    const allSkills = [
      ...(resume.skills?.technical || []),
      ...(resume.skills?.programmingLanguages || []),
      ...(resume.skills?.frameworks || []),
    ];
    const resumeText = JSON.stringify(resume);

    const semanticMatch = evaluateSemanticMatch(allSkills, resumeText, jd.requirementBreakdown || jd.requiredSkills || []);
    const gaps = evaluateSkillGaps(allSkills, jd.requiredSkills || [], jd.preferredSkills || []);

    const jobMatch = new JobMatch({
      userId: req.user._id,
      resumeId: resume._id,
      jobDescriptionId: jd._id,
      overallMatchScore: semanticMatch.matchScore,
      exactMatches: semanticMatch.exactMatches,
      semanticMatches: semanticMatch.semanticMatches,
      missingSkills: semanticMatch.missingMatches,
      skillGaps: gaps.skillGaps,
      strengths: [
        `Strong match with ${semanticMatch.summary.exactCount} exact requirement alignments`,
        `${semanticMatch.summary.semanticCount} requirements supported through verified transferable skills`,
      ],
      concerns: semanticMatch.missingMatches.slice(0, 3).map((m) => `Missing direct evidence for: ${m.requirement}`),
    });

    await jobMatch.save();
    await recordAiAction(req.user._id, 'analysis');

    return successResponse(
      res,
      {
        matchScore: semanticMatch.matchScore,
        semanticMatch,
        skillGaps: gaps.skillGaps,
        learningRoadmap: gaps.learningRoadmap,
        jobDescription: jd,
      },
      'Job matching completed successfully'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * Multi-Job Matching
 */
const multiJobMatch = async (req, res, next) => {
  try {
    const { resumeId, jobList } = req.body;
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) {
      return errorResponse(res, 'Resume not found', 'NOT_FOUND', 404);
    }

    const allSkills = [
      ...(resume.skills?.technical || []),
      ...(resume.skills?.programmingLanguages || []),
      ...(resume.skills?.frameworks || []),
    ];
    const resumeText = JSON.stringify(resume);

    const results = compareResumeAgainstMultipleJobs(allSkills, resumeText, jobList || []);
    return successResponse(res, results, 'Multi-job comparison complete');
  } catch (err) {
    next(err);
  }
};

/**
 * Career Path Analysis
 */
const getCareerPaths = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return errorResponse(res, 'Resume not found', 'NOT_FOUND', 404);
    }
    const allSkills = [
      ...(resume.skills?.technical || []),
      ...(resume.skills?.programmingLanguages || []),
      ...(resume.skills?.frameworks || []),
    ];
    const careerData = analyzeCareerPaths(allSkills);
    return successResponse(res, careerData, 'Career path intelligence retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Optimize Resume
 */
const optimizeResume = async (req, res, next) => {
  try {
    const { resumeId, jobDescriptionId, rawJobText } = req.body;
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) {
      return errorResponse(res, 'Resume not found', 'NOT_FOUND', 404);
    }

    let jd;
    if (jobDescriptionId) {
      jd = await JobDescription.findById(jobDescriptionId);
    } else {
      jd = parseJobDescription(rawJobText || '');
    }

    const optimizations = generateResumeOptimizations(resume.toObject(), jd);
    await recordAiAction(req.user._id, 'optimization');

    return successResponse(res, { optimizations }, 'Optimization suggestions generated');
  } catch (err) {
    next(err);
  }
};

/**
 * Improve Bullet Point
 */
const improveBullet = async (req, res, next) => {
  try {
    const { bullet, technologies } = req.body;
    if (!bullet) {
      return errorResponse(res, 'Bullet point text required', 'INVALID_INPUT', 400);
    }
    const improved = improveBulletPoint(bullet, technologies || []);
    return successResponse(res, { original: bullet, improved }, 'Bullet point improved');
  } catch (err) {
    next(err);
  }
};

/**
 * Simulate ATS Score (What-If)
 */
const simulateScore = async (req, res, next) => {
  try {
    const { currentScore, activeToggles } = req.body;
    const simulation = simulateScoreChanges(currentScore || 75, activeToggles || {});
    return successResponse(res, { simulation }, 'Score simulation computed');
  } catch (err) {
    next(err);
  }
};

/**
 * Scan ATS Risks
 */
const scanRisks = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return errorResponse(res, 'Resume not found', 'NOT_FOUND', 404);
    }
    const resumeText = JSON.stringify(resume);
    const risks = scanAtsRisks(resumeText, { columns: resume.templateId === 'template-05' ? 2 : 1 });
    return successResponse(res, { risks }, 'ATS risk scan completed');
  } catch (err) {
    next(err);
  }
};

/**
 * Consistency Analyzers
 */
const checkLinkedInConsistency = async (req, res, next) => {
  try {
    const { resumeId, linkedInText } = req.body;
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) {
      return errorResponse(res, 'Resume not found', 'NOT_FOUND', 404);
    }
    const result = analyzeLinkedInConsistency(resume.toObject(), linkedInText);
    return successResponse(res, result, 'LinkedIn consistency check completed');
  } catch (err) {
    next(err);
  }
};

const checkPortfolioConsistency = async (req, res, next) => {
  try {
    const { resumeId, portfolioContent } = req.body;
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) {
      return errorResponse(res, 'Resume not found', 'NOT_FOUND', 404);
    }
    const result = analyzePortfolioConsistency(resume.toObject(), portfolioContent);
    return successResponse(res, result, 'Portfolio consistency check completed');
  } catch (err) {
    next(err);
  }
};

/**
 * Cover Letter
 */
const createCoverLetter = async (req, res, next) => {
  try {
    const { resumeId, targetCompany, targetRole, hiringManager, tone, jobDescription } = req.body;
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) {
      return errorResponse(res, 'Resume not found', 'NOT_FOUND', 404);
    }

    const allSkills = [
      ...(resume.skills?.technical || []),
      ...(resume.skills?.programmingLanguages || []),
    ];

    const result = generateCoverLetter({
      candidateName: resume.personal?.fullName || req.user.name,
      candidateEmail: resume.personal?.email || req.user.email,
      candidatePhone: resume.personal?.phone || '',
      targetCompany: targetCompany || 'Engineering Team',
      targetRole: targetRole || resume.targetRole,
      hiringManager: hiringManager || 'Hiring Manager',
      tone: tone || 'Modern',
      resumeSkills: allSkills,
      keyProjects: resume.projects || [],
      jobDescription,
    });

    const doc = new CoverLetter({
      userId: req.user._id,
      resumeId: resume._id,
      companyName: targetCompany || 'Company',
      jobTitle: targetRole || 'Software Engineer',
      hiringManager: hiringManager || 'Hiring Manager',
      tone: tone || 'Modern',
      jobDescription: jobDescription || '',
      content: result.content,
    });
    await doc.save();

    return successResponse(res, { coverLetter: doc }, 'Cover letter generated successfully', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Recruiter Simulation
 */
const getRecruiterSimulation = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return errorResponse(res, 'Resume not found', 'NOT_FOUND', 404);
    }
    const simulation = simulateRecruiterReview(resume.toObject());
    return successResponse(res, { simulation }, 'Recruiter review simulation completed');
  } catch (err) {
    next(err);
  }
};

/**
 * Interview Questions & Evaluation
 */
const getInterviewQuestions = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return errorResponse(res, 'Resume not found', 'NOT_FOUND', 404);
    }
    const result = generateInterviewQuestions(resume.toObject(), req.query.role || resume.targetRole);
    return successResponse(res, result, 'Interview preparation questions generated');
  } catch (err) {
    next(err);
  }
};

const evaluateAnswer = async (req, res, next) => {
  try {
    const { question, answer } = req.body;
    const evaluation = evaluateInterviewAnswer(question, answer);
    return successResponse(res, { evaluation }, 'Interview answer evaluated');
  } catch (err) {
    next(err);
  }
};

/**
 * Resume AI Chat Assistant
 */
const chatAssistant = async (req, res, next) => {
  try {
    const { query, resumeId } = req.body;
    const resume = resumeId ? await Resume.findOne({ _id: resumeId, userId: req.user._id }) : null;
    const reply = answerResumeQuery(query, { resume, atsScore: resume?.atsScore || 88 });
    return successResponse(res, reply, 'Assistant reply generated');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getResumeIntelligence,
  analyzeJob,
  matchResumeWithJob,
  multiJobMatch,
  getCareerPaths,
  optimizeResume,
  improveBullet,
  simulateScore,
  scanRisks,
  checkLinkedInConsistency,
  checkPortfolioConsistency,
  createCoverLetter,
  getRecruiterSimulation,
  getInterviewQuestions,
  evaluateAnswer,
  chatAssistant,
};
