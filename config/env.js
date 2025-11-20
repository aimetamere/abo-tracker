import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Determine environment
const NODE_ENV = process.env.NODE_ENV || 'development';

// Load environment file based on NODE_ENV
// Development → .env.local
// Production → .env
const envPath = NODE_ENV === 'production' 
    ? join(__dirname, '..', '.env')
    : join(__dirname, '..', '.env.local');

config({ path: envPath });

// Export all environment variables
export const {
  PORT,
  SERVER_URL,
  DB_URI,
  JWT_SECRET,
  ARCJET_ENV,
  ARCJET_KEY,
  QSTASH_TOKEN,
  QSTASH_URL,
  EMAIL_USER,
  EMAIL_PASSWORD,
} = process.env;

// Export NODE_ENV
export { NODE_ENV };

// Set default PORT if not provided
export const PORT_NUMBER = PORT ? parseInt(PORT, 10) : 5501;

// Set default for JWT_EXPIRES_IN if not provided
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Simple debug logs (SET or MISSING)
console.log('\n=== Environment Variables ===');
console.log(`NODE_ENV: ${NODE_ENV}`);
console.log(`Loaded from: ${envPath}`);
console.log(`PORT: ${PORT ? 'SET' : 'MISSING'}`);
console.log(`SERVER_URL: ${SERVER_URL ? 'SET' : 'MISSING'}`);
console.log(`DB_URI: ${DB_URI ? 'SET' : 'MISSING'}`);
console.log(`JWT_SECRET: ${JWT_SECRET ? 'SET' : 'MISSING'}`);
console.log(`ARCJET_KEY: ${ARCJET_KEY ? 'SET' : 'MISSING'}`);
console.log(`QSTASH_TOKEN: ${QSTASH_TOKEN ? 'SET' : 'MISSING'}`);
console.log(`EMAIL_USER: ${EMAIL_USER ? 'SET' : 'MISSING'}`);
console.log(`EMAIL_PASSWORD: ${EMAIL_PASSWORD ? 'SET' : 'MISSING'}`);
console.log('============================\n');
