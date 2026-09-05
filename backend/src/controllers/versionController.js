const ResumeVersion = require('../models/ResumeVersion');
const Resume = require('../models/Resume');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Get all versions for a resume
 */
const getVersions = async (req, res, next) => {
  try {
    const versions = await ResumeVersion.find({
      resumeId: req.params.id,
      userId: req.user._id,
    }).sort({ versionNumber: -1 });

    return successResponse(res, { versions }, 'Versions retrieved successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new resume version
 */
const createVersion = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return errorResponse(res, 'Resume not found', 'NOT_FOUND', 404);
    }

    const latestVersion = await ResumeVersion.findOne({ resumeId: resume._id }).sort({ versionNumber: -1 });
    const nextVersionNumber = (latestVersion?.versionNumber || 1) + 1;

    const version = new ResumeVersion({
      resumeId: resume._id,
      userId: req.user._id,
      versionNumber: nextVersionNumber,
      versionName: req.body.versionName || `Version ${nextVersionNumber}.0 (${req.body.targetRole || resume.targetRole})`,
      targetRole: req.body.targetRole || resume.targetRole,
      targetCompany: req.body.targetCompany || '',
      templateId: req.body.templateId || resume.templateId,
      contentSnapshot: req.body.contentSnapshot || resume.toObject(),
      atsScore: req.body.atsScore || null,
      jdMatchScore: req.body.jdMatchScore || null,
      diffSummary: req.body.diffSummary || {
        addedSkills: [],
        removedSkills: [],
        modifiedSections: ['Content Tailoring'],
        scoreDelta: req.body.scoreDelta || 0,
        explanation: 'Version created via AI Optimization workflow.',
      },
    });

    await version.save();

    resume.currentVersion = nextVersionNumber;
    await resume.save();

    return successResponse(res, { version }, 'Resume version created successfully', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Compare two resume versions (Visual Version Diff)
 */
const compareVersions = async (req, res, next) => {
  try {
    const { versionAId, versionBId } = req.body;

    const vA = await ResumeVersion.findOne({ _id: versionAId, userId: req.user._id });
    const vB = await ResumeVersion.findOne({ _id: versionBId, userId: req.user._id });

    if (!vA || !vB) {
      return errorResponse(res, 'One or both versions not found', 'NOT_FOUND', 404);
    }

    const skillsA = [
      ...(vA.contentSnapshot?.skills?.technical || []),
      ...(vA.contentSnapshot?.skills?.programmingLanguages || []),
    ];
    const skillsB = [
      ...(vB.contentSnapshot?.skills?.technical || []),
      ...(vB.contentSnapshot?.skills?.programmingLanguages || []),
    ];

    const addedSkills = skillsB.filter((s) => !skillsA.includes(s));
    const removedSkills = skillsA.filter((s) => !skillsB.includes(s));

    const diff = {
      versionA: {
        id: vA._id,
        name: vA.versionName,
        atsScore: vA.atsScore,
        skillsCount: skillsA.length,
      },
      versionB: {
        id: vB._id,
        name: vB.versionName,
        atsScore: vB.atsScore,
        skillsCount: skillsB.length,
      },
      scoreDelta: (vB.atsScore || 0) - (vA.atsScore || 0),
      addedSkills,
      removedSkills,
      summaryChanged: vA.contentSnapshot?.summary !== vB.contentSnapshot?.summary,
      targetRoleChanged: vA.targetRole !== vB.targetRole,
    };

    return successResponse(res, { diff }, 'Version comparison calculated successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getVersions,
  createVersion,
  compareVersions,
};
