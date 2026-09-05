/**
 * Built-in Native LaTeX Templates
 * Exactly 4 ATS-Compliant Templates strictly adhering to the mandatory section order:
 * 1. Professional Summary
 * 2. Education
 * 3. Technical Skills
 * 4. Experience
 * 5. Projects
 * 6. Certifications
 * 7. Referees
 */

const TEMPLATE_01_RAW = `\\documentclass[a4paper,11pt]{article}
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

\\newcolumntype{L}{>{\\raggedright\\arraybackslash}X}
\\newcolumntype{R}{>{\\raggedleft\\arraybackslash}X}

\\begin{document}
\\fontfamily{cmr}\\selectfont

%----------HEADING----------
\\begin{center}
  {\\Huge \\textbf{{{fullName}}}} \\\\ \\vspace{2pt}
  \\small
  \\faMapMarker*\\ {{location}} \\ \\textbar\\ \\ 
  \\faPhone\\ {{phone}} \\ \\textbar\\ \\ 
  \\href{mailto:{{email}}}{\\faEnvelope\\ {{email}}} \\\\ \\vspace{2pt}
  \\href{https://{{github}}}{\\faGithub\\ {{github}}} \\ \\textbar\\ \\ 
  \\href{https://{{linkedin}}}{\\faLinkedin\\ {{linkedin}}}
\\end{center}
\\vspace{-4mm}

%-----------1. PROFESSIONAL SUMMARY-----------
{{#if summary}}
\\section{Professional Summary}
\\begin{justify}
\\small{ {{summary}} }
\\end{justify}
\\vspace{-2mm}
{{/if}}

%-----------2. EDUCATION-----------
\\section{Education}
\\resumeSubHeadingListStart
{{#each education}}
  \\resumeSubheading
    { {{institution}} }{ {{location}} }
    { {{degree}} {{grade}} }{ {{period}} }
    {{#if description}}
    \\resumeItemListStart
      \\resumeItem{ {{description}} }
    \\resumeItemListEnd
    {{/if}}
{{/each}}
\\resumeSubHeadingListEnd

%-----------3. TECHNICAL SKILLS-----------
\\section{Technical Skills}
\\begin{itemize}[leftmargin=*, label={}]
  \\small{\\item{
{{#each technicalSkills}}
    \\textbf{ {{category}} }{: {{skills}} } \\\\
{{/each}}
  }}
\\end{itemize}
\\vspace{-3mm}

%-----------4. EXPERIENCE-----------
\\section{Experience}
\\resumeSubHeadingListStart
{{#each experience}}
  \\resumeSubheading
    { {{company}} }{ {{location}} }
    { {{role}} {{employmentType}} }{ {{period}} }
    \\resumeItemListStart
      {{#each bullets}}
      \\resumeItem{ {{this}} }
      {{/each}}
    \\resumeItemListEnd
{{/each}}
\\resumeSubHeadingListEnd

%-----------5. PROJECTS-----------
\\section{Projects}
\\resumeSubHeadingListStart
{{#each projects}}
  \\resumeProjectHeading
    { {{name}} }{ {{technologies}} }{ {{period}} }{ {{url}} }
    \\resumeItemListStart
      {{#if description}}
      \\resumeItem{ {{description}} }
      {{/if}}
      {{#each bullets}}
      \\resumeItem{ {{this}} }
      {{/each}}
    \\resumeItemListEnd
{{/each}}
\\resumeSubHeadingListEnd

%-----------6. CERTIFICATIONS-----------
{{#if certifications.length}}
\\section{Certifications}
\\begin{itemize}[leftmargin=*, label={}]
  \\small{\\item{
{{#each certifications}}
    \\textbf{ {{name}} } \\textbar\\ {{issuer}} (Issued: {{date}}{{#if credentialId}}, ID: {{credentialId}}{{/if}}) \\\\
{{/each}}
  }}
\\end{itemize}
\\vspace{-3mm}
{{/if}}

%-----------7. REFEREES-----------
{{#if referees.length}}
\\section{Referees}
\\begin{itemize}[leftmargin=*, label={}]
  \\small{\\item{
{{#each referees}}
    \\textbf{ {{fullName}} } -- {{position}}, {{organization}} \\\\
    Email: {{email}} \\ \\textbar\\ \\ Phone: {{phone}}{{#if relationship}} \\ \\textbar\\ \\ Relationship: {{relationship}}{{/if}} \\\\ \\vspace{2pt}
{{/each}}
  }}
\\end{itemize}
{{/if}}

\\end{document}
`;

