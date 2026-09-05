/**
 * Client-Side LaTeX Generator & Escaping Utility
 * Produces complete compilable LaTeX for all 4 templates in the exact required order:
 * 1. Professional Summary
 * 2. Education
 * 3. Technical Skills
 * 4. Experience
 * 5. Projects
 * 6. Certifications
 * 7. Referees
 */

export const escapeLatex = (str) => {
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

export const generateClientLatex = (resumeData, templateId = 'template-01') => {
  const data = resumeData || {};
  const personal = data.personal || {};

  const fullName = escapeLatex(personal.fullName || 'Alex Morgan');
  const location = escapeLatex(personal.location || 'San Francisco, CA');
  const phone = escapeLatex(personal.phone || '+1 (555) 234-5678');
  const email = escapeLatex(personal.email || 'alex.morgan@email.com');
  const github = escapeLatex((personal.github || 'github.com/alexmorgan').replace(/^https?:\/\//i, ''));
  const linkedin = escapeLatex((personal.linkedin || 'linkedin.com/in/alexmorgan').replace(/^https?:\/\//i, ''));
  const summary = escapeLatex(data.summary || '');

  // Split name for ModernCV (Template-03)
  const nameParts = (personal.fullName || 'Alex Morgan').trim().split(/\s+/);
  const firstName = escapeLatex(nameParts[0] || 'Alex');
  const lastName = escapeLatex(nameParts.slice(1).join(' ') || 'Morgan');

  // 2. Education
  const education = (data.education || []).map((ed) => {
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

  // 3. Technical Skills
  let technicalSkills = [];
  if (Array.isArray(data.technicalSkills) && data.technicalSkills.length > 0) {
    technicalSkills = data.technicalSkills.map((ts) => ({
      category: escapeLatex(ts.category || 'Skills'),
      skills: escapeLatex(ts.skills || ''),
    }));
  } else {
    const s = data.skills || {};
    if (s.programmingLanguages?.length > 0) {
      technicalSkills.push({ category: 'Programming Languages', skills: s.programmingLanguages.map(escapeLatex).join(', ') });
    }
    if (s.frameworks?.length > 0) {
      technicalSkills.push({ category: 'Frontend & Frameworks', skills: s.frameworks.map(escapeLatex).join(', ') });
    }
    if (s.databases?.length > 0 || s.cloud?.length > 0) {
      technicalSkills.push({ category: 'Databases & Cloud', skills: [...(s.databases || []), ...(s.cloud || [])].map(escapeLatex).join(', ') });
    }
    if (s.tools?.length > 0) {
      technicalSkills.push({ category: 'Developer Tools', skills: s.tools.map(escapeLatex).join(', ') });
    }
    if (technicalSkills.length === 0 && s.technical?.length > 0) {
      technicalSkills.push({ category: 'Core Competencies', skills: s.technical.map(escapeLatex).join(', ') });
    }
    if (technicalSkills.length === 0) {
      technicalSkills.push(
        { category: 'Programming Languages', skills: 'Python, TypeScript, JavaScript, SQL, Go' },
        { category: 'Frameworks & Tools', skills: 'React, Node.js, Express, Docker, Git, AWS' }
      );
    }
  }

  // 4. Experience
  const experience = (data.experience || []).map((e) => {
    const period = [e.startDate, e.endDate || 'Present'].filter(Boolean).map(escapeLatex).join(' -- ') || '2022 -- Present';
    const employmentType = e.employmentType ? ` (${escapeLatex(e.employmentType)})` : '';
    const bullets = (e.bulletPoints && e.bulletPoints.length > 0 ? e.bulletPoints : [e.description || 'Delivered key engineering solutions']).filter(Boolean).map(escapeLatex);
    return {
      company: escapeLatex(e.company || 'Company'),
      location: escapeLatex(e.location || ''),
      role: escapeLatex(e.role || 'Job Title'),
      employmentType,
      period,
      bullets,
    };
  });

  // 5. Projects
  const projects = (data.projects || []).map((p) => {
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

  // 6. Certifications
  const certifications = (data.certifications || []).map((c) => {
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

  // 7. Referees
  const referees = (data.referees || []).map((r) => ({
    fullName: escapeLatex(r.fullName || 'Referee Name'),
    position: escapeLatex(r.position || 'Position'),
    organization: escapeLatex(r.organization || 'Organization'),
    email: escapeLatex(r.email || ''),
    phone: escapeLatex(r.phone || ''),
    relationship: escapeLatex(r.relationship || ''),
  }));

  // ==========================================
  // TEMPLATE 01: Classic Professional
  // ==========================================
  if (templateId === 'template-01' || templateId === 'builtin-01') {
    let tex = `\\documentclass[a4paper,11pt]{article}
\\usepackage{latexsym}
\\usepackage{xcolor}
\\usepackage{float}
\\usepackage{ragged2e}
\\usepackage[empty]{fullpage}
\\usepackage{tabularx}
\\usepackage{titlesec}
\\usepackage{geometry}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage{fontawesome5}
\\usepackage[T1]{fontenc}

\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}
\\geometry{left=1.4cm, top=1.0cm, right=1.4cm, bottom=1.0cm}

\\urlstyle{same}
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-3pt}\\scshape\\raggedright\\large\\bfseries
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Custom commands
\\newcommand{\\resumeItem}[1]{\\item\\small{#1 \\vspace{-1.5pt}}}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{0.5mm}\\item
    \\begin{tabular*}{0.98\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
        \\textbf{#1} & \\textit{\\footnotesize{#2}} \\\\
        \\textit{\\footnotesize{#3}} & \\footnotesize{#4} \\\\
    \\end{tabular*}
    \\vspace{-2.4mm}
}

\\newcommand{\\resumeProjectHeading}[4]{
  \\vspace{0.5mm}\\item
    \\begin{tabular*}{0.98\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
        \\textbf{#1} \\textbar\\ \\footnotesize{\\textit{#2}} & \\textit{\\footnotesize{#3}} \\\\
    \\end{tabular*}
    \\ifx&#4&\\else{\\footnotesize{\\href{#4}{#4}}}\\fi
    \\vspace{-2.4mm}
}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=*,labelsep=0mm]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}\\vspace{-1mm}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}[leftmargin=3ex, noitemsep, labelsep=1.2mm, itemsep=1.5pt]\\small}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-2mm}}

\\begin{document}
\\fontfamily{cmr}\\selectfont

%----------HEADING----------
\\begin{center}
  {\\Huge \\textbf{${fullName}}} \\\\ \\vspace{2pt}
  \\small
  \\faMapMarker*\\ ${location} \\ \\textbar\\ \\ 
  \\faPhone\\ ${phone} \\ \\textbar\\ \\ 
  \\href{mailto:${email}}{\\faEnvelope\\ ${email}} \\\\ \\vspace{2pt}
  \\href{https://${github}}{\\faGithub\\ ${github}} \\ \\textbar\\ \\ 
  \\href{https://${linkedin}}{\\faLinkedin\\ ${linkedin}}
\\end{center}
\\vspace{-4mm}
`;

    if (summary) {
      tex += `
%-----------1. PROFESSIONAL SUMMARY-----------
\\section{Professional Summary}
\\begin{justify}
\\small{${summary}}
\\end{justify}
\\vspace{-2mm}
`;
    }

    tex += `
%-----------2. EDUCATION-----------
\\section{Education}
\\resumeSubHeadingListStart
`;
    education.forEach((ed) => {
      tex += `  \\resumeSubheading
    {${ed.institution}}{${ed.location}}
    {${ed.degree}${ed.grade}}{${ed.period}}
`;
      if (ed.description) {
        tex += `    \\resumeItemListStart
      \\resumeItem{${ed.description}}
    \\resumeItemListEnd
`;
      }
    });
    tex += `\\resumeSubHeadingListEnd\n`;

    tex += `
%-----------3. TECHNICAL SKILLS-----------
\\section{Technical Skills}
\\begin{itemize}[leftmargin=*, label={}]
  \\small{\\item{
`;
    technicalSkills.forEach((ts) => {
      tex += `    \\textbf{${ts.category}}{: ${ts.skills}} \\\\\n`;
    });
    tex += `  }}
\\end{itemize}
\\vspace{-3mm}
`;

    tex += `
%-----------4. EXPERIENCE-----------
\\section{Experience}
\\resumeSubHeadingListStart
`;
    experience.forEach((e) => {
      tex += `  \\resumeSubheading
    {${e.company}}{${e.location}}
    {${e.role}${e.employmentType}}{${e.period}}
    \\resumeItemListStart
`;
      e.bullets.forEach((b) => {
        tex += `      \\resumeItem{${b}}\n`;
      });
      tex += `    \\resumeItemListEnd\n`;
    });
    tex += `\\resumeSubHeadingListEnd\n`;

    tex += `
%-----------5. PROJECTS-----------
\\section{Projects}
\\resumeSubHeadingListStart
`;
    projects.forEach((p) => {
      tex += `  \\resumeProjectHeading
    {${p.name}}{${p.technologies}}{${p.period}}{${p.url}}
    \\resumeItemListStart
`;
      if (p.description) {
        tex += `      \\resumeItem{${p.description}}\n`;
      }
      p.bullets.forEach((b) => {
        tex += `      \\resumeItem{${b}}\n`;
      });
      tex += `    \\resumeItemListEnd\n`;
    });
    tex += `\\resumeSubHeadingListEnd\n`;

    if (certifications.length > 0) {
      tex += `
%-----------6. CERTIFICATIONS-----------
\\section{Certifications}
\\begin{itemize}[leftmargin=*, label={}]
  \\small{\\item{
`;
      certifications.forEach((c) => {
        const cred = c.credentialId ? `, ID: ${c.credentialId}` : '';
        tex += `    \\textbf{${c.name}} \\textbar\\ ${c.issuer} (Issued: ${c.date}${cred}) \\\\\n`;
      });
      tex += `  }}
\\end{itemize}
\\vspace{-3mm}
`;
    }

    if (referees.length > 0) {
      tex += `
%-----------7. REFEREES-----------
\\section{Referees}
\\begin{itemize}[leftmargin=*, label={}]
  \\small{\\item{
`;
      referees.forEach((r) => {
        const rel = r.relationship ? ` \\ \\textbar\\ \\ Relationship: ${r.relationship}` : '';
        tex += `    \\textbf{${r.fullName}} -- ${r.position}, ${r.organization} \\\\\n    Email: ${r.email} \\ \\textbar\\ \\ Phone: ${r.phone}${rel} \\\\ \\vspace{2pt}\n`;
      });
      tex += `  }}
\\end{itemize}
`;
    }

    tex += `\n\\end{document}\n`;
    return tex;
  }

  // ==========================================
  // TEMPLATE 02: Modern ATS
  // ==========================================
  if (templateId === 'template-02' || templateId === 'builtin-02') {
    let tex = `\\documentclass[a4paper,10pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

% Font options
\\usepackage[sfdefault]{roboto}

\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Section formatting
\\titleformat{\\section}{\\Large\\bfseries\\scshape\\raggedright}{}{0em}{}[\\titlerule]

% Ensure PDF is machine readable / ATS parsable
\\pdfgentounicode=1

% Custom commands
\\newcommand{\\resumeItem}[1]{\\item\\small{#1}}
\\newcommand{\\resumeSubheading}[4]{
\\vspace{-1pt}\\item
  \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
    \\textbf{#1} & #2 \\\\
    \\textit{#3} & \\textit{#4} \\\\
  \\end{tabular*}\\vspace{-6pt}
}
\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}
\\newcommand{\\resumeSubHeadingList}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}

\\begin{document}

%----------HEADING----------
\\begin{center}
  \\textbf{\\Huge ${fullName}} \\\\ \\vspace{3pt}
  \\small ${location} $|$ ${phone} $|$ \\href{mailto:${email}}{${email}} $|$ 
  \\href{https://${linkedin}}{${linkedin}} $|$
  \\href{https://${github}}{${github}}
\\end{center}
`;

    if (summary) {
      tex += `
%-----------1. PROFESSIONAL SUMMARY-----------
\\section*{Professional Summary}
${summary}
`;
    }

    tex += `
%-----------2. EDUCATION-----------
\\section{Education}
\\resumeSubHeadingList
`;
    education.forEach((ed) => {
      tex += `  \\resumeSubheading
      {${ed.institution}}{${ed.location}}
      {${ed.degree}${ed.grade}}{${ed.period}}
`;
    });
    tex += `\\resumeSubHeadingListEnd\n`;

    tex += `
%-----------3. TECHNICAL SKILLS-----------
\\section{Technical Skills}
\\resumeSubHeadingList
`;
    technicalSkills.forEach((ts) => {
      tex += `  \\resumeItem{\\textbf{${ts.category}}: ${ts.skills}}\n`;
    });
    tex += `\\resumeSubHeadingListEnd\n`;

    tex += `
%-----------4. EXPERIENCE-----------
\\section{Experience}
\\resumeSubHeadingList
`;
    experience.forEach((e) => {
      tex += `  \\resumeSubheading
      {${e.company}}{${e.location}}
      {${e.role}${e.employmentType}}{${e.period}}
      \\resumeSubHeadingList
`;
      e.bullets.forEach((b) => {
        tex += `          \\resumeItem{\\textbullet\\ ${b}}\n`;
      });
      tex += `      \\resumeSubHeadingListEnd\n`;
    });
    tex += `\\resumeSubHeadingListEnd\n`;

    tex += `
%-----------5. PROJECTS-----------
\\section{Projects}
\\resumeSubHeadingList
`;
    projects.forEach((p) => {
      tex += `  \\resumeSubheading
      {${p.name}}{${p.period}}
      {${p.technologies}}{${p.url}}
      \\resumeSubHeadingList
`;
      if (p.description) {
        tex += `        \\resumeItem{\\textbullet\\ ${p.description}}\n`;
      }
      p.bullets.forEach((b) => {
        tex += `        \\resumeItem{\\textbullet\\ ${b}}\n`;
      });
      tex += `      \\resumeSubHeadingListEnd\n`;
    });
    tex += `\\resumeSubHeadingListEnd\n`;

    if (certifications.length > 0) {
      tex += `
%-----------6. CERTIFICATIONS-----------
\\section{Certifications}
\\resumeSubHeadingList
`;
      certifications.forEach((c) => {
        const cred = c.credentialId ? `, ID: ${c.credentialId}` : '';
        tex += `  \\resumeItem{\\textbullet\\ \\textbf{${c.name}} -- ${c.issuer} (${c.date}${cred})}\n`;
      });
      tex += `\\resumeSubHeadingListEnd\n`;
    }

    if (referees.length > 0) {
      tex += `
%-----------7. REFEREES-----------
\\section{Referees}
\\resumeSubHeadingList
`;
      referees.forEach((r) => {
        const rel = r.relationship ? ` $|$ ${r.relationship}` : '';
        tex += `  \\resumeItem{\\textbf{${r.fullName}} -- ${r.position}, ${r.organization} $|$ Email: ${r.email} $|$ Phone: ${r.phone}${rel}}\n`;
      });
      tex += `\\resumeSubHeadingListEnd\n`;
    }

    tex += `\n\\end{document}\n`;
    return tex;
  }

  // ==========================================
  // TEMPLATE 03: ModernCV Professional
  // ==========================================
  if (templateId === 'template-03' || templateId === 'builtin-03') {
    let tex = `\\documentclass[11pt,a4paper,sans]{moderncv}
\\moderncvstyle{banking}
\\moderncvcolor{black}
\\nopagenumbers{}

\\usepackage[utf8]{inputenc}
\\usepackage{ragged2e}
\\usepackage[scale=0.92]{geometry}
\\usepackage{import}
\\usepackage{multicol}
\\usepackage{enumitem}
\\usepackage{amssymb}
\\usepackage{fontawesome5}

\\name{${firstName}}{${lastName}}

\\newcommand*{\\customcventry}[7][.13em]{
\\begin{tabular}{@{}l}
{\\bfseries #4} \\\\
{\\itshape #3}
\\end{tabular}
\\hfill
\\begin{tabular}{l@{}}
{\\bfseries #5} \\\\
{\\itshape #2}
\\end{tabular}
\\ifx&#7&%
\\else{\\\\
\\begin{minipage}{\\maincolumnwidth}%
\\small#7%
\\end{minipage}}\\fi%
\\par\\addvspace{#1}}

\\begin{document}
\\makecvtitle
\\vspace*{-14mm}

\\begin{center}
\\small
\\faMobile*\\ ${phone} \\enspace\\textbar\\enspace 
\\faEnvelope\\ ${email} \\enspace\\textbar\\enspace 
\\faMapMarker*\\ ${location} \\\\ \\vspace{2pt}
\\faLinkedin\\ \\href{https://${linkedin}}{${linkedin}} \\enspace\\textbar\\enspace
\\faGithub\\ \\href{https://${github}}{${github}}
\\end{center}
`;

    if (summary) {
      tex += `
%-----------1. PROFESSIONAL SUMMARY-----------
\\section{Profile}
\\begin{justify}
${summary}
\\end{justify}
`;
    }

    tex += `
%-----------2. EDUCATION-----------
\\section{Education}
`;
    education.forEach((ed) => {
      tex += `\\customcventry{${ed.period}}{${ed.institution}}{${ed.degree}${ed.grade}}{${ed.location}}{}{}{${ed.description}}\n`;
    });

    tex += `
%-----------3. TECHNICAL SKILLS-----------
\\section{Areas of Expertise}
{\\begin{itemize}[label=\\textbullet, leftmargin=0.5cm]
`;
    technicalSkills.forEach((ts) => {
      tex += `\\item {\\textbf{${ts.category}:} ${ts.skills}}\n`;
    });
    tex += `\\end{itemize}}\n`;

    tex += `
%-----------4. EXPERIENCE-----------
\\section{Professional Experience}
`;
    experience.forEach((e) => {
      tex += `\\customcventry{${e.period}}{${e.company}}{${e.role}${e.employmentType}}{${e.location}}{}{
{\\begin{itemize}[leftmargin=0.6cm, label={\\textbullet}]
`;
      e.bullets.forEach((b) => {
        tex += `\\item ${b}\n`;
      });
      tex += `\\end{itemize}}}\n\n`;
    });

    tex += `
%-----------5. PROJECTS-----------
\\section{Projects}
`;
    projects.forEach((p) => {
      tex += `\\customcventry{${p.period}}{${p.name}}{${p.technologies}}{${p.url}}{}{
{\\begin{itemize}[leftmargin=0.6cm, label={\\textbullet}]
`;
      if (p.description) {
        tex += `\\item ${p.description}\n`;
      }
      p.bullets.forEach((b) => {
        tex += `\\item ${b}\n`;
      });
      tex += `\\end{itemize}}}\n\n`;
    });

    if (certifications.length > 0) {
      tex += `
%-----------6. CERTIFICATIONS-----------
\\section{Certifications}
{\\begin{itemize}[label=\\textbullet, leftmargin=0.5cm]
`;
      certifications.forEach((c) => {
        const cred = c.credentialId ? `, ID: ${c.credentialId}` : '';
        tex += `  \\item \\textbf{${c.name}} -- ${c.issuer} (Issued: ${c.date}${cred})\n`;
      });
      tex += `\\end{itemize}}\n`;
    }

    if (referees.length > 0) {
      tex += `
%-----------7. REFEREES-----------
\\section{Referees}
{\\begin{itemize}[label=\\textbullet, leftmargin=0.5cm]
`;
      referees.forEach((r) => {
        const rel = r.relationship ? ` \\textbar\\ ${r.relationship}` : '';
        tex += `  \\item \\textbf{${r.fullName}} -- ${r.position}, ${r.organization} \\textbar\\ Email: ${r.email} \\textbar\\ Phone: ${r.phone}${rel}\n`;
      });
      tex += `\\end{itemize}}\n`;
    }

    tex += `\n\\end{document}\n`;
    return tex;
  }

  // ==========================================
  // TEMPLATE 04: Minimal Developer
  // ==========================================
  let tex = `\\documentclass[a4paper,11pt]{article}

\\usepackage{fontawesome5}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

% Custom clean font
\\usepackage[default]{lato}

\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Section formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large\\bfseries
}{}{0em}{}[\\color{black}\\titlerule\\vspace{-5pt}]

\\pdfgentounicode=1

% Custom helper commands (Self-contained, no external files)
\\newcommand{\\resumeItem}[1]{\\item\\small{#1 \\vspace{-1.5pt}}}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-1pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-6pt}
}

\\newcommand{\\resumeProjectHeading}[4]{
  \\vspace{-1pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} $|$ \\textit{\\small#2} & #3 \\\\
    \\end{tabular*}
    \\ifx&#4&\\else{\\footnotesize{\\href{#4}{#4}}}\\fi
    \\vspace{-6pt}
}

\\newcommand{\\resumeSubHeadingList}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}\\vspace{-2mm}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}[leftmargin=0.2in, noitemsep, itemsep=2pt]\\small}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-2mm}}

\\begin{document}

%----------HEADING----------
\\begin{center}
  \\textbf{\\Huge ${fullName}} \\\\ \\vspace{3pt}
  \\small 
  \\faMapMarker*\\ ${location} \\ \\textbar\\ \\ 
  \\faPhone\\ ${phone} \\ \\textbar\\ \\ 
  \\href{mailto:${email}}{\\faEnvelope\\ ${email}} \\\\ \\vspace{2pt}
  \\href{https://${github}}{\\faGithub\\ ${github}} \\ \\textbar\\ \\ 
  \\href{https://${linkedin}}{\\faLinkedin\\ ${linkedin}}
\\end{center}
\\vspace{-3mm}
`;

  if (summary) {
    tex += `
%-----------1. PROFESSIONAL SUMMARY-----------
\\section{Professional Summary}
${summary}
`;
  }

  tex += `
%-----------2. EDUCATION-----------
\\section{Education}
\\resumeSubHeadingList
`;
  education.forEach((ed) => {
    tex += `  \\resumeSubheading
    {${ed.institution}}{${ed.location}}
    {${ed.degree}${ed.grade}}{${ed.period}}
`;
    if (ed.description) {
      tex += `    \\resumeItemListStart
      \\resumeItem{${ed.description}}
    \\resumeItemListEnd
`;
    }
  });
  tex += `\\resumeSubHeadingListEnd\n`;

  tex += `
%-----------3. TECHNICAL SKILLS-----------
\\section{Technical Skills}
\\begin{itemize}[leftmargin=0.15in, label={}]
  \\small{\\item{
`;
  technicalSkills.forEach((ts) => {
    tex += `    \\textbf{${ts.category}}{: ${ts.skills}} \\\\\n`;
  });
  tex += `  }}
\\end{itemize}
\\vspace{-3mm}
`;

  tex += `
%-----------4. EXPERIENCE-----------
\\section{Experience}
\\resumeSubHeadingList
`;
  experience.forEach((e) => {
    tex += `  \\resumeSubheading
    {${e.role}${e.employmentType}}{${e.period}}
    {${e.company}}{${e.location}}
    \\resumeItemListStart
`;
    e.bullets.forEach((b) => {
      tex += `      \\resumeItem{${b}}\n`;
    });
    tex += `    \\resumeItemListEnd\n`;
  });
  tex += `\\resumeSubHeadingListEnd\n`;

  tex += `
%-----------5. PROJECTS-----------
\\section{Projects}
\\resumeSubHeadingList
`;
  projects.forEach((p) => {
    tex += `  \\resumeProjectHeading
    {${p.name}}{${p.technologies}}{${p.period}}{${p.url}}
    \\resumeItemListStart
`;
    if (p.description) {
      tex += `      \\resumeItem{${p.description}}\n`;
    }
    p.bullets.forEach((b) => {
      tex += `      \\resumeItem{${b}}\n`;
    });
    tex += `    \\resumeItemListEnd\n`;
  });
  tex += `\\resumeSubHeadingListEnd\n`;

  if (certifications.length > 0) {
    tex += `
%-----------6. CERTIFICATIONS-----------
\\section{Certifications}
\\begin{itemize}[leftmargin=0.15in, label={}]
  \\small{\\item{
`;
    certifications.forEach((c) => {
      const cred = c.credentialId ? `, ID: ${c.credentialId}` : '';
      tex += `    \\textbf{${c.name}} \\textbar\\ ${c.issuer} (Issued: ${c.date}${cred}) \\\\\n`;
    });
    tex += `  }}
\\end{itemize}
\\vspace{-3mm}
`;
  }

  if (referees.length > 0) {
    tex += `
%-----------7. REFEREES-----------
\\section{Referees}
\\begin{itemize}[leftmargin=0.15in, label={}]
  \\small{\\item{
`;
    referees.forEach((r) => {
      const rel = r.relationship ? ` \\ \\textbar\\ \\ Relationship: ${r.relationship}` : '';
      tex += `    \\textbf{${r.fullName}} -- ${r.position}, ${r.organization} \\\\\n    Email: ${r.email} \\ \\textbar\\ \\ Phone: ${r.phone}${rel} \\\\ \\vspace{2pt}\n`;
    });
    tex += `  }}
\\end{itemize}
`;
  }

  tex += `\n\\end{document}\n`;
  return tex;
};

export const downloadTexFile = (latexContent, filename = 'resume.tex') => {
  const blob = new Blob([latexContent], { type: 'text/x-tex;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.tex') ? filename : `${filename}.tex`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
