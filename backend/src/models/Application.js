const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    jobUrl: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    salary: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: [
        'Saved',
        'Applied',
        'Screening',
        'Interview',
        'Technical Interview',
        'Final Interview',
        'Offer',
        'Rejected',
        'Withdrawn',
      ],
      default: 'Applied',
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    interviewDate: {
      type: Date,
      default: null,
    },
    followUpDate: {
      type: Date,
      default: null,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      default: null,
    },
    resumeVersionName: {
      type: String,
      default: 'Primary',
    },
    atsScore: {
      type: Number,
      default: null,
    },
    jdMatch: {
      type: Number,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

applicationSchema.index({ userId: 1, status: 1, applicationDate: -1 });

module.exports = mongoose.model('Application', applicationSchema);
