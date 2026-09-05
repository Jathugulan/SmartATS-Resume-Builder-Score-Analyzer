const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const env = require('../config/env');
const { errorResponse } = require('../utils/response');

const uploadsDir = path.resolve(__dirname, '../../uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueId = crypto.randomUUID();
    cb(null, `${uniqueId}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(ext)) {
    return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only PDF and DOCX files are supported'));
  }

  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/octet-stream' // Some browsers send octet-stream for docx
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Unsupported file MIME type'));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: env.MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter,
});

// Middleware wrapper to handle Multer errors cleanly
const uploadResume = (req, res, next) => {
  const handler = upload.single('resume');

  handler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        const mb = Math.round(env.MAX_FILE_SIZE / (1024 * 1024));
        return errorResponse(res, `File size exceeds the limit of ${mb}MB`, 'FILE_TOO_LARGE', 413);
      }
      return errorResponse(res, err.message, 'UPLOAD_ERROR', 400);
    } else if (err) {
      return errorResponse(res, err.message || 'File upload error', 'UPLOAD_ERROR', 400);
    }
    next();
  });
};

const templateUpload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.zip', '.tex'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only .zip or .tex files are supported for LaTeX templates'));
    }
  },
});

const uploadTemplateFile = (req, res, next) => {
  const handler = templateUpload.single('template');
  handler(req, res, (err) => {
    if (err) {
      return errorResponse(res, err.message || 'Template upload error', 'UPLOAD_ERROR', 400);
    }
    next();
  });
};

module.exports = {
  uploadResume,
  uploadTemplateFile,
  uploadsDir,
};

