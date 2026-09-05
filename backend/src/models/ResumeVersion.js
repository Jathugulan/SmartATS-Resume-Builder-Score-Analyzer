const mongoose = require('mongoose');

const resumeVersionSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    versionNumber: {
      type: Number,
      required: true,
    },
    versionName: {
      type: String,
      required: true,
      default: 'Initial Version',
    },
    targetRole: {
      type: String,
      default: '',
    },
    targetCompany: {
      type: String,
      default: '',
    },
    targetJobDescriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobDescription',
      default: null,
    },
    templateId: {
      type: String,
      default: 'template-01',
    },
    contentSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    atsScore: {
      type: Number,
      default: null,
    },
    jdMatchScore: {
      type: Number,
      default: null,
    },
    diffSummary: {
      addedSkills: [{ type: String }],
      removedSkills: [{ type: String }],
      modifiedSections: [{ type: String }],
      scoreDelta: { type: Number, default: 0 },
      explanation: { type: String, default: '' },
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

resumeVersionSchema.index({ resumeId: 1, versionNumber: -1 });

module.exports = mongoose.model('ResumeVersion', resumeVersionSchema);
