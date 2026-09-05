const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema(
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
      default: null,
    },
    targetRole: {
      type: String,
      required: true,
    },
    targetCompany: {
      type: String,
      default: '',
    },
    questions: [
      {
        questionId: String,
        category: { type: String, enum: ['Technical', 'Behavioral', 'Resume-Based', 'Project', 'Skill'] },
        question: String,
        contextFromResume: String,
        userAnswer: { type: String, default: '' },
        feedback: {
          relevanceScore: Number, // 1 - 10
          clarityScore: Number,   // 1 - 10
          technicalDepth: Number, // 1 - 10
          feedbackText: String,
          modelAnswerSnippet: String,
        },
        _id: false,
      },
    ],
    overallScore: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['In-Progress', 'Completed'],
      default: 'In-Progress',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