const TEMPLATE_02_RAW = `\\documentclass[a4paper,10pt]{article}

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
\\usepackage[sfdefault]{roboto}  % Sans-serif font

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
  \\textbf{\\Huge {{fullName}}} \\\\ \\vspace{3pt}
  \\small {{location}} $|$ {{phone}} $|$ \\href{mailto:{{email}}}{{email}} $|$ 
  \\href{https://{{linkedin}}}{{{linkedin}}} $|$
  \\href{https://{{github}}}{{{github}}}
\\end{center}

%-----------1. PROFESSIONAL SUMMARY-----------
{{#if summary}}
\\section*{Professional Summary}
{{summary}}
{{/if}}

%-----------2. EDUCATION-----------
\\section{Education}
\\resumeSubHeadingList
{{#each education}}
  \\resumeSubheading
      { {{institution}} }{ {{location}} }
      { {{degree}} {{grade}} }{ {{period}} }
{{/each}}
\\resumeSubHeadingListEnd

%-----------3. TECHNICAL SKILLS-----------
\\section{Technical Skills}
\\resumeSubHeadingList
{{#each technicalSkills}}
  \\resumeItem{\\textbf{ {{category}} }: {{skills}} }
{{/each}}
\\resumeSubHeadingListEnd

%-----------4. EXPERIENCE-----------
\\section{Experience}
\\resumeSubHeadingList
{{#each experience}}
  \\resumeSubheading
      { {{company}} }{ {{location}} }
      { {{role}} {{employmentType}} }{ {{period}} }
      \\resumeSubHeadingList
        {{#each bullets}}
          \\resumeItem{\\textbullet\\ {{this}}}
        {{/each}}
      \\resumeSubHeadingListEnd
{{/each}}
\\resumeSubHeadingListEnd

%-----------5. PROJECTS-----------
\\section{Projects}
\\resumeSubHeadingList
{{#each projects}}
  \\resumeSubheading
      { {{name}} }{ {{period}} }
      { {{technologies}} }{ {{url}} }
      \\resumeSubHeadingList
        {{#if description}}
          \\resumeItem{\\textbullet\\ {{description}}}
        {{/if}}
        {{#each bullets}}
          \\resumeItem{\\textbullet\\ {{this}}}
        {{/each}}
      \\resumeSubHeadingListEnd
{{/each}}
\\resumeSubHeadingListEnd

%-----------6. CERTIFICATIONS-----------
{{#if certifications.length}}
\\section{Certifications}
\\resumeSubHeadingList
{{#each certifications}}
  \\resumeItem{\\textbullet\\ \\textbf{ {{name}} } -- {{issuer}} ({{date}}{{#if credentialId}}, ID: {{credentialId}}{{/if}})}
{{/each}}
\\resumeSubHeadingListEnd
{{/if}}

%-----------7. REFEREES-----------
{{#if referees.length}}
\\section{Referees}
\\resumeSubHeadingList
{{#each referees}}
  \\resumeItem{\\textbf{ {{fullName}} } -- {{position}}, {{organization}} $|$ Email: {{email}} $|$ Phone: {{phone}}{{#if relationship}} $|$ {{relationship}}{{/if}}}
{{/each}}
\\resumeSubHeadingListEnd
{{/if}}

\\end{document}
`;

