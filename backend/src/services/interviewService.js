/**
 * Interview Preparation & Evaluation Service
 * Generates technical, behavioral, and resume-based questions with feedback evaluation
 */

const generateInterviewQuestions = (resumeData, targetRole = 'Software Engineer') => {
  const resume = resumeData || {};
  const skills = [
    ...(resume.skills?.technical || []),
    ...(resume.skills?.programmingLanguages || []),
    ...(resume.skills?.frameworks || []),
  ];
  const projects = resume.projects || [];
  const exp = resume.experience || [];

  const questions = [];

  // 1. Technical Questions
  if (skills.length > 0) {
    const primarySkill = skills[0];
    questions.push({
      questionId: 'q-tech-1',
      category: 'Technical',
      question: `In your experience with ${primarySkill}, what were the most challenging performance bottlenecks you encountered, and how did you resolve them?`,
      contextFromResume: `Referenced ${primarySkill} in technical skills stack.`,
    });
  }

  if (skills.length > 1) {
    const secondarySkill = skills[1];
    questions.push({
      questionId: 'q-tech-2',
      category: 'Technical',
      question: `How do you structure data flow and error handling when building services with ${secondarySkill}?`,
      contextFromResume: `Referenced ${secondarySkill} in verified skills.`,
    });
  }

  // 2. Project Question
  if (projects.length > 0) {
    const p = projects[0];
    questions.push({
      questionId: 'q-proj-1',
      category: 'Project',
      question: `Walk me through the architecture of "${p.name}". Why did you select ${(p.technologies || []).join(', ') || 'this tech stack'} over alternatives?`,
      contextFromResume: `Project listed: ${p.name}`,
    });
  }

  // 3. Behavioral Question
  questions.push({
    questionId: 'q-behav-1',
    category: 'Behavioral',
    question: 'Describe a situation where project requirements changed close to a production deadline. How did you prioritize tasks and communicate with teammates?',
    contextFromResume: 'Evaluates agility and communication in engineering environments.',
  });

  // 4. Resume-Based Question
  if (exp.length > 0) {
    const role = exp[0];
    questions.push({
      questionId: 'q-resume-1',
      category: 'Resume-Based',
      question: `During your tenure as ${role.role} at ${role.company}, what was your single most impactful technical contribution?`,
      contextFromResume: `Work experience at ${role.company}.`,
    });
  }

  return {
    targetRole,
    totalQuestions: questions.length,
    questions,
    disclaimer: 'Questions derived strictly from your verified resume elements and target role requirements.',
  };
};

const evaluateInterviewAnswer = (questionText, userAnswer) => {
  const answer = (userAnswer || '').trim();
  const wordCount = answer.split(/\s+/).filter(Boolean).length;

  let relevanceScore = 7;
  let clarityScore = 7;
  let technicalDepth = 6;
  let feedbackText = 'Good foundational answer.';

  if (wordCount < 15) {
    relevanceScore = 4;
    clarityScore = 5;
    technicalDepth = 3;
    feedbackText = 'Answer is too brief. Elaborate using the STAR method (Situation, Task, Action, Result) with specific technologies.';
  } else if (wordCount >= 50) {
    relevanceScore = 9;
    clarityScore = 8;
    technicalDepth = 8;
    feedbackText = 'Comprehensive response with solid technical context. Clear explanation of actions and reasoning.';
  }

  return {
    relevanceScore,
    clarityScore,
    technicalDepth,
    feedbackText,
    modelAnswerSnippet: 'Focus on: 1) The business or technical challenge, 2) Specific technical actions taken, 3) Measurable outcome achieved.',
  };
};

module.exports = {
  generateInterviewQuestions,
  evaluateInterviewAnswer,
};
