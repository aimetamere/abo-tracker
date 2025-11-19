import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Determine environment
const NODE_ENV = process.env.NODE_ENV || 'development';
const envPath = join(__dirname, '..', `.env.${NODE_ENV}.local`);

// Load environment file
const result = config({ path: envPath });

if (result.error && NODE_ENV === 'production') {
    console.error(`\n❌ Error loading .env.production.local file: ${result.error.message}`);
    console.error(`   File path: ${envPath}`);
    console.error(`   Please create .env.production.local file in the project root.\n`);
}

export const {
  PORT, SERVER_URL,
  DB_URI,
  JWT_SECRET,
  ARCJET_ENV, ARCJET_KEY,
  QSTASH_TOKEN, QSTASH_URL,
  EMAIL_USER,
  EMAIL_PASSWORD,
} = process.env;

// Export NODE_ENV
export { NODE_ENV };

// Set default PORT if not provided
export const PORT_NUMBER = PORT ? parseInt(PORT, 10) : 5501;

// Debug: Check if variables are actually loaded
console.log('\n Environment variables after loading:');
console.log('   EMAIL_USER from process.env:', EMAIL_USER || 'UNDEFINED');
console.log('   EMAIL_PASSWORD from process.env:', EMAIL_PASSWORD ? `SET (length: ${EMAIL_PASSWORD.length})` : 'UNDEFINED');
console.log('');

// Set default for JWT_EXPIRES_IN if not provided
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