const TEMPLATE_03_RAW = `\\documentclass[11pt,a4paper,sans]{moderncv}
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

\\name{ {{firstName}} }{ {{lastName}} }

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
\\faMobile*\\ {{phone}} \\enspace\\textbar\\enspace 
\\faEnvelope\\ {{email}} \\enspace\\textbar\\enspace 
\\faMapMarker*\\ {{location}} \\\\ \\vspace{2pt}
\\faLinkedin\\ \\href{https://{{linkedin}}}{ {{linkedin}} } \\enspace\\textbar\\enspace
\\faGithub\\ \\href{https://{{github}}}{ {{github}} }
\\end{center}

%-----------1. PROFESSIONAL SUMMARY-----------
{{#if summary}}
\\section{Profile}
\\begin{justify}
{{summary}}
\\end{justify}
{{/if}}

%-----------2. EDUCATION-----------
\\section{Education}
{{#each education}}
\\customcventry{ {{period}} }{ {{institution}} }{ {{degree}} {{grade}} }{ {{location}} }{}{}{ {{description}} }
{{/each}}

%-----------3. TECHNICAL SKILLS-----------
\\section{Areas of Expertise}
{\\begin{itemize}[label=\\textbullet, leftmargin=0.5cm]
{{#each technicalSkills}}
\\item {\\textbf{ {{category}}: } {{skills}} }
{{/each}}
\\end{itemize}}

%-----------4. EXPERIENCE-----------
\\section{Professional Experience}
{{#each experience}}
\\customcventry{ {{period}} }{ {{company}} }{ {{role}} {{employmentType}} }{ {{location}} }{}{
{\\begin{itemize}[leftmargin=0.6cm, label={\\textbullet}]
{{#each bullets}}
\\item {{this}}
{{/each}}
\\end{itemize}}}
{{/each}}

%-----------5. PROJECTS-----------
\\section{Projects}
{{#each projects}}
\\customcventry{ {{period}} }{ {{name}} }{ {{technologies}} }{ {{url}} }{}{
{\\begin{itemize}[leftmargin=0.6cm, label={\\textbullet}]
{{#if description}}
\\item {{description}}
{{/if}}
{{#each bullets}}
\\item {{this}}
{{/each}}
\\end{itemize}}}
{{/each}}

%-----------6. CERTIFICATIONS-----------
{{#if certifications.length}}
\\section{Certifications}
{\\begin{itemize}[label=\\textbullet, leftmargin=0.5cm]
{{#each certifications}}
  \\item \\textbf{ {{name}} } -- {{issuer}} (Issued: {{date}}{{#if credentialId}}, ID: {{credentialId}}{{/if}})
{{/each}}
\\end{itemize}}
{{/if}}

%-----------7. REFEREES-----------
{{#if referees.length}}
\\section{Referees}
{\\begin{itemize}[label=\\textbullet, leftmargin=0.5cm]
{{#each referees}}
  \\item \\textbf{ {{fullName}} } -- {{position}}, {{organization}} \\textbar\\ Email: {{email}} \\textbar\\ Phone: {{phone}}{{#if relationship}} \\textbar\\ {{relationship}}{{/if}}
{{/each}}
\\end{itemize}}
{{/if}}

\\end{document}
`;

