const ResumeAnalysis = require('../models/ResumeAnalysis');
const { generatePdfReport } = require('../services/reportService');
const { errorResponse } = require('../utils/response');

const generateReport = async (req, res, next) => {
  try {
    const analysis = await ResumeAnalysis.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!analysis) {
      return errorResponse(res, 'Analysis not found or access denied', 'ANALYSIS_NOT_FOUND', 404);
    }

    const candidateName = (analysis.candidate?.fullName || 'Candidate')
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `ATS_Report_${candidateName}_${analysis._id.toString().slice(-6)}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-cache');

    // Listen for stream errors so they don't crash the process
    res.on('error', (streamErr) => {
      console.error('[Report] Response stream error:', streamErr.message);
    });

    generatePdfReport(analysis, res);
  } catch (error) {
    // If headers were already sent (PDF started streaming), we can't send an error response
    if (res.headersSent) {
      console.error('[Report] Error after headers sent:', error.message);
      return;
    }
    next(error);
  }
};

module.exports = {
  generateReport,
};
