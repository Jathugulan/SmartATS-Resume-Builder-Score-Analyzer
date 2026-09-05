const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from server root .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/ats_resume_analyzer',
  JWT_SECRET: process.env.JWT_SECRET || 'super_secret_production_jwt_key_ats_analyzer_2026_x!9',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  AI_API_KEY: process.env.AI_API_KEY || '',
  AI_BASE_URL: (process.env.AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, ''),
  AI_MODEL: process.env.AI_MODEL || 'gpt-4o-mini',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10) // 10MB default
};

// Validate critical secrets in production
if (env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    console.error('FATAL: JWT_SECRET must be at least 32 characters in production');
    process.exit(1);
  }
  if (!process.env.MONGODB_URI) {
    console.error('FATAL: MONGODB_URI is required in production');
    process.exit(1);
  }
}

module.exports = env;
