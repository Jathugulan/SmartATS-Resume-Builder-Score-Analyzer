const fs = require('fs');
const mammoth = require('mammoth');
const { normalizeText, evaluateTextQuality } = require('./textNormalizationService');

/**
 * Extracts complete text from a Microsoft Word (.docx) file.
 */
const extractDocxText = async (filePath) => {
  if (!fs.existsSync(filePath)) {
    throw {
      statusCode: 400,
      code: 'FILE_NOT_FOUND',
      message: 'DOCX file not found for extraction',
    };
  }

  try {
    const result = await mammoth.extractRawText({ path: filePath });
    const rawText = result.value || '';
    const normalizedText = normalizeText(rawText);
    const quality = evaluateTextQuality(normalizedText);

    if (!quality.isAcceptable) {
      throw {
        statusCode: 422,
        code: 'UNPROCESSABLE_DOCUMENT',
        message: quality.reason || 'Document contains insufficient readable text.',
        details: { wordCount: quality.wordCount },
      };
    }

    return {
      text: normalizedText,
      rawTextLength: rawText.length,
      pageCount: null, // DOCX does not have fixed pages without layout engine
      wordCount: quality.wordCount,
      parsingConfidence: quality.parsingConfidence,
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    throw {
      statusCode: 422,
      code: 'DOCX_PARSING_FAILED',
      message: 'Failed to extract text from DOCX document. The file may be corrupt or encrypted.',
      details: error.message,
    };
  }
};

module.exports = {
  extractDocxText,
};
