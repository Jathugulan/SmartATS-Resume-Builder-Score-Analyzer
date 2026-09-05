const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
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
      default: 'My Professional Resume',
    },
    targetRole: {
      type: String,
      default: 'Software Engineer',
    },
    templateId: {
      type: String,
      default: 'template-01',
    },
    currentVersion: {
      type: Number,
      default: 1,
    },
    personal: {
      fullName: { type: String, default: '' },
      professionalTitle: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      website: { type: String, default: '' },
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      portfolio: { type: String, default: '' },
    },
    summary: {
      type: String,
      default: '',
    },
    education: [
      {
        institution: { type: String, default: '' },
        degree: { type: String, default: '' },
        field: { type: String, default: '' },
        location: { type: String, default: '' },
        startDate: { type: String, default: '' },
        endDate: { type: String, default: '' },
        grade: { type: String, default: '' },
        description: { type: String, default: '' },
        _id: false,
      },
    ],
    experience: [
      {
        company: { type: String, default: '' },
        role: { type: String, default: '' },
        location: { type: String, default: '' },
        startDate: { type: String, default: '' },
        endDate: { type: String, default: '' },
        current: { type: Boolean, default: false },
        description: { type: String, default: '' },
        bulletPoints: [{ type: String }],
        _id: false,
      },
    ],
    projects: [
      {
        name: { type: String, default: '' },
        description: { type: String, default: '' },
        technologies: [{ type: String }],
        url: { type: String, default: '' },
        github: { type: String, default: '' },
        startDate: { type: String, default: '' },
        endDate: { type: String, default: '' },
        bulletPoints: [{ type: String }],
        _id: false,
      },
    ],
    technicalSkills: [
      {
        category: { type: String, default: '' },
        skills: { type: String, default: '' },
        _id: false,
      },
    ],
    skills: {
      technical: [{ type: String }],
      programmingLanguages: [{ type: String }],
      frameworks: [{ type: String }],
      libraries: [{ type: String }],
      databases: [{ type: String }],
      cloud: [{ type: String }],
      tools: [{ type: String }],
      soft: [{ type: String }],
      domain: [{ type: String }],
    },
    certifications: [
      {
        name: { type: String, default: '' },
        issuer: { type: String, default: '' },
        date: { type: String, default: '' },
        credentialId: { type: String, default: '' },
        url: { type: String, default: '' },
        _id: false,
      },
    ],
    referees: [
      {
        fullName: { type: String, default: '' },
        position: { type: String, default: '' },
        organization: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        relationship: { type: String, default: '' },
        _id: false,
      },
    ],
    achievements: [
      {
        title: { type: String, default: '' },
        organization: { type: String, default: '' },
        date: { type: String, default: '' },
        description: { type: String, default: '' },
        _id: false,
      },
    ],
    leadership: [
      {
        role: { type: String, default: '' },
        organization: { type: String, default: '' },
        date: { type: String, default: '' },
        description: { type: String, default: '' },
        _id: false,
      },
    ],
    languages: [
      {
        language: { type: String, default: '' },
        proficiency: { type: String, default: 'Native' },
        _id: false,
      },
    ],
    customSections: [
      {
        title: { type: String, default: '' },
        items: [{ type: String }],
        _id: false,
      },
    ],
    rawLatexSource: {
      type: String,
      default: null,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

resumeSchema.index({ userId: 1, updatedAt: -1 });

module.exports = mongoose.model('Resume', resumeSchema);