const TEMPLATE_04_RAW = `\\documentclass[a4paper,11pt]{article}

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
  \\textbf{\\Huge {{fullName}}} \\\\ \\vspace{3pt}
  \\small 
  \\faMapMarker*\\ {{location}} \\ \\textbar\\ \\ 
  \\faPhone\\ {{phone}} \\ \\textbar\\ \\ 
  \\href{mailto:{{email}}}{\\faEnvelope\\ {{email}}} \\\\ \\vspace{2pt}
  \\href{https://{{github}}}{\\faGithub\\ {{github}}} \\ \\textbar\\ \\ 
  \\href{https://{{linkedin}}}{\\faLinkedin\\ {{linkedin}}}
\\end{center}
\\vspace{-3mm}

%-----------1. PROFESSIONAL SUMMARY-----------
{{#if summary}}
\\section{Professional Summary}
{{summary}}
{{/if}}

%-----------2. EDUCATION-----------
\\section{Education}
\\resumeSubHeadingList
{{#each education}}
  \\resumeSubheading
    { {{institution}} }{ {{location}} }
    { {{degree}} {{grade}} }{ {{period}} }
    {{#if description}}
    \\resumeItemListStart
      \\resumeItem{ {{description}} }
    \\resumeItemListEnd
    {{/if}}
{{/each}}
\\resumeSubHeadingListEnd

%-----------3. TECHNICAL SKILLS-----------
\\section{Technical Skills}
\\begin{itemize}[leftmargin=0.15in, label={}]
  \\small{\\item{
{{#each technicalSkills}}
    \\textbf{ {{category}} }{: {{skills}} } \\\\
{{/each}}
  }}
\\end{itemize}
\\vspace{-3mm}

%-----------4. EXPERIENCE-----------
\\section{Experience}
\\resumeSubHeadingList
{{#each experience}}
  \\resumeSubheading
    { {{role}} {{employmentType}} }{ {{period}} }
    { {{company}} }{ {{location}} }
    \\resumeItemListStart
      {{#each bullets}}
      \\resumeItem{ {{this}} }
      {{/each}}
    \\resumeItemListEnd
{{/each}}
\\resumeSubHeadingListEnd

%-----------5. PROJECTS-----------
\\section{Projects}
\\resumeSubHeadingList
{{#each projects}}
  \\resumeProjectHeading
    { {{name}} }{ {{technologies}} }{ {{period}} }{ {{url}} }
    \\resumeItemListStart
      {{#if description}}
      \\resumeItem{ {{description}} }
      {{/if}}
      {{#each bullets}}
      \\resumeItem{ {{this}} }
      {{/each}}
    \\resumeItemListEnd
{{/each}}
\\resumeSubHeadingListEnd

%-----------6. CERTIFICATIONS-----------
{{#if certifications.length}}
\\section{Certifications}
\\begin{itemize}[leftmargin=0.15in, label={}]
  \\small{\\item{
{{#each certifications}}
    \\textbf{ {{name}} } \\textbar\\ {{issuer}} (Issued: {{date}}{{#if credentialId}}, ID: {{credentialId}}{{/if}}) \\\\
{{/each}}
  }}
\\end{itemize}
\\vspace{-3mm}
{{/if}}

%-----------7. REFEREES-----------
{{#if referees.length}}
\\section{Referees}
\\begin{itemize}[leftmargin=0.15in, label={}]
  \\small{\\item{
{{#each referees}}
    \\textbf{ {{fullName}} } -- {{position}}, {{organization}} \\\\
    Email: {{email}} \\ \\textbar\\ \\ Phone: {{phone}}{{#if relationship}} \\ \\textbar\\ \\ Relationship: {{relationship}}{{/if}} \\\\ \\vspace{2pt}
{{/each}}
  }}
\\end{itemize}
{{/if}}

\\end{document}
`;

