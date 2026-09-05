/**
 * AI Resume Chat Assistant
 * Context-aware conversational assistant responding to user questions about their resume and ATS scores
 */

const answerResumeQuery = (userQuery, resumeContext = {}) => {
  const query = (userQuery || '').toLowerCase();
  const resume = resumeContext.resume || {};
  const score = resumeContext.atsScore || 88;
  const skills = [
    ...(resume.skills?.technical || []),
    ...(resume.skills?.programmingLanguages || []),
  ];

  if (query.includes('how') && query.includes('improve') || query.includes('score')) {
    return {
      response: `Your current ATS score is **${score}/100**. Here are the highest-leverage actions to reach 95+:
1. **Add Quantified Metrics**: Ensure experience bullet points highlight specific percentage, revenue, or scale results (e.g. *improved API response time by 25%*).
2. **Close Target JD Keyword Gaps**: When targeting specific roles, verify that all non-negotiable tools mentioned in the job description appear naturally in your experience.
3. **Keep Section Headers Standard**: Stick to recognized headings (*Professional Experience*, *Education*, *Technical Skills*).`,
      suggestedActions: ['Run ATS Simulator', 'Optimize Bullets', 'Match Target JD'],
    };
  }

  if (query.includes('summary') || query.includes('headline')) {
    return {
      response: `Your professional summary should be 3-4 lines emphasizing your primary domain, years of practical experience, and top 4 core tools:
*"Results-driven ${resume.personal?.professionalTitle || 'Software Engineer'} specializing in ${skills.slice(0, 3).join(', ') || 'modern web systems'}. Proven track record designing scalable architectures, optimizing workflow throughput, and shipping reliable applications."*`,
      suggestedActions: ['Edit Summary', 'Apply to Resume'],
    };
  }

  if (query.includes('missing') || query.includes('gap') || query.includes('skills')) {
    return {
      response: `Based on current technical benchmarks for **${resume.personal?.professionalTitle || 'Full Stack Engineering'}**, industry roles frequently look for:
- Cloud/Containerization: **Docker, AWS, or GCP**
- Modern Workflow: **CI/CD Automation, Unit Testing (Jest/Pytest)**
If you have worked with these technologies, adding them to your skills and referencing them in projects will immediately boost your match score.`,
      suggestedActions: ['View Skill Gaps', 'See Learning Roadmap'],
    };
  }

  if (query.includes('cover letter')) {
    return {
      response: `I can formulate a tailored Cover Letter highlighting your work with ${skills.slice(0, 3).join(', ')}. Head over to the **Cover Letter Builder** in the sidebar to generate a Formal, Modern, or Technical version in one click!`,
      suggestedActions: ['Open Cover Letter Builder'],
    };
  }

  // Default context response
  return {
    response: `I am your AI Resume Intelligence Assistant with full context of your profile (${resume.personal?.fullName || 'Candidate'}, ATS Score: ${score}). 
You can ask me to:
- *"Explain my ATS score breakdown"*
- *"How do I improve my experience bullets?"*
- *"What keywords am I missing for a Senior role?"*
- *"Generate interview practice questions"*\nHow can I help optimize your resume today?`,
    suggestedActions: ['Explain ATS Score', 'Optimize Resume', 'Prepare for Interview'],
  };
};

module.exports = {
  answerResumeQuery,
};
