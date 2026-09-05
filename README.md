# SmartATS — ATS Resume Builder & Score Analyzer
> **Build Smart · Get Hired**

SmartATS is a full-stack, AI-powered ATS resume intelligence and creation platform. It empowers candidates to optimize their resumes for Applicant Tracking Systems (ATS), pinpoint parsing issues and keyword gaps, generate real-time 7-dimensional diagnostic reports, and craft modular, Overleaf-grade LaTeX resumes across 4 ATS-optimized templates.

---

## 🚀 Key Features

### 1. 🔍 ATS Resume Diagnostic Audit
- **Deep 7-Dimensional Scoring Model**:
  - Overall ATS Score (0–100%)
  - Keyword Matching & Hard Skills Ontology Graph
  - ATS Formatting & Parseability Check
  - Work Experience Impact & Metric Quantifiers
  - Education & Credentials Verification
  - Readability, Section Hierarchy & Length Analysis
  - Hard / Soft Skills Separation
- **Target Job Description Alignment**: Semantic keyword comparison against any pasted job posting.
- **Evidence Verification**: Pure extraction and validation with zero data fabrication.

### 2. 📝 Overleaf-Grade LaTeX Resume Studio
- **4 ATS-Compliant LaTeX Templates**:
  - **Classic Professional**: Strict single-column, corporate-ready, 98% ATS pass rate.
  - **Modern ATS**: Software engineering and tech-tailored with high keyword density, 99% ATS pass rate.
  - **ModernCV Professional**: Academic and senior technical variant, 94% ATS pass rate.
  - **Minimal Developer**: Clean markdown/monospace feel for full-stack developers, 98% ATS pass rate.
- **Strict Mandatory Section Ordering**:
  1. Professional Summary
  2. Education
  3. Technical Skills *(categorized)*
  4. Experience
  5. Projects
  6. Certifications
  7. Referees
- **Live Client-Side & Server-Side Compilation**: Instant `.tex` generation with real-time preview, copyable LaTeX source, and vector PDF compilation (with PDFKit fallback).

### 3. 🎯 AI Career Tools & Interview Prep
- Resume-grounded behavioral and technical interview question generator.
- STAR framework response scoring and gap remediation recommendations.

### 4. 🎨 Apple HIG & Modern Dark/Light Theme System
- Built to **Apple Human Interface Guidelines (HIG)**.
- Full dark navy atmosphere with electric blue-to-purple gradients, cyan accents, glassmorphic cards, and soft ambient glows.
- Seamless Dark/Light theme toggle with CSS custom properties and persistent state.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite 6
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4 + Vanilla CSS Design Tokens (Apple HIG)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State/Auth**: React Context + JWT Token Storage + LocalStorage Persistence

### Backend
- **Runtime**: Node.js + Express
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT, bcryptjs password hashing
- **File Parsing**: `pdf-parse`, `mammoth` (DOCX parsing)
- **PDF & LaTeX Services**: Native `pdflatex` engine with PDFKit vector graphics fallback
- **Security**: Helmet, CORS, Express Rate Limit, Multer validation

---

## 📁 Repository Structure

```
ATS Resume Analyzer/
├── backend/
│   ├── src/
│   │   ├── config/              # Database & environment configurations
│   │   ├── controllers/         # Auth, audit, report, and builder controllers
│   │   ├── middleware/          # Auth JWT verification & Multer upload
│   │   ├── models/              # User, Analysis, and Resume MongoDB schemas
│   │   ├── routes/              # Express API endpoints
│   │   ├── services/            # ATS scoring, LaTeX renderer, and PDF compiler
│   │   └── templates/           # 4 ATS LaTeX template definitions & seeders
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/                 # Axios client API abstractions
│   │   ├── components/          # Reusable UI components
│   │   │   ├── auth/            # Auth forms & social buttons
│   │   │   ├── builder/         # Resume editor & live LaTeX preview
│   │   │   ├── common/          # Buttons, Cards, Modals, Badges, Spinners
│   │   │   ├── layout/          # Navbar, Sidebar, and AppLayout
│   │   │   ├── results/         # ATS score visualization & breakdown
│   │   │   └── upload/          # Resume file dropzone & JD input
│   │   ├── context/             # AuthContext & ThemeContext
│   │   ├── pages/               # Landing/Auth, Upload, History, Builder, Templates
│   │   ├── routes/              # Protected routes & AppRoutes
│   │   ├── index.css            # Apple HIG theme variables & design tokens
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- **Node.js**: v18 or newer
- **MongoDB**: Local instance running on `mongodb://localhost:27017` or MongoDB Atlas URI
- Optional: `pdflatex` installed on your PATH for vector LaTeX compilation (a graceful PDFKit fallback is built in).

### 1. Clone & Backend Setup
```bash
cd backend
npm install
cp .env.example .env   # Configure PORT, MONGO_URI, and JWT_SECRET
npm run seed           # Seed the 4 ATS LaTeX templates
npm run dev            # Starts backend on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev            # Starts Vite dev server on http://localhost:5173
```

### 3. Open in Browser
Visit **`http://localhost:5173`** to access the SmartATS landing page, sign in or register, and explore the Resume Builder and ATS Audit tools.

---

## 🔒 Security & Privacy
- Zero persistent storage of sensitive resume data without user consent.
- Passwords salted and hashed with bcrypt.
- Input validation on all file uploads (`.pdf`, `.docx`, `.doc`, maximum 10MB).

---

## 📄 License
This project is licensed under the MIT License.
