const mongoose = require('mongoose');

const jobMatchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      index: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
      index: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },
    overallMatchScore: {
      type: Number,
      default: function () {
        return this.score;
      },
    },
    matchedKeywords: [{ type: String }],
    missingKeywords: [{ type: String }],
    recommendedKeywords: [{ type: String }],
    recommendations: [{ type: String }],
    exactMatches: [
      {
        skill: String,
        jdContext: String,
        resumeEvidence: String,
        _id: false,
      },
    ],
    semanticMatches: [
      {
        jdSkill: String,
        resumeSkill: String,
        relationship: String,
        confidence: Number,
        _id: false,
      },
    ],
    missingSkills: [
      {
        skill: String,
        importance: { type: String, default: 'REQUIRED' },
        learningPriority: Number,
        suggestedLearningPath: String,
        _id: false,
      },
    ],
    strengths: [{ type: String }],
    concerns: [{ type: String }],
  },
  { timestamps: true }
);

jobMatchSchema.index({ resumeId: 1, createdAt: -1 });

module.exports = mongoose.model('JobMatch', jobMatchSchema);
