const Template = require('../models/Template');
const { SEED_TEMPLATES } = require('../templates/seedTemplates');

const seedDefaultTemplates = async () => {
  try {
    for (const t of SEED_TEMPLATES) {
      await Template.findOneAndUpdate(
        { templateId: t.templateId },
        { $set: t },
        { upsert: true, new: true }
      );
    }
    console.log('[Seed] Default LaTeX templates verified & up-to-date.');
  } catch (err) {
    console.warn('[Seed] Warning seeding templates:', err.message);
  }
};

module.exports = { seedDefaultTemplates };
