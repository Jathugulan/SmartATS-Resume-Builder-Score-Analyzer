/**
 * Text normalization service for cleaning extracted document text
 * while preserving semantic headings, lists, and formatting markers.
 */

const normalizeText = (rawText) => {
  if (!rawText || typeof rawText !== 'string') {
    return '';
  }

  let text = rawText;

  // 1. Normalize line endings to LF (\n)
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // 2. Remove null bytes and non-printable control characters (preserve tabs and newlines)
  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // 3. Normalize horizontal whitespace (spaces and tabs) on each line without collapsing newlines
  text = text
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n');

  // 4. Collapse 3 or more consecutive newlines into 2
  text = text.replace(/\n{3,}/g, '\n\n');

  // 5. Trim leading and trailing whitespace
  text = text.trim();

  return text;
};

const evaluateTextQuality = (normalizedText) => {
  const charCount = normalizedText.length;
  const words = normalizedText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (charCount === 0 || wordCount === 0) {
    return {
      isAcceptable: false,
      wordCount: 0,
      charCount: 0,
      reason: 'No readable text could be extracted from the document',
    };
  }

  if (wordCount < 25) {
    return {
      isAcceptable: false,
      wordCount,
      charCount,
      reason: 'Extracted text is too sparse (fewer than 25 words). Document may be image-only, scanned, or protected.',
    };
  }

  // Calculate parsing confidence based on dictionary-like token density and length
  let confidence = 0.95;
  if (wordCount < 100) {
    confidence = 0.70;
  } else if (wordCount < 200) {
    confidence = 0.85;
  }

  // Check character to word ratio (healthy English resumes usually average 4.5 to 7.5 chars per word)
  const avgCharsPerWord = charCount / wordCount;
  if (avgCharsPerWord > 12 || avgCharsPerWord < 3) {
    confidence -= 0.15;
  }

  confidence = Math.max(0.1, Math.min(1.0, parseFloat(confidence.toFixed(2))));

  return {
    isAcceptable: true,
    wordCount,
    charCount,
    parsingConfidence: confidence,
    reason: null,
  };
};

module.exports = {
  normalizeText,
  evaluateTextQuality,
};
