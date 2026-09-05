/**
 * Achievement Bullet Generator
 * Structures bullets as: ACTION + TECHNOLOGY + TASK + IMPACT
 * Enforces zero-fabrication: Never invents numbers; prompts with [Add measurable result if available]
 */

const ACTION_VERBS = [
  'Developed',
  'Implemented',
  'Architected',
  'Designed',
  'Optimized',
  'Automated',
  'Integrated',
  'Built',
  'Engineered',
  'Streamlined',
  'Migrated',
  'Refactored',
];

const improveBulletPoint = (rawBullet, detectedTech = []) => {
  const text = (rawBullet || '').trim();
  if (!text) return '';

  // Check if bullet already has a quantified metric
  const hasMetric = /\b(\d+%|\$[\d,]+|\d+x|\d+\s*(users|clients|ms|seconds|records))\b/i.test(text);

  // Extract or choose action verb
  let action = ACTION_VERBS[0];
  const firstWord = text.split(/\s+/)[0];
  if (ACTION_VERBS.some((v) => v.toLowerCase() === firstWord.toLowerCase())) {
    action = firstWord;
  } else {
    action = ACTION_VERBS[Math.floor(Math.random() * ACTION_VERBS.length)];
  }

  // Find technologies mentioned in bullet or fallback to detectedTech
  const techUsed = detectedTech.filter((t) => new RegExp(`\\b${t}\\b`, 'i').test(text));
  const techPhrase = techUsed.length > 0 ? `utilizing ${techUsed.slice(0, 2).join(' and ')}` : '';

  // Clean the core task
  let coreTask = text.replace(/^(worked on|helped with|responsible for|did|assisted in)/i, '').trim();
  coreTask = coreTask.replace(/^[a-z]/, (c) => c.toLowerCase());

  let improved = `${action} ${coreTask}`;
  if (techPhrase && !improved.toLowerCase().includes(techPhrase.toLowerCase())) {
    improved += ` ${techPhrase}`;
  }

  if (hasMetric) {
    return improved;
  }

  // Honest placeholder: prompt user to provide their real metric without inventing numbers
  return `${improved}, achieving [Add measurable result if available, e.g. 25% performance improvement or 10k daily requests].`;
};

module.exports = {
  improveBulletPoint,
  ACTION_VERBS,
};
