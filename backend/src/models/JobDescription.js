const mongoose = require('mongoose');

const jobDescriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    department: {
      type: String,
      default: '',
    },
    seniority: {
      type: String,
      enum: ['Intern', 'Entry', 'Mid-Level', 'Senior', 'Lead', 'Staff/Principal', 'Executive', 'Unspecified'],
      default: 'Unspecified',
    },
    rawText: {
      type: String,
      required: true,
    },
    requiredSkills: [{ type: String }],
    preferredSkills: [{ type: String }],
    technicalSkills: [{ type: String }],
    softSkills: [{ type: String }],
    responsibilities: [{ type: String }],
    qualifications: [{ type: String }],
    yearsExperience: {
      type: Number,
      default: null,
    },
    keywords: [{ type: String }],
    requirementBreakdown: [
      {
        text: String,
        category: { type: String, enum: ['REQUIRED', 'PREFERRED', 'OPTIONAL'] },
        importanceScore: Number, // 1 - 10
        skillKey: String,
        _id: false,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('JobDescription', jobDescriptionSchema);
