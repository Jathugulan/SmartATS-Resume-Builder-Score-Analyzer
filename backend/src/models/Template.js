const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema(
  {
    templateId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    sourceType: {
      type: String,
      enum: ['builtin', 'uploaded'],
      default: 'builtin',
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    category: {
      type: String,
      enum: [
        'ATS Minimal',
        'Engineering',
        'Software Engineer',
        'Business',
        'Modern',
        'Academic',
        'Executive',
        'Creative',
        'Developer',
      ],
      default: 'Engineering',
    },
    layoutType: {
      type: String,
      enum: ['single-column', 'two-column', 'banking', 'sidebar'],
      default: 'single-column',
    },
    columns: {
      type: Number,
      default: 1,
    },
    atsSafetyLevel: {
      type: String,
      enum: ['High', 'Medium', 'Caution'],
      default: 'High',
    },
    atsCompatibilityNotes: [{ type: String }],
    documentClass: {
      type: String,
      default: 'article',
    },
    packages: [{ type: String }],
    detectedSections: [{ type: String }],
    detectedCommands: [{ type: String }],
    fieldMappings: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    mainTexFile: {
      type: String,
      default: 'main.tex',
    },
    latexSource: {
      type: String,
      required: true,
    },
    projectFiles: [
      {
        path: String,
        content: String,
        isBinary: Boolean,
        _id: false,
      },
    ],
    thumbnail: {
      type: String,
      default: '',
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Template', templateSchema);
