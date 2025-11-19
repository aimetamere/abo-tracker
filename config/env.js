import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const {
  PORT, NODE_ENV, SERVER_URL,
  DB_URI,
  JWT_SECRET,
  ARCJET_ENV, ARCJET_KEY,
  QSTASH_TOKEN, QSTASH_URL,
  EMAIL_USER,
  EMAIL_PASSWORD,
} = process.env;

// Debug: Check if variables are actually loaded
console.log('\n Environment variables after loading:');
console.log('   EMAIL_USER from process.env:', EMAIL_USER || 'UNDEFINED');
console.log('   EMAIL_PASSWORD from process.env:', EMAIL_PASSWORD ? `SET (length: ${EMAIL_PASSWORD.length})` : 'UNDEFINED');
console.log('');

// Set default for JWT_EXPIRES_IN if not provided
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

