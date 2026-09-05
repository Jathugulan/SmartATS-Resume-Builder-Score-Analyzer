const Template = require('../models/Template');
const AdmZip = require('adm-zip');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Get all available templates (builtin + user uploaded)
 */
const getTemplates = async (req, res, next) => {
  try {
    const templates = await Template.find({
      $or: [{ isPublic: true }, { ownerId: req.user?._id }],
      isActive: true,
    }).sort({ createdAt: -1 });

    return successResponse(res, { templates }, 'Templates retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Get template by ID
 */
const getTemplateById = async (req, res, next) => {
  try {
    const template = await Template.findOne({ templateId: req.params.id });
    if (!template) {
      return errorResponse(res, 'Template not found', 'NOT_FOUND', 404);
    }
    return successResponse(res, { template }, 'Template details retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Upload Overleaf / LaTeX template (.tex or .zip)
 */
const uploadTemplate = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No template file uploaded', 'FILE_MISSING', 400);
    }

    const fileName = req.file.originalname;
    let latexSource = '';
    const projectFiles = [];

    if (fileName.endsWith('.zip')) {
      // Overleaf project ZIP
      const zip = new AdmZip(req.file.path);
      const zipEntries = zip.getEntries();

      // Find main.tex or largest .tex
      let mainEntry = zipEntries.find((e) => e.entryName.toLowerCase().endsWith('main.tex'));
      if (!mainEntry) {
        mainEntry = zipEntries.find((e) => e.entryName.toLowerCase().endsWith('.tex'));
      }

      if (!mainEntry) {
        return errorResponse(res, 'No .tex file found inside the uploaded ZIP archive', 'INVALID_TEMPLATE', 400);
      }

      latexSource = mainEntry.getData().toString('utf8');

      zipEntries.forEach((entry) => {
        if (!entry.isDirectory && entry.entryName.length < 150) {
          projectFiles.push({
            path: entry.entryName,
            isBinary: !entry.entryName.endsWith('.tex') && !entry.entryName.endsWith('.cls') && !entry.entryName.endsWith('.sty'),
          });
        }
      });
    } else {
      // Direct .tex upload
      latexSource = require('fs').readFileSync(req.file.path, 'utf8');
    }

    // Analyze LaTeX source
    const docClassMatch = latexSource.match(/\\documentclass(\[.*?\])?\{([a-zA-Z0-9_-]+)\}/);
    const documentClass = docClassMatch ? docClassMatch[2] : 'article';

    const sections = [];
    const secRegex = /\\section\*?\{([^}]+)\}/g;
    let secMatch;
    while ((secMatch = secRegex.exec(latexSource)) !== null) {
      sections.push(secMatch[1].replace(/\\quad|\\fa[A-Za-z0-9]+/g, '').trim());
    }

    const customCommands = [];
    const cmdRegex = /\\newcommand\*?\{\\([a-zA-Z0-9]+)\}/g;
    let cmdMatch;
    while ((cmdMatch = cmdRegex.exec(latexSource)) !== null) {
      customCommands.push(cmdMatch[1]);
    }

    const templateId = `user-template-${Date.now()}`;
    const template = new Template({
      templateId,
      name: req.body.name || fileName.replace(/\.(tex|zip)$/i, '').replace(/[-_]/g, ' '),
      description: req.body.description || 'User uploaded Overleaf / LaTeX template',
      sourceType: 'uploaded',
      ownerId: req.user._id,
      category: req.body.category || 'Software Engineer',
      layoutType: latexSource.includes('paracol') || latexSource.includes('multicols') ? 'two-column' : 'single-column',
      columns: latexSource.includes('paracol') || latexSource.includes('multicols') ? 2 : 1,
      atsSafetyLevel: latexSource.includes('paracol') ? 'Medium' : 'High',
      documentClass,
      detectedSections: sections,
      detectedCommands: customCommands,
      latexSource,
      projectFiles,
      thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80',
      isPublic: false,
    });

    await template.save();

    return successResponse(
      res,
      {
        template,
        analysis: {
          documentClass,
          detectedSections: sections,
          detectedCommands: customCommands,
          atsCompatibility: template.atsSafetyLevel,
        },
      },
      'Template uploaded and analyzed successfully',
      201
    );
  } catch (err) {
    next(err);
  }
};

/**
 * Duplicate a template
 */
const duplicateTemplate = async (req, res, next) => {
  try {
    const source = await Template.findOne({ templateId: req.params.id });
    if (!source) {
      return errorResponse(res, 'Template not found', 'NOT_FOUND', 404);
    }

    const newTemplateId = `template-copy-${Date.now()}`;
    const copy = new Template({
      ...source.toObject(),
      _id: undefined,
      templateId: newTemplateId,
      name: `${source.name} (Custom Variant)`,
      sourceType: 'uploaded',
      ownerId: req.user._id,
      isPublic: false,
    });

    await copy.save();

    return successResponse(res, { template: copy }, 'Template duplicated successfully', 201);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTemplates,
  getTemplateById,
  uploadTemplate,
  duplicateTemplate,
};
