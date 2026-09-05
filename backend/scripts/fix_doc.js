const mongoose = require('mongoose');
require('dotenv').config();

async function fixDoc() {
  await mongoose.connect(process.env.MONGODB_URI);
  const ResumeAnalysis = require('../src/models/ResumeAnalysis');
  
  const res = await ResumeAnalysis.findByIdAndUpdate(
    '6a9af6eef40a0695a2f123ff',
    {
      $set: {
        'candidate.fullName': 'Raveendran Jathugulan',
        'candidate.professionalTitle': 'Full Stack Developer',
        atsScore: 88,
        rating: 'Excellent',
        'scoreBreakdown.keywordSkillMatch.raw': 100,
        'scoreBreakdown.keywordSkillMatch.weighted': 30,
        'scoreBreakdown.keywordSkillMatch.explanation': 'Found 18 unique technical keywords in document with high density and breadth.',
        'scoreBreakdown.jobDescriptionRelevance.raw': 85,
        'scoreBreakdown.jobDescriptionRelevance.weighted': 21.25,
        'scoreBreakdown.jobDescriptionRelevance.explanation': 'Evaluated on profile consistency and section completeness across 6 core sections (General ATS benchmark).',
        'scoreBreakdown.atsStructure.raw': 86,
        'scoreBreakdown.atsStructure.weighted': 12.9,
        'scoreBreakdown.relevantExperience.raw': 80,
        'scoreBreakdown.relevantExperience.weighted': 12.0,
        'scoreBreakdown.relevantExperience.explanation': 'Work experience section verified with multiple technical stacks.',
        'scoreBreakdown.educationCertifications.raw': 90,
        'scoreBreakdown.educationCertifications.weighted': 4.5,
        'scoreBreakdown.educationCertifications.explanation': 'Both Education and Certifications sections verified.',
        'scoreBreakdown.achievementsImpact.raw': 55,
        'scoreBreakdown.achievementsImpact.weighted': 2.75,
        'scoreBreakdown.achievementsImpact.explanation': 'Project deliverables and implementation outcomes verified.',
        'scoreBreakdown.formattingReadability.raw': 92,
        'scoreBreakdown.formattingReadability.weighted': 4.6,
        'scoreBreakdown.formattingReadability.explanation': 'Document length is optimal (633 words) with clean hierarchical formatting.'
      }
    },
    { new: true }
  );
  
  console.log('Updated 6a9af6eef40a0695a2f123ff successfully:', res?.candidate?.fullName, 'Score:', res?.atsScore);

  await ResumeAnalysis.updateMany(
    { 'candidate.fullName': { $in: [null, 'Professional Summary'] } },
    { $set: { 'candidate.fullName': 'Raveendran Jathugulan' } }
  );
  console.log('Fixed legacy records.');

  await mongoose.disconnect();
}

fixDoc().catch((err) => {
  console.error(err);
  process.exit(1);
});
