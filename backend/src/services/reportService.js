const PDFDocument = require('pdfkit');

/**
 * Generates a clean, professional vector PDF report from a ResumeAnalysis record.
 *
 * @param {Object} analysis - The populated ResumeAnalysis document
 * @param {WritableStream} outputStream - Stream to write the PDF to (e.g. res)
 */
const generatePdfReport = (analysis, outputStream) => {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 40, bottom: 40, left: 40, right: 40 },
    info: {
      Title: `ATS Resume Analysis Report - ${analysis.candidate?.fullName || 'Candidate'}`,
      Author: 'AI ATS Resume Analyzer',
      Subject: 'Automated ATS Audit & Compatibility Report',
    },
  });

  doc.pipe(outputStream);

  const primaryColor = '#1E293B'; // Slate 800
  const accentColor = '#2563EB'; // Blue 600
  const secondaryColor = '#64748B'; // Slate 500
  const successColor = '#059669'; // Emerald 600
  const warningColor = '#D97706'; // Amber 600
  const dangerColor = '#DC2626'; // Red 600

  // 1. Header Banner
  doc
    .fontSize(22)
    .fillColor(primaryColor)
    .font('Helvetica-Bold')
    .text('AI ATS RESUME ANALYSIS REPORT', { align: 'center' });

  doc
    .fontSize(10)
    .fillColor(secondaryColor)
    .font('Helvetica')
    .text(`Report Generated: ${new Date().toLocaleDateString()} | File: ${analysis.fileName}`, {
      align: 'center',
    });

  doc.moveDown(1);
  doc.strokeColor('#E2E8F0').lineWidth(1).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
  doc.moveDown(1);

  // 2. Candidate Overview Box
  const candidateName = analysis.candidate?.fullName || 'Candidate (Name Not Extracted)';
  const title = analysis.candidate?.professionalTitle || 'Not specified in resume';
  const email = analysis.candidate?.email || 'N/A';
  const phone = analysis.candidate?.phone || 'N/A';
  const targetRole = analysis.jobDescription?.targetRole || (analysis.jobDescription?.provided ? 'Target Role' : 'General ATS Benchmark');

  doc
    .fontSize(14)
    .fillColor(accentColor)
    .font('Helvetica-Bold')
    .text(candidateName);

  doc
    .fontSize(11)
    .fillColor(primaryColor)
    .font('Helvetica')
    .text(`Title: ${title}`);

  doc
    .fontSize(10)
    .fillColor(secondaryColor)
    .text(`Email: ${email} | Phone: ${phone} | Target Role: ${targetRole}`);

  doc.moveDown(1);

  // 3. Overall ATS Score Badge
  const scoreBoxY = doc.y;
  doc.rect(40, scoreBoxY, 515, 65).fillAndStroke('#F8FAFC', '#CBD5E1');

  doc
    .fontSize(12)
    .fillColor(primaryColor)
    .font('Helvetica-Bold')
    .text('COMPOSITE ATS COMPATIBILITY SCORE', 60, scoreBoxY + 14);

  const scoreColor =
    analysis.atsScore >= 85 ? successColor : analysis.atsScore >= 70 ? accentColor : analysis.atsScore >= 50 ? warningColor : dangerColor;

  doc
    .fontSize(26)
    .fillColor(scoreColor)
    .font('Helvetica-Bold')
    .text(`${analysis.atsScore} / 100`, 60, scoreBoxY + 30);

  doc
    .fontSize(14)
    .fillColor(scoreColor)
    .font('Helvetica-Bold')
    .text(`Rating: ${analysis.rating}`, 280, scoreBoxY + 35);

  doc.y = scoreBoxY + 80;
  doc.moveDown(0.5);

  // 4. Score Breakdown Table
  doc
    .fontSize(12)
    .fillColor(primaryColor)
    .font('Helvetica-Bold')
    .text('7-Component ATS Score Breakdown');

  doc.moveDown(0.5);

  const breakdown = analysis.scoreBreakdown || {};
  const categories = [
    { key: 'keywordSkillMatch', label: 'Keyword / Skill Match (30%)' },
    { key: 'jobDescriptionRelevance', label: 'Job Description Relevance (25%)' },
    { key: 'atsStructure', label: 'ATS Structure & Formatting (15%)' },
    { key: 'relevantExperience', label: 'Relevant Work Experience (15%)' },
    { key: 'educationCertifications', label: 'Education & Certifications (5%)' },
    { key: 'achievementsImpact', label: 'Achievements & Quantified Impact (5%)' },
    { key: 'formattingReadability', label: 'Readability & Layout Health (5%)' },
  ];

  categories.forEach((cat) => {
    const item = breakdown[cat.key];
    if (item) {
      if (doc.y > 700) doc.addPage();
      doc
        .fontSize(10)
        .fillColor(primaryColor)
        .font('Helvetica-Bold')
        .text(`• ${cat.label}: `, { continued: true })
        .fillColor(accentColor)
        .text(`${item.raw}/100 (Contribution: ${item.weighted} pts)`);

      if (item.explanation) {
        doc
          .fontSize(9)
          .fillColor(secondaryColor)
          .font('Helvetica')
          .text(`   ${item.explanation}`);
      }
      doc.moveDown(0.3);
    }
  });

  doc.moveDown(1);

  // 5. Skills Overview
  if (doc.y > 650) doc.addPage();
  doc
    .fontSize(12)
    .fillColor(primaryColor)
    .font('Helvetica-Bold')
    .text('Detected Skills Summary');
  doc.moveDown(0.3);

  const techSkills = (analysis.skills?.technical || []).join(', ') || 'None detected';
  const toolSkills = (analysis.skills?.tools || []).join(', ') || 'None detected';

  doc.fontSize(9).fillColor(primaryColor).font('Helvetica-Bold').text('Technical Skills: ', { continued: true }).font('Helvetica').fillColor(secondaryColor).text(techSkills);
  doc.fontSize(9).fillColor(primaryColor).font('Helvetica-Bold').text('Tools & Tech: ', { continued: true }).font('Helvetica').fillColor(secondaryColor).text(toolSkills);

  doc.moveDown(1);

  // 6. Matching (if Job Description provided)
  if (analysis.jobDescription?.provided) {
    if (doc.y > 650) doc.addPage();
    doc
      .fontSize(12)
      .fillColor(primaryColor)
      .font('Helvetica-Bold')
      .text('Job Description Alignment');
    doc.moveDown(0.3);

    const matched = (analysis.matching?.matchedSkills || []).join(', ') || 'None';
    const missing = (analysis.matching?.missingSkills || []).join(', ') || 'None';

    doc.fontSize(9).fillColor(successColor).font('Helvetica-Bold').text('Matched Skills: ', { continued: true }).fillColor(primaryColor).font('Helvetica').text(matched);
    doc.fontSize(9).fillColor(dangerColor).font('Helvetica-Bold').text('Missing Skills: ', { continued: true }).fillColor(primaryColor).font('Helvetica').text(missing);

    doc.moveDown(1);
  }

  // 7. ATS Risks
  if (analysis.atsRisks && analysis.atsRisks.length > 0) {
    if (doc.y > 650) doc.addPage();
    doc
      .fontSize(12)
      .fillColor(dangerColor)
      .font('Helvetica-Bold')
      .text('Identified ATS Risks & Vulnerabilities');
    doc.moveDown(0.3);

    analysis.atsRisks.slice(0, 5).forEach((risk) => {
      doc
        .fontSize(9)
        .fillColor(dangerColor)
        .font('Helvetica-Bold')
        .text(`[${(risk.severity || 'RISK').toUpperCase()}] ${risk.issue}`);

      if (risk.remediation) {
        doc
          .fontSize(9)
          .fillColor(secondaryColor)
          .font('Helvetica')
          .text(`   Remediation: ${risk.remediation}`);
      }
      doc.moveDown(0.2);
    });

    doc.moveDown(1);
  }

  // 8. Actionable Recommendations
  if (analysis.recommendations && analysis.recommendations.length > 0) {
    if (doc.y > 650) doc.addPage();
    doc
      .fontSize(12)
      .fillColor(primaryColor)
      .font('Helvetica-Bold')
      .text('Prioritized Improvement Recommendations');
    doc.moveDown(0.3);

    analysis.recommendations.slice(0, 5).forEach((rec) => {
      doc
        .fontSize(9)
        .fillColor(accentColor)
        .font('Helvetica-Bold')
        .text(`[${(rec.priority || 'PRIORITY').toUpperCase()}] ${rec.recommendation}`);

      if (rec.evidence) {
        doc
          .fontSize(9)
          .fillColor(secondaryColor)
          .font('Helvetica')
          .text(`   Evidence: ${rec.evidence}`);
      }
      doc.moveDown(0.2);
    });

    doc.moveDown(1);
  }

  // 9. Final Verdict
  if (doc.y > 650) doc.addPage();
  doc
    .fontSize(12)
    .fillColor(primaryColor)
    .font('Helvetica-Bold')
    .text('Executive Verdict');
  doc.moveDown(0.3);

  doc
    .fontSize(9.5)
    .fillColor(primaryColor)
    .font('Helvetica')
    .text(analysis.finalVerdict || 'Analysis completed successfully.');

  doc.moveDown(1.5);

  // 10. Legal Disclaimer
  if (doc.y > 700) doc.addPage();
  doc.strokeColor('#E2E8F0').lineWidth(0.5).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
  doc.moveDown(0.5);

  doc
    .fontSize(7.5)
    .fillColor(secondaryColor)
    .font('Helvetica-Oblique')
    .text(
      'DISCLAIMER: The ATS Compatibility Score and associated metrics presented in this report are AI-assisted analytical estimates based solely on the provided resume document and optional Job Description. This assessment does not guarantee interview selection, automated qualification, or exact scoring within proprietary third-party Applicant Tracking Systems.',
      { align: 'justify' }
    );

  doc.end();
};

module.exports = {
  generatePdfReport,
};
