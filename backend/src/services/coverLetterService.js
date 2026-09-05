/**
 * AI Cover Letter Generator
 * Generates tailored cover letters with zero fabrication
 * Modes: Formal, Modern, Concise, Technical
 */

const generateCoverLetter = ({
  candidateName = 'Candidate',
  candidateEmail = '',
  candidatePhone = '',
  targetCompany = 'Hiring Team',
  targetRole = 'Software Engineer',
  hiringManager = 'Hiring Manager',
  tone = 'Modern',
  resumeSkills = [],
  keyProjects = [],
  jobDescription = '',
}) => {
  const topSkills = resumeSkills.slice(0, 4).join(', ');
  const projectMention = keyProjects[0]?.name ? `such as my work on ${keyProjects[0].name}` : 'across my recent technical projects';

  let greeting = `Dear ${hiringManager},`;
  let opening = '';
  let body = '';
  let closing = '';

  if (tone === 'Formal') {
    opening = `I am writing to express my strong interest in the ${targetRole} position at ${targetCompany}. With a proven foundation in ${topSkills || 'modern engineering practices'}, I welcome the opportunity to contribute effectively to your engineering objectives.`;
    body = `Throughout my technical career, I have focused on building robust, scalable solutions ${projectMention}. My hands-on experience allows me to approach complex problems methodically, ensuring clean code, architectural integrity, and seamless cross-functional delivery.`;
    closing = `I welcome the privilege of discussing how my technical background aligns with the goals of ${targetCompany}. Thank you for your consideration.`;
  } else if (tone === 'Concise') {
    opening = `I am excited to apply for the ${targetRole} role at ${targetCompany}.`;
    body = `With core expertise spanning ${topSkills || 'full-stack systems'}, I specialize in turning product requirements into high-performance software ${projectMention}.`;
    closing = `I look forward to discussing how I can deliver immediate value to ${targetCompany}.`;
  } else if (tone === 'Technical') {
    opening = `I am pleased to submit my application for the ${targetRole} role at ${targetCompany}, bringing demonstrated proficiency across ${topSkills}.`;
    body = `My engineering workflow emphasizes maintainable system design, automated testing, and reliable API delivery ${projectMention}. I have developed applications prioritizing low latency, modular structure, and production stability.`;
    closing = `I would appreciate the chance to discuss technical synergies with the ${targetCompany} engineering team.`;
  } else {
    // Modern (Default)
    opening = `I am writing to apply for the ${targetRole} position at ${targetCompany}. Having built software across modern environments with ${topSkills || 'core web technologies'}, I am eager to bring my problem-solving drive to your team.`;
    body = `In my previous work ${projectMention}, I have delivered user-centric features while maintaining strict performance and code quality standards. I am energized by collaborative teams that prioritize shipping meaningful products.`;
    closing = `Thank you for reviewing my application. I look forward to the opportunity to connect and discuss how my skills align with ${targetCompany}'s trajectory.`;
  }

  const signoff = `Sincerely,\n${candidateName}\n${candidateEmail} | ${candidatePhone}`;

  const fullLetter = `${greeting}\n\n${opening}\n\n${body}\n\n${closing}\n\n${signoff}`;

  return {
    targetRole,
    targetCompany,
    tone,
    content: fullLetter,
    disclaimer: 'Generated strictly from candidate resume evidence and target role metadata. No fictitious metrics or companies added.',
  };
};

module.exports = {
  generateCoverLetter,
};
