const fs = require('fs');
const pdfParse = require('pdf-parse');
const { normalizeText, evaluateTextQuality } = require('./textNormalizationService');

/**
 * Extracts complete text from a PDF file across all pages.
 */
const extractPdfText = async (filePath) => {
  if (!fs.existsSync(filePath)) {
    throw {
      statusCode: 400,
      code: 'FILE_NOT_FOUND',
      message: 'PDF file not found for extraction',
    };
  }

  const dataBuffer = fs.readFileSync(filePath);

  try {
    const pdfData = await pdfParse(dataBuffer);

    const rawText = pdfData.text || '';
    const pageCount = pdfData.numpages || 1;
    const normalizedText = normalizeText(rawText);
    const quality = evaluateTextQuality(normalizedText);

    if (!quality.isAcceptable) {
      throw {
        statusCode: 422,
        code: 'UNPROCESSABLE_DOCUMENT',
        message: quality.reason || 'Document contains no selectable or readable text. Image-based or scanned PDFs are not supported without OCR.',
        details: { pageCount, wordCount: quality.wordCount },
      };
    }

    return {
      text: normalizedText,
      rawTextLength: rawText.length,
      pageCount,
      wordCount: quality.wordCount,
      parsingConfidence: quality.parsingConfidence,
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    throw {
      statusCode: 422,
      code: 'PDF_PARSING_FAILED',
      message: 'Failed to extract text from PDF document. The file may be corrupt, password-protected, or in an unsupported PDF specification.',
      details: error.message,
    };
  }
};

module.exports = {
  extractPdfText,
};
