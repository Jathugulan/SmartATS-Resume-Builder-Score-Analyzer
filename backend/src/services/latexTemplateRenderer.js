/**
 * LaTeX Template Rendering & Escaping Engine
 * Accurately merges unified resume data into LaTeX templates while preserving exact syntax
 * Exactly 4 ATS-Compliant Templates strictly adhering to the mandatory section order:
 * 1. Professional Summary
 * 2. Education
 * 3. Technical Skills
 * 4. Experience
 * 5. Projects
 * 6. Certifications
 * 7. Referees
 */

const {
  TEMPLATE_01_RAW,
  TEMPLATE_02_RAW,
  TEMPLATE_03_RAW,
  TEMPLATE_04_RAW,
} = require('../templates/seedTemplates');

/**
 * Escapes LaTeX special characters
 */
const escapeLatex = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/&/g, '\\&')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
};

/**
 * Normalizes technical skills into an array of { category, skills }
 */
const normalizeTechnicalSkills = (data) => {
  if (Array.isArray(data.technicalSkills) && data.technicalSkills.length > 0) {
    return data.technicalSkills.map((ts) => ({
      category: escapeLatex(ts.category || 'Skills'),
      skills: escapeLatex(ts.skills || ''),
    }));
  }

  // Fallback to legacy skills object if technicalSkills array is empty
  const s = data.skills || {};
  const categories = [];

  if (s.programmingLanguages && s.programmingLanguages.length > 0) {
    categories.push({
      category: 'Programming Languages',
      skills: s.programmingLanguages.map(escapeLatex).join(', '),
    });
  }
  if (s.frameworks && s.frameworks.length > 0) {
    categories.push({
      category: 'Frontend & Frameworks',
      skills: s.frameworks.map(escapeLatex).join(', '),
    });
  }
  if (s.databases && s.databases.length > 0) {
    categories.push({
      category: 'Databases & Cloud',
      skills: [
        ...(s.databases || []),
        ...(s.cloud || []),
      ].map(escapeLatex).join(', '),
    });
  }
  if (s.tools && s.tools.length > 0) {
    categories.push({
      category: 'Developer Tools',
      skills: s.tools.map(escapeLatex).join(', '),
    });
  }
  if (categories.length === 0 && s.technical && s.technical.length > 0) {
    categories.push({
      category: 'Core Competencies',
      skills: s.technical.map(escapeLatex).join(', '),
    });
  }

  if (categories.length === 0) {
    categories.push(
      { category: 'Programming Languages', skills: 'Python, TypeScript, JavaScript, SQL, C++' },
      { category: 'Frameworks & Tools', skills: 'React, Node.js, Express, Docker, Git' }
    );
  }

  return categories;
};

/**
 * Normalizes education items
 */
const normalizeEducation = (eduList = []) => {
  return eduList.map((ed) => {
    const period = [ed.startDate, ed.endDate || 'Present'].filter(Boolean).map(escapeLatex).join(' -- ') || '2020 -- 2024';
    const grade = ed.grade ? ` (GPA: ${escapeLatex(ed.grade)})` : '';
    return {
      institution: escapeLatex(ed.institution || 'University'),
      location: escapeLatex(ed.location || ''),
      degree: escapeLatex(ed.degree || 'Degree'),
      grade,
      period,
      description: escapeLatex(ed.description || ''),
    };
  });
};

/**
 * Normalizes experience items
 */
const normalizeExperience = (expList = []) => {
  return expList.map((e) => {
    const period = [e.startDate, e.endDate || 'Present'].filter(Boolean).map(escapeLatex).join(' -- ') || '2022 -- Present';
    const employmentType = e.employmentType ? ` (${escapeLatex(e.employmentType)})` : '';
    const bullets = (e.bulletPoints && e.bulletPoints.length > 0 ? e.bulletPoints : [e.description || 'Delivered key features']).filter(Boolean).map(escapeLatex);
    return {
      company: escapeLatex(e.company || 'Company'),
      location: escapeLatex(e.location || ''),
      role: escapeLatex(e.role || 'Job Title'),
      employmentType,
      period,
      bullets,
    };
  });
};

/**
 * Normalizes projects
 */
