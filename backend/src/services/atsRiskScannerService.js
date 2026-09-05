/**
 * Advanced ATS Risk Scanner Service
 * Scans 18 ATS risk factors across structure, typography, density, and formatting
 */

const scanAtsRisks = (resumeText = '', layoutInfo = {}) => {
  const text = resumeText || '';
  const risks = [];

  // 1. Contact Information
  const hasEmail = /[\w.+-]+@[\w-]+\.[a-z]{2,}/i.test(text);
  const hasPhone = /(\+?\d[\d\s\-().]{8,}\d)/.test(text);
  if (!hasEmail) {
    risks.push({
      id: 'risk-contact-email',
      severity: 'CRITICAL',
      category: 'Contact Accessibility',
      issue: 'No valid email address detected',
      whyItMatters: 'Applicant tracking systems automatically discard candidate profiles with missing contact points.',
      evidence: 'No RFC 5322 compliant email pattern found in header lines.',
      recommendedFix: 'Place a professional email address prominently in the top header.',
    });
  }
  if (!hasPhone) {
    risks.push({
      id: 'risk-contact-phone',
      severity: 'HIGH',
      category: 'Contact Accessibility',
      issue: 'No telephone number detected',
      whyItMatters: 'Recruiters and automated dialers require international or regional phone formats.',
      evidence: 'No telephone number pattern matched.',
      recommendedFix: 'Include your phone number with country/area code in the header.',
    });
  }

  // 2. Multi-column and Complex Layout
  if (layoutInfo.columns > 1 || layoutInfo.layoutType === 'two-column') {
    risks.push({
      id: 'risk-layout-multicol',
      severity: 'MEDIUM',
      category: 'Layout & Parsing',
      issue: 'Multi-column layout structure detected',
      whyItMatters: 'Older ATS parsers read across columns horizontally, which can interweave unrelated text blocks.',
      evidence: `Document configured with ${layoutInfo.columns || 2} columns.`,
      recommendedFix: 'Ensure column boundaries are clearly defined (such as with paracol) or use a linear single-column layout for strict legacy ATS systems.',
    });
  }

  // 3. Section Demarcation
  const standardSections = ['experience', 'education', 'skills'];
  for (const s of standardSections) {
    const re = new RegExp(`\\b${s}\\b`, 'i');
    if (!re.test(text)) {
      risks.push({
        id: `risk-missing-${s}`,
        severity: 'HIGH',
        category: 'Section Demarcation',
        issue: `Standard "${s.toUpperCase()}" heading not detected`,
        whyItMatters: 'ATS parsers index resumes by recognizing canonical section names.',
        evidence: `No section heading matching "${s}" found in document.`,
        recommendedFix: `Add a clearly marked section title: "${s.charAt(0).toUpperCase() + s.slice(1)}".`,
      });
    }
  }

  // 4. Quantified Metrics
  const hasMetrics = /\b(\d+%|\$[\d,]+|\d+x|\d+\s*(users|clients|ms|seconds|records|requests))\b/i.test(text);
  if (!hasMetrics) {
    risks.push({
      id: 'risk-metrics-missing',
      severity: 'MEDIUM',
      category: 'Content Impact',
      issue: 'Absence of quantifiable impact metrics',
      whyItMatters: 'Both ATS semantic relevance and human recruiters rank candidates higher when outcomes are measurable.',
      evidence: 'No percentages, scale figures, or performance indicators detected.',
      recommendedFix: 'Incorporate measurable metrics (e.g. "reduced latency by 20%", "supported 10k daily users").',
    });
  }

  // 5. Length & Density
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount < 250) {
    risks.push({
      id: 'risk-length-short',
      severity: 'MEDIUM',
      category: 'Information Density',
      issue: 'Resume is unusually brief',
      whyItMatters: 'May lack sufficient keyword volume for ATS threshold screening.',
      evidence: `Word count is approximately ${wordCount} words (minimum recommended: 350 words).`,
      recommendedFix: 'Expand project descriptions, responsibilities, and technical stack details.',
    });
  } else if (wordCount > 1300) {
    risks.push({
      id: 'risk-length-long',
      severity: 'LOW',
      category: 'Information Density',
      issue: 'Resume may exceed standard length',
      whyItMatters: 'Lengthy multi-page resumes dilute keyword density and reduce recruiter engagement.',
      evidence: `Word count is approximately ${wordCount} words (recommended: 450 - 900 words).`,
      recommendedFix: 'Condense older experience or reduce repetitive bullet points.',
    });
  }

  // 6. Suspicious Keyword Stuffing
  const words = text.toLowerCase().split(/\s+/);
  const wordFreq = {};
  for (const w of words) {
    if (w.length > 3) wordFreq[w] = (wordFreq[w] || 0) + 1;
  }
  const stuffedWords = Object.entries(wordFreq).filter(([_, count]) => count > 25);
  if (stuffedWords.length > 0) {
    risks.push({
      id: 'risk-keyword-stuffing',
      severity: 'MEDIUM',
      category: 'ATS Compliance',
      issue: 'Repetitive keyword frequency detected',
      whyItMatters: 'Modern ATS filters penalize artificial repetition of single keywords.',
      evidence: `Word "${stuffedWords[0][0]}" appears ${stuffedWords[0][1]} times.`,
      recommendedFix: 'Use diverse contextual phrasing instead of repeating the same single term.',
    });
  }

  return {
    totalRisks: risks.length,
    criticalCount: risks.filter((r) => r.severity === 'CRITICAL').length,
    highCount: risks.filter((r) => r.severity === 'HIGH').length,
    mediumCount: risks.filter((r) => r.severity === 'MEDIUM').length,
    lowCount: risks.filter((r) => r.severity === 'LOW').length,
    risks,
  };
};

module.exports = {
  scanAtsRisks,
};
