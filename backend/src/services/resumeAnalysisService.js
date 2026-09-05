const fs = require('fs');
const { validateFile } = require('./fileValidationService');
const { extractPdfText } = require('./pdfExtractionService');
const { extractDocxText } = require('./docxExtractionService');
const { analyzeResumeWithAI } = require('../agents/atsAgent');
const { calculateAtsScore } = require('./scoringService');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const User = require('../models/User');

/**
 * Orchestrates complete resume analysis pipeline:
 * File Validation -> Text Extraction -> AI Analysis -> ATS Scoring -> MongoDB Persistence -> Temp Cleanup
 *
 * @param {Object} file - Multer file object
 * @param {string} rawJobDescription - Optional Job Description text
 * @param {string} userId - Authenticated user ID
 * @returns {Promise<Object>} Created ResumeAnalysis document
 */
const processResumeAnalysis = async (file, rawJobDescription, userId, userContext = null) => {
  if (!file || !file.path) {
    throw {
      statusCode: 400,
      code: 'FILE_MISSING',
      message: 'No resume file was uploaded with the request',
    };
  }

  const tempFilePath = file.path;
  const originalName = file.originalname;

  try {
    // 1. Deep File Validation (Magic numbers & MIME verification)
    const validation = await validateFile(tempFilePath, originalName);

    // 2. Complete Document Extraction
    let extraction;
    if (validation.fileType === 'pdf') {
      extraction = await extractPdfText(tempFilePath);
    } else if (validation.fileType === 'docx') {
      extraction = await extractDocxText(tempFilePath);
    } else {
      throw {
        statusCode: 400,
        code: 'UNSUPPORTED_FORMAT',
        message: 'Unsupported document format',
      };
    }

    const jdText = rawJobDescription && typeof rawJobDescription === 'string' ? rawJobDescription.trim() : null;
    const jdProvided = !!(jdText && jdText.length > 10);

    // Resolve user context for name fallback (used when AI quota is exhausted)
    let resolvedUserContext = userContext;
    if (!resolvedUserContext && userId) {
      try {
        const userDoc = await User.findById(userId).select('name email').lean();
        if (userDoc) resolvedUserContext = { name: userDoc.name, email: userDoc.email };
      } catch (_) {
        // non-critical – proceed without user context
      }
    }

    // 3. AI Extraction & Analysis
    const aiResult = await analyzeResumeWithAI(extraction.text, jdProvided ? jdText : null, resolvedUserContext);

    // 4. Deterministic Server-side ATS Scoring
    const { atsScore, rating, scoreBreakdown } = calculateAtsScore(
      aiResult.rawScores,
      aiResult.scoreEvidence,
      jdProvided
    );

    // 5. Structure Job Description analysis payload
    const jobDescriptionData = {
      provided: jdProvided,
      rawText: jdText,
      targetRole: (aiResult.jobDescriptionAnalysis && aiResult.jobDescriptionAnalysis.targetRole) || null,
      requiredSkills: (aiResult.jobDescriptionAnalysis && aiResult.jobDescriptionAnalysis.requiredSkills) || [],
      preferredSkills: (aiResult.jobDescriptionAnalysis && aiResult.jobDescriptionAnalysis.preferredSkills) || [],
      responsibilities: (aiResult.jobDescriptionAnalysis && aiResult.jobDescriptionAnalysis.responsibilities) || [],
      qualifications: (aiResult.jobDescriptionAnalysis && aiResult.jobDescriptionAnalysis.qualifications) || [],
      keywords: (aiResult.jobDescriptionAnalysis && aiResult.jobDescriptionAnalysis.keywords) || [],
    };

    // 6. Clean matching arrays if no JD was provided
    const matchingData = jdProvided
      ? aiResult.matching
      : {
          matchedSkills: [],
          missingSkills: [],
          partialSkills: [],
          matchedKeywords: [],
          missingKeywords: [],
        };

    // 7. Persist to MongoDB
    const analysisDoc = new ResumeAnalysis({
      userId,
      fileName: validation.fileName,
      fileType: validation.fileType,
      fileSize: validation.fileSize,
      extractedTextLength: extraction.text.length,
      parsingConfidence: extraction.parsingConfidence,
      candidate: aiResult.candidate || {},
      jobDescription: jobDescriptionData,
      atsScore,
      rating,
      scoreBreakdown,
      sectionsDetected: aiResult.sectionsDetected || [],
      skills: aiResult.skills || { technical: [], tools: [], soft: [], domain: [] },
      experience: aiResult.experience || [],
      education: aiResult.education || [],
      certifications: aiResult.certifications || [],
      projects: aiResult.projects || [],
      achievements: aiResult.achievements || [],
      matching: matchingData,
      atsRisks: aiResult.atsRisks || [],
      strengths: aiResult.strengths || [],
      weaknesses: aiResult.weaknesses || [],
      recommendations: aiResult.recommendations || [],
      finalVerdict: aiResult.finalVerdict,
    });

    await analysisDoc.save();
    return analysisDoc;
  } finally {
    // 8. Guaranteed Temporary File Cleanup
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (cleanupErr) {
        console.warn(`[Cleanup] Could not unlink temp file ${tempFilePath}:`, cleanupErr.message);
      }
    }
  }
};

module.exports = {
  processResumeAnalysis,
};