const normalizeProjects = (projList = []) => {
  return projList.map((p) => {
    const period = [p.startDate || p.date, p.endDate].filter(Boolean).map(escapeLatex).join(' -- ') || escapeLatex(p.date || '2023');
    const technologies = Array.isArray(p.technologies)
      ? p.technologies.map(escapeLatex).join(', ')
      : escapeLatex(p.technologies || '');
    const bullets = (p.bulletPoints && p.bulletPoints.length > 0 ? p.bulletPoints : []).filter(Boolean).map(escapeLatex);
    const url = escapeLatex((p.url || p.github || '').replace(/^https?:\/\//i, ''));
    return {
      name: escapeLatex(p.name || 'Project Name'),
      technologies,
      period,
      url,
      description: escapeLatex(p.description || ''),
      bullets,
    };
  });
};

/**
 * Normalizes certifications
 */
const normalizeCertifications = (certList = []) => {
  return certList.map((c) => {
    if (typeof c === 'string') {
      return { name: escapeLatex(c), issuer: '', date: '', credentialId: '' };
    }
    return {
      name: escapeLatex(c.name || 'Certification'),
      issuer: escapeLatex(c.issuer || ''),
      date: escapeLatex(c.date || ''),
      credentialId: escapeLatex(c.credentialId || ''),
    };
  });
};

/**
 * Normalizes referees
 */
const normalizeReferees = (refList = []) => {
  return refList.map((r) => ({
    fullName: escapeLatex(r.fullName || 'Referee Name'),
    position: escapeLatex(r.position || 'Position'),
    organization: escapeLatex(r.organization || 'Organization'),
    email: escapeLatex(r.email || ''),
    phone: escapeLatex(r.phone || ''),
    relationship: escapeLatex(r.relationship || ''),
  }));
};

/**
 * Renders structured resume data into compilable LaTeX for the specified template
 */
const renderLatexResume = (resumeData, templateId = 'template-01') => {
  const data = resumeData || {};
  const personal = data.personal || {};

  const fullName = escapeLatex(personal.fullName || 'Alex Morgan');
  const email = escapeLatex(personal.email || 'candidate@email.com');
  const phone = escapeLatex(personal.phone || '+1 (555) 234-5678');
  const location = escapeLatex(personal.location || 'San Francisco, CA');
  const linkedin = escapeLatex((personal.linkedin || 'linkedin.com/in/candidate').replace(/^https?:\/\//i, ''));
  const github = escapeLatex((personal.github || 'github.com/candidate').replace(/^https?:\/\//i, ''));
  const summary = escapeLatex(data.summary || '');

  // Split name for ModernCV (Template-03)
  const nameParts = (personal.fullName || 'Alex Morgan').trim().split(/\s+/);
  const firstName = escapeLatex(nameParts[0] || 'Alex');
  const lastName = escapeLatex(nameParts.slice(1).join(' ') || 'Morgan');

  const education = normalizeEducation(data.education);
  const technicalSkills = normalizeTechnicalSkills(data);
  const experience = normalizeExperience(data.experience);
  const projects = normalizeProjects(data.projects);
  const certifications = normalizeCertifications(data.certifications);
  const referees = normalizeReferees(data.referees);

  // Select raw template based on ID
  let raw = TEMPLATE_01_RAW;
  if (templateId === 'template-02' || templateId === 'builtin-02') raw = TEMPLATE_02_RAW;
  else if (templateId === 'template-03' || templateId === 'builtin-03') raw = TEMPLATE_03_RAW;
  else if (templateId === 'template-04' || templateId === 'builtin-04') raw = TEMPLATE_04_RAW;

  let tex = raw;

  // Personal substitutions
  tex = tex.replace(/{{fullName}}/g, fullName);
  tex = tex.replace(/{{firstName}}/g, firstName);
  tex = tex.replace(/{{lastName}}/g, lastName);
  tex = tex.replace(/{{email}}/g, email);
  tex = tex.replace(/{{phone}}/g, phone);
  tex = tex.replace(/{{location}}/g, location);
  tex = tex.replace(/{{linkedin}}/g, linkedin);
  tex = tex.replace(/{{github}}/g, github);

  // 1. Professional Summary
  if (summary) {
    tex = tex.replace('{{#if summary}}', '').replace('{{summary}}', summary).replace('{{/if}}', '');
  } else {
    tex = tex.replace(/{{#if summary}}[\s\S]*?{{\/if}}/, '');
  }

  // 2. Education
  if (templateId === 'template-03' || templateId === 'builtin-03') {
    let eduTex = '';
    education.forEach((ed) => {
      eduTex += `\\customcventry{ ${ed.period} }{ ${ed.institution} }{ ${ed.degree}${ed.grade} }{ ${ed.location} }{}{}{ ${ed.description} }\n`;
    });
    tex = tex.replace(/{{#each education}}[\s\S]*?{{\/each}}/, eduTex);
  } else {
    let eduTex = '';
    education.forEach((ed) => {
      eduTex += `  \\resumeSubheading\n    { ${ed.institution} }{ ${ed.location} }\n    { ${ed.degree}${ed.grade} }{ ${ed.period} }\n`;
      if (ed.description) {
        eduTex += `    \\resumeItemListStart\n      \\resumeItem{ ${ed.description} }\n    \\resumeItemListEnd\n`;
      }
    });
    tex = tex.replace(/{{#each education}}[\s\S]*?{{\/each}}/, eduTex);
  }

  // 3. Technical Skills
  if (templateId === 'template-01' || templateId === 'template-04' || templateId === 'builtin-01' || templateId === 'builtin-04') {
    let skillTex = '';
    technicalSkills.forEach((ts) => {
      skillTex += `    \\textbf{ ${ts.category} }{: ${ts.skills} } \\\\\n`;
    });
    tex = tex.replace(/{{#each technicalSkills}}[\s\S]*?{{\/each}}/, skillTex);
  } else if (templateId === 'template-02' || templateId === 'builtin-02') {
    let skillTex = '';
    technicalSkills.forEach((ts) => {
      skillTex += `  \\resumeItem{\\textbf{ ${ts.category} }: ${ts.skills} }\n`;
    });
    tex = tex.replace(/{{#each technicalSkills}}[\s\S]*?{{\/each}}/, skillTex);
  } else if (templateId === 'template-03' || templateId === 'builtin-03') {
    let skillTex = '';
    technicalSkills.forEach((ts) => {
      skillTex += `\\item {\\textbf{ ${ts.category}: } ${ts.skills} }\n`;
    });
    tex = tex.replace(/{{#each technicalSkills}}[\s\S]*?{{\/each}}/, skillTex);
  }

  // 4. Experience
  if (templateId === 'template-03' || templateId === 'builtin-03') {
    let expTex = '';
    experience.forEach((e) => {
      expTex += `\\customcventry{ ${e.period} }{ ${e.company} }{ ${e.role}${e.employmentType} }{ ${e.location} }{}{\n{\\begin{itemize}[leftmargin=0.6cm, label={\\textbullet}]\n`;
      e.bullets.forEach((b) => {
        expTex += `\\item ${b}\n`;
      });
      expTex += `\\end{itemize}}}\n\n`;
    });
    tex = tex.replace(/{{#each experience}}[\s\S]*?{{\/each}}/, expTex);
  } else {
    let expTex = '';
    experience.forEach((e) => {
      expTex += `  \\resumeSubheading\n    { ${e.company} }{ ${e.location} }\n    { ${e.role}${e.employmentType} }{ ${e.period} }\n    \\resumeItemListStart\n`;
      e.bullets.forEach((b) => {
        expTex += `      \\resumeItem{ ${b} }\n`;
      });
      expTex += `    \\resumeItemListEnd\n`;
    });
    tex = tex.replace(/{{#each experience}}[\s\S]*?{{\/each}}/, expTex);
  }

  // 5. Projects
  if (templateId === 'template-03' || templateId === 'builtin-03') {
    let projTex = '';
    projects.forEach((p) => {
      projTex += `\\customcventry{ ${p.period} }{ ${p.name} }{ ${p.technologies} }{ ${p.url} }{}{\n{\\begin{itemize}[leftmargin=0.6cm, label={\\textbullet}]\n`;
      if (p.description) projTex += `\\item ${p.description}\n`;
      p.bullets.forEach((b) => {
        projTex += `\\item ${b}\n`;
      });
      projTex += `\\end{itemize}}}\n\n`;
    });
    tex = tex.replace(/{{#each projects}}[\s\S]*?{{\/each}}/, projTex);
  } else if (templateId === 'template-02' || templateId === 'builtin-02') {
    let projTex = '';
    projects.forEach((p) => {
      projTex += `  \\resumeSubheading\n      { ${p.name} }{ ${p.period} }\n      { ${p.technologies} }{ ${p.url} }\n      \\resumeSubHeadingList\n`;
      if (p.description) projTex += `        \\resumeItem{\\textbullet\\ ${p.description}}\n`;
      p.bullets.forEach((b) => {
        projTex += `        \\resumeItem{\\textbullet\\ ${b}}\n`;
      });
      projTex += `      \\resumeSubHeadingListEnd\n`;
    });
    tex = tex.replace(/{{#each projects}}[\s\S]*?{{\/each}}/, projTex);
  } else {
    let projTex = '';
    projects.forEach((p) => {
      projTex += `  \\resumeProjectHeading\n    { ${p.name} }{ ${p.technologies} }{ ${p.period} }{ ${p.url} }\n    \\resumeItemListStart\n`;
      if (p.description) projTex += `      \\resumeItem{ ${p.description} }\n`;
      p.bullets.forEach((b) => {
        projTex += `      \\resumeItem{ ${b} }\n`;
      });
      projTex += `    \\resumeItemListEnd\n`;
    });
    tex = tex.replace(/{{#each projects}}[\s\S]*?{{\/each}}/, projTex);
  }

  // 6. Certifications
  if (certifications.length > 0) {
    if (templateId === 'template-02' || templateId === 'builtin-02') {
      let cTex = '';
      certifications.forEach((c) => {
        const cred = c.credentialId ? `, ID: ${c.credentialId}` : '';
        cTex += `  \\resumeItem{\\textbullet\\ \\textbf{ ${c.name} } -- ${c.issuer} (${c.date}${cred})}\n`;
      });
      tex = tex.replace('{{#if certifications.length}}', '').replace(/{{#each certifications}}[\s\S]*?{{\/each}}/, cTex).replace('{{/if}}', '');
    } else if (templateId === 'template-03' || templateId === 'builtin-03') {
      let cTex = '';
      certifications.forEach((c) => {
        const cred = c.credentialId ? `, ID: ${c.credentialId}` : '';
        cTex += `  \\item \\textbf{ ${c.name} } -- ${c.issuer} (Issued: ${c.date}${cred})\n`;
      });
      tex = tex.replace('{{#if certifications.length}}', '').replace(/{{#each certifications}}[\s\S]*?{{\/each}}/, cTex).replace('{{/if}}', '');
    } else {
      let cTex = '';
      certifications.forEach((c) => {
        const cred = c.credentialId ? `, ID: ${c.credentialId}` : '';
        cTex += `    \\textbf{ ${c.name} } \\textbar\\ ${c.issuer} (Issued: ${c.date}${cred}) \\\\\n`;
      });
      tex = tex.replace('{{#if certifications.length}}', '').replace(/{{#each certifications}}[\s\S]*?{{\/each}}/, cTex).replace('{{/if}}', '');
    }
  } else {
    tex = tex.replace(/{{#if certifications\.length}}[\s\S]*?{{\/if}}/, '');
  }

  // 7. Referees
  if (referees.length > 0) {
    if (templateId === 'template-02' || templateId === 'builtin-02') {
      let rTex = '';
      referees.forEach((r) => {
        const rel = r.relationship ? ` $|$ ${r.relationship}` : '';
        rTex += `  \\resumeItem{\\textbf{ ${r.fullName} } -- ${r.position}, ${r.organization} $|$ Email: ${r.email} $|$ Phone: ${r.phone}${rel}}\n`;
      });
      tex = tex.replace('{{#if referees.length}}', '').replace(/{{#each referees}}[\s\S]*?{{\/each}}/, rTex).replace('{{/if}}', '');
    } else if (templateId === 'template-03' || templateId === 'builtin-03') {
      let rTex = '';
      referees.forEach((r) => {
        const rel = r.relationship ? ` \\textbar\\ ${r.relationship}` : '';
        rTex += `  \\item \\textbf{ ${r.fullName} } -- ${r.position}, ${r.organization} \\textbar\\ Email: ${r.email} \\textbar\\ Phone: ${r.phone}${rel}\n`;
      });
      tex = tex.replace('{{#if referees.length}}', '').replace(/{{#each referees}}[\s\S]*?{{\/each}}/, rTex).replace('{{/if}}', '');
    } else {
      let rTex = '';
      referees.forEach((r) => {
        const rel = r.relationship ? ` \\ \\textbar\\ \\ Relationship: ${r.relationship}` : '';
        rTex += `    \\textbf{ ${r.fullName} } -- ${r.position}, ${r.organization} \\\\\n    Email: ${r.email} \\ \\textbar\\ \\ Phone: ${r.phone}${rel} \\\\ \\vspace{2pt}\n`;
      });
      tex = tex.replace('{{#if referees.length}}', '').replace(/{{#each referees}}[\s\S]*?{{\/each}}/, rTex).replace('{{/if}}', '');
    }
  } else {
    tex = tex.replace(/{{#if referees\.length}}[\s\S]*?{{\/if}}/, '');
  }

  return tex;
};

module.exports = {
  renderLatexResume,
  escapeLatex,
};
