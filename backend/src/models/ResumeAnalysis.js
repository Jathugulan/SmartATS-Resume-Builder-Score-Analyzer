const mongoose = require('mongoose');

const scoreComponentSchema = new mongoose.Schema(
  {
    raw: { type: Number, required: true, min: 0, max: 100 },
    weight: { type: Number, required: true },
    weighted: { type: Number, required: true },
    evidence: [{ type: String }],
    explanation: { type: String, default: '' },
  },
  { _id: false }
);

const resumeAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: false,
      index: true,
    },
    fileName: {
      type: String,
      default: 'Resume Document',
    },
    fileType: {
      type: String,
      default: 'pdf',
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    extractedTextLength: {
      type: Number,
      default: 0,
    },
    parsingConfidence: {
      type: Number,
      default: 1.0,
      min: 0,
      max: 1,
    },
    score: {
      type: Number,
      default: function() {
        return this.atsScore || 0;
      },
    },
    categories: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    candidate: {
      fullName: { type: String, default: null },
      email: { type: String, default: null },
      phone: { type: String, default: null },
      location: { type: String, default: null },
      linkedIn: { type: String, default: null },
      gitHub: { type: String, default: null },
      portfolio: { type: String, default: null },
      professionalTitle: { type: String, default: null },
      summary: { type: String, default: null },
    },

    jobDescription: {
      provided: { type: Boolean, default: false },
      rawText: { type: String, default: null },
      targetRole: { type: String, default: null },
      requiredSkills: [{ type: String }],
      preferredSkills: [{ type: String }],
      responsibilities: [{ type: String }],
      qualifications: [{ type: String }],
      keywords: [{ type: String }],
    },

    atsScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    rating: {
      type: String,
      enum: ['Excellent', 'Good', 'Needs Improvement', 'Poor'],
      required: true,
    },

    scoreBreakdown: {
      keywordSkillMatch: { type: scoreComponentSchema, required: true },
      jobDescriptionRelevance: { type: scoreComponentSchema, required: true },
      atsStructure: { type: scoreComponentSchema, required: true },
      relevantExperience: { type: scoreComponentSchema, required: true },
      educationCertifications: { type: scoreComponentSchema, required: true },
      achievementsImpact: { type: scoreComponentSchema, required: true },
      formattingReadability: { type: scoreComponentSchema, required: true },
    },

    sectionsDetected: [
      {
        name: { type: String, required: true },
        present: { type: Boolean, default: false },
        quality: { type: String, default: 'absent' },
        _id: false,
      },
    ],

    skills: {
      technical: [{ type: String }],
      tools: [{ type: String }],
      soft: [{ type: String }],
      domain: [{ type: String }],
    },

    experience: [
      {
        jobTitle: { type: String, default: null },
        company: { type: String, default: null },
        period: { type: String, default: null },
        responsibilities: [{ type: String }],
        technologies: [{ type: String }],
        quantifiedImpact: [{ type: String }],
        _id: false,
      },
    ],

    education: [
      {
        institution: { type: String, default: null },
        degree: { type: String, default: null },
        field: { type: String, default: null },
        graduationYear: { type: String, default: null },
        gpa: { type: String, default: null },
        _id: false,
      },
    ],

    certifications: [
      {
        name: { type: String, default: null },
        issuingOrganization: { type: String, default: null },
        date: { type: String, default: null },
        credentialId: { type: String, default: null },
        _id: false,
      },
    ],

    projects: [
      {
        title: { type: String, default: null },
        description: { type: String, default: null },
        technologies: [{ type: String }],
        link: { type: String, default: null },
        _id: false,
      },
    ],

    achievements: [{ type: String }],

    matching: {
      matchedSkills: [{ type: String }],
      missingSkills: [{ type: String }],
      partialSkills: [
        {
          skill: { type: String, required: true },
          context: { type: String, default: '' },
          _id: false,
        },
      ],
      matchedKeywords: [{ type: String }],
      missingKeywords: [{ type: String }],
    },

    atsRisks: [
      {
        severity: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
        category: { type: String, default: 'General' },
        issue: { type: String, required: true },
        remediation: { type: String, default: '' },
        _id: false,
      },
    ],

    strengths: [{ type: String }],
    weaknesses: [{ type: String }],

    recommendations: [
      {
        priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
        category: { type: String, default: 'General' },
        recommendation: { type: String, required: true },
        evidence: { type: String, default: '' },
        _id: false,
      },
    ],

    finalVerdict: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user historical queries
resumeAnalysisSchema.index({ userId: 1, createdAt: -1 });

const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);

module.exports = ResumeAnalysis;
