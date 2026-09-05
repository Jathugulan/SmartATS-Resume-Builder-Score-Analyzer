const mongoose = require('mongoose');

const aiUsageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    month: {
      type: String, // e.g. "2026-09"
      required: true,
      index: true,
    },
    totalRequests: {
      type: Number,
      default: 0,
    },
    tokenEstimates: {
      type: Number,
      default: 0,
    },
    analysisCount: {
      type: Number,
      default: 0,
    },
    optimizationCount: {
      type: Number,
      default: 0,
    },
    interviewSessions: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

aiUsageSchema.index({ userId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('AIUsage', aiUsageSchema);
