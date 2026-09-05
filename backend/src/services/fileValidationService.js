const fs = require('fs');
const path = require('path');
const env = require('../config/env');

/**
 * Inspect file buffer header bytes (magic numbers) to ensure
 * authenticity beyond simple filename extension checks.
 */
const validateFile = async (filePath, originalName) => {
  if (!filePath || !fs.existsSync(filePath)) {
    throw {
      statusCode: 400,
      code: 'FILE_NOT_FOUND',
      message: 'Uploaded file does not exist on the server',
    };
  }

  const stats = fs.statSync(filePath);
  if (stats.size === 0) {
    throw {
      statusCode: 400,
      code: 'EMPTY_FILE',
      message: 'The uploaded file is empty (0 bytes)',
    };
  }

  if (stats.size > env.MAX_FILE_SIZE) {
    const mb = Math.round(env.MAX_FILE_SIZE / (1024 * 1024));
    throw {
      statusCode: 413,
      code: 'FILE_TOO_LARGE',
      message: `File exceeds maximum allowed size of ${mb}MB`,
    };
  }

  const ext = path.extname(originalName || filePath).toLowerCase();
  if (ext !== '.pdf' && ext !== '.docx') {
    throw {
      statusCode: 400,
      code: 'UNSUPPORTED_FORMAT',
      message: 'Only PDF (.pdf) and Microsoft Word (.docx) documents are supported',
    };
  }

  // Read first 8 bytes for magic signature validation
  const buffer = Buffer.alloc(8);
  const fd = fs.openSync(filePath, 'r');
  fs.readSync(fd, buffer, 0, 8, 0);
  fs.closeSync(fd);

  let detectedType = null;

  // PDF check: Begins with %PDF- (0x25 0x50 0x44 0x46)
  if (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  ) {
    detectedType = 'pdf';
  }

  // DOCX check: OpenXML Zip archive begins with PK\x03\x04 (0x50 0x4B 0x03 0x04)
  if (
    buffer[0] === 0x50 &&
    buffer[1] === 0x4b &&
    (buffer[2] === 0x03 || buffer[2] === 0x05 || buffer[2] === 0x07) &&
    (buffer[3] === 0x04 || buffer[3] === 0x06 || buffer[3] === 0x08)
  ) {
    detectedType = 'docx';
  }

  if (!detectedType) {
    throw {
      statusCode: 400,
      code: 'CORRUPTED_OR_INVALID_FILE',
      message: 'File binary header does not match a valid PDF or DOCX document',
    };
  }

  if (detectedType !== ext.replace('.', '')) {
    throw {
      statusCode: 400,
      code: 'EXTENSION_MIME_MISMATCH',
      message: `File extension (${ext}) does not match detected binary format (${detectedType})`,
    };
  }

  return {
    isValid: true,
    fileType: detectedType,
    fileSize: stats.size,
    fileName: originalName || path.basename(filePath),
  };
};

module.exports = {
  validateFile,
};
