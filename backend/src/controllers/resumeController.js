const fs = require('fs');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const { validateFile } = require('../services/fileValidationService');
const { processResumeAnalysis } = require('../services/resumeAnalysisService');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Pre-validation upload endpoint (POST /api/resume/upload)
 */
const upload = async (req, res, next) => {
  if (!req.file) {
    return errorResponse(res, 'No file was uploaded', 'FILE_MISSING', 400);
  }

  try {
    const validation = await validateFile(req.file.path, req.file.originalname);

    return successResponse(
      res,
      {
        fileName: validation.fileName,
        fileType: validation.fileType,
        fileSize: validation.fileSize,
      },
      'File validated successfully'
    );
  } catch (error) {
    next(error);
  } finally {
    // Delete temp file after validation-only check
    if (req.file?.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        // ignore
      }
    }
  }
};

/**
 * Full Resume Analysis endpoint (POST /api/resume/analyze)
 */
const analyze = async (req, res, next) => {
  if (!req.file) {
    return errorResponse(res, 'Please provide a resume document (PDF or DOCX)', 'FILE_MISSING', 400);
  }

  try {
    const jobDescription = req.body.jobDescription || null;
    // Pass user context so rule-based fallback can use account name when name extraction fails
    const userContext = req.user ? { name: req.user.name, email: req.user.email } : null;
    const analysis = await processResumeAnalysis(req.file, jobDescription, req.user._id, userContext);

    return successResponse(
      res,
      {
        analysisId: analysis._id,
        analysis,
      },
      'Resume analyzed and scored successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};


/**
 * User Analysis History (GET /api/resume/history)
 */
const history = async (req, res, next) => {
  try {
    const analyses = await ResumeAnalysis.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('fileName candidate.fullName candidate.professionalTitle jobDescription.targetRole jobDescription.provided atsScore rating createdAt')
      .lean();

    const formattedHistory = analyses.map((item) => ({
      id: item._id,
      fileName: item.fileName,
      candidateName: item.candidate?.fullName || 'Unknown',
      professionalTitle: item.candidate?.professionalTitle || null,
      targetJob: item.jobDescription?.targetRole || (item.jobDescription?.provided ? 'Specified Role' : 'General ATS'),
      atsScore: item.atsScore,
      rating: item.rating,
      createdAt: item.createdAt,
    }));

    return successResponse(
      res,
      {
        total: formattedHistory.length,
        history: formattedHistory,
      },
      'Analysis history retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get Analysis Detail (GET /api/resume/:id)
 */
const getAnalysis = async (req, res, next) => {
  try {
    const analysis = await ResumeAnalysis.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!analysis) {
      return errorResponse(res, 'Analysis not found or access denied', 'ANALYSIS_NOT_FOUND', 404);
    }

    return successResponse(res, { analysis }, 'Analysis details retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Analysis (DELETE /api/resume/:id)
 */
const deleteAnalysis = async (req, res, next) => {
  try {
    const analysis = await ResumeAnalysis.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!analysis) {
      return errorResponse(res, 'Analysis not found or access denied', 'ANALYSIS_NOT_FOUND', 404);
    }

    return successResponse(res, { id: req.params.id }, 'Analysis deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update candidate information (PATCH /api/resume/:id/candidate)
 */
const updateCandidate = async (req, res, next) => {
  try {
    const { fullName, professionalTitle, email, phone, location, linkedIn, gitHub, portfolio, summary } = req.body;

    const analysis = await ResumeAnalysis.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!analysis) {
      return errorResponse(res, 'Analysis not found or access denied', 'ANALYSIS_NOT_FOUND', 404);
    }

    if (fullName !== undefined) analysis.candidate.fullName = fullName;
    if (professionalTitle !== undefined) analysis.candidate.professionalTitle = professionalTitle;
    if (email !== undefined) analysis.candidate.email = email;
    if (phone !== undefined) analysis.candidate.phone = phone;
    if (location !== undefined) analysis.candidate.location = location;
    if (linkedIn !== undefined) analysis.candidate.linkedIn = linkedIn;
    if (gitHub !== undefined) analysis.candidate.gitHub = gitHub;
    if (portfolio !== undefined) analysis.candidate.portfolio = portfolio;
    if (summary !== undefined) analysis.candidate.summary = summary;

    await analysis.save();

    return successResponse(res, { analysis }, 'Candidate details updated successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  upload,
  analyze,
  history,
  getAnalysis,
  updateCandidate,
  deleteAnalysis,
};