const SEED_TEMPLATES = [
  {
    templateId: 'template-01',
    name: 'Classic Professional',
    description: 'Traditional corporate LaTeX resume with Computer Modern typography, compact tabular header, and clean horizontal section dividers. Highly recommended for corporate, finance, and graduate applications.',
    category: 'Engineering',
    layoutType: 'single-column',
    columns: 1,
    atsSafetyLevel: 'High',
    atsScore: 98,
    bestFor: 'Corporate / Graduate Applications',
    atsRatingText: 'Excellent',
    engine: 'pdflatex / standard TeXLive',
    paperSize: 'A4',
    documentClass: 'article',
    packages: ['latexsym', 'xcolor', 'float', 'ragged2e', 'fullpage', 'tabularx', 'titlesec', 'geometry', 'enumitem', 'hyperref', 'fancyhdr', 'fontawesome5'],
    detectedSections: ['Professional Summary', 'Education', 'Technical Skills', 'Experience', 'Projects', 'Certifications', 'Referees'],
    detectedCommands: ['resumeItem', 'resumeSubheading', 'resumeProjectHeading', 'resumeSubHeadingListStart', 'resumeItemListStart'],
    fieldMappings: {
      'personal.fullName': 'center.Huge',
      'summary': 'Professional Summary',
      'education': 'Education',
      'technicalSkills': 'Technical Skills',
      'experience': 'Experience',
      'projects': 'Projects',
      'certifications': 'Certifications',
      'referees': 'Referees',
    },
    latexSource: TEMPLATE_01_RAW,
    thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&q=80',
    isPublic: true,
    isActive: true,
  },
  {
    templateId: 'template-02',
    name: 'Modern ATS',
    description: 'Modern, ultra-clean software engineering resume engineered with Roboto sans-serif typography, clean horizontal rules, and generous whitespace. Optimized for Fortune 500 ATS machine parsers.',
    category: 'Software Engineer',
    layoutType: 'single-column',
    columns: 1,
    atsSafetyLevel: 'High',
    atsScore: 99,
    bestFor: 'Software Engineering / IT',
    atsRatingText: 'Excellent',
    engine: 'pdflatex with roboto font',
    paperSize: 'A4',
    documentClass: 'article',
    packages: ['latexsym', 'fullpage', 'titlesec', 'marvosym', 'xcolor', 'verbatim', 'enumitem', 'hyperref', 'fancyhdr', 'babel', 'tabularx', 'roboto'],
    detectedSections: ['Professional Summary', 'Education', 'Technical Skills', 'Experience', 'Projects', 'Certifications', 'Referees'],
    detectedCommands: ['resumeItem', 'resumeSubheading', 'resumeSubHeadingList'],
    fieldMappings: {
      'personal.fullName': 'center.Huge',
      'summary': 'Professional Summary',
      'education': 'Education',
      'technicalSkills': 'Technical Skills',
      'experience': 'Experience',
      'projects': 'Projects',
      'certifications': 'Certifications',
      'referees': 'Referees',
    },
    latexSource: TEMPLATE_02_RAW,
    thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&q=80',
    isPublic: true,
    isActive: true,
  },
  {
    templateId: 'template-03',
    name: 'ModernCV Professional',
    description: 'Prestigious ModernCV banking style resume with elegant header, fontawesome contact icons, and balanced section spacing. Ideal for professional, consulting, and academic applications.',
    category: 'Business',
    layoutType: 'banking',
    columns: 1,
    atsSafetyLevel: 'High',
    atsScore: 94,
    bestFor: 'Professional / Academic Applications',
    atsRatingText: 'Very Good',
    engine: 'pdflatex / moderncv standard',
    paperSize: 'A4',
    documentClass: 'moderncv',
    packages: ['inputenc', 'ragged2e', 'geometry', 'import', 'multicol', 'enumitem', 'amssymb', 'fontawesome5'],
    detectedSections: ['Profile', 'Education', 'Areas of Expertise', 'Professional Experience', 'Projects', 'Certifications', 'Referees'],
    detectedCommands: ['customcventry', 'makecvtitle'],
    fieldMappings: {
      'personal.fullName': '\\name',
      'summary': 'Profile',
      'education': 'Education',
      'technicalSkills': 'Areas of Expertise',
      'experience': 'Professional Experience',
      'projects': 'Projects',
      'certifications': 'Certifications',
      'referees': 'Referees',
    },
    latexSource: TEMPLATE_03_RAW,
    thumbnail: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=500&q=80',
    isPublic: true,
    isActive: true,
  },
  {
    templateId: 'template-04',
    name: 'Minimal Developer',
    description: 'Clean developer-focused resume inspired by sb2nov with Lato typography, prominent GitHub/LinkedIn presence, compact technical skills, and project highlights. 100% self-contained LaTeX source.',
    category: 'Developer',
    layoutType: 'single-column',
    columns: 1,
    atsSafetyLevel: 'High',
    atsScore: 98,
    bestFor: 'Full Stack / Software Developer',
    atsRatingText: 'Excellent',
    engine: 'pdflatex with lato font',
    paperSize: 'A4',
    documentClass: 'article',
    packages: ['fontawesome5', 'latexsym', 'fullpage', 'titlesec', 'marvosym', 'color', 'verbatim', 'enumitem', 'hyperref', 'fancyhdr', 'babel', 'tabularx', 'lato'],
    detectedSections: ['Professional Summary', 'Education', 'Technical Skills', 'Experience', 'Projects', 'Certifications', 'Referees'],
    detectedCommands: ['resumeItem', 'resumeSubheading', 'resumeProjectHeading', 'resumeSubHeadingList'],
    fieldMappings: {
      'personal.fullName': 'center.Huge',
      'summary': 'Professional Summary',
      'education': 'Education',
      'technicalSkills': 'Technical Skills',
      'experience': 'Experience',
      'projects': 'Projects',
      'certifications': 'Certifications',
      'referees': 'Referees',
    },
    latexSource: TEMPLATE_04_RAW,
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80',
    isPublic: true,
    isActive: true,
  },
];

module.exports = {
  TEMPLATE_01_RAW,
  TEMPLATE_02_RAW,
  TEMPLATE_03_RAW,
  TEMPLATE_04_RAW,
  SEED_TEMPLATES,
};
