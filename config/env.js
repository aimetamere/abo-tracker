import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Always load the main .env file
config({ path: join(__dirname, '..', '.env') });

// Optionally load environment-specific overrides
const NODE_ENV = process.env.NODE_ENV || 'development';
const envLocalPath = join(__dirname, '..', `.env.${NODE_ENV}.local`);

// Try loading .env.<env>.local (ignore if missing)
config({ path: envLocalPath });

// Export variables
export const {
  PORT, SERVER_URL,
  DB_URI,
  JWT_SECRET,
  ARCJET_ENV, ARCJET_KEY,
  QSTASH_TOKEN, QSTASH_URL,
  EMAIL_USER,
  EMAIL_PASSWORD,
} = process.env;

export const NODE_ENV_VAR = NODE_ENV;

export const PORT_NUMBER = PORT ? parseInt(PORT, 10) : 5501;

console.log('\n Environment variables after loading:');
console.log('   EMAIL_USER:', EMAIL_USER || 'UNDEFINED');
console.log('   EMAIL_PASSWORD:', EMAIL_PASSWORD ? `SET (${EMAIL_PASSWORD.length} chars)` : 'UNDEFINED');
console.log('');

export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
