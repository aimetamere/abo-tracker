import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Determine environment
const NODE_ENV = process.env.NODE_ENV || 'development';

// Hybrid loading: Try environment-specific file first, fallback to .env
let envPath;
let loadedFrom = '';

if (NODE_ENV === 'production') {
    // Production: Try .env first, then fallback to .env.local if .env doesn't exist
    const prodPath = join(__dirname, '..', '.env');
    const fallbackPath = join(__dirname, '..', '.env.local');
    
    if (existsSync(prodPath)) {
        envPath = prodPath;
        loadedFrom = '.env';
    } else if (existsSync(fallbackPath)) {
        envPath = fallbackPath;
        loadedFrom = '.env.local (fallback)';
    } else {
        // Last resort: load .env directly (default dotenv behavior)
        config();
        loadedFrom = '.env (default)';
    }
} else {
    // Development: Try .env.local first, then fallback to .env
    const devPath = join(__dirname, '..', '.env.local');
    const fallbackPath = join(__dirname, '..', '.env');
    
    if (existsSync(devPath)) {
        envPath = devPath;
        loadedFrom = '.env.local';
    } else if (existsSync(fallbackPath)) {
        envPath = fallbackPath;
        loadedFrom = '.env (fallback)';
    } else {
        // Last resort: load .env directly (default dotenv behavior)
        config();
        loadedFrom = '.env (default)';
    }
}

// Load the environment file if we found a specific path
if (envPath) {
    config({ path: envPath });
}

// Export all environment variables directly (like the simple solution)
export const PORT = process.env.PORT;
export const SERVER_URL = process.env.SERVER_URL;
export const DB_URI = process.env.DB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const ARCJET_ENV = process.env.ARCJET_ENV;
export const ARCJET_KEY = process.env.ARCJET_KEY;
export const QSTASH_TOKEN = process.env.QSTASH_TOKEN;
export const QSTASH_URL = process.env.QSTASH_URL;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

// Export NODE_ENV
export { NODE_ENV };

// Set default PORT if not provided
export const PORT_NUMBER = PORT ? parseInt(PORT, 10) : 5501;

// Set default for JWT_EXPIRES_IN if not provided
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Simple debug logs (SET or MISSING)
console.log('\n=== Environment Variables ===');
console.log(`NODE_ENV: ${NODE_ENV}`);
console.log(`Loaded from: ${loadedFrom}`);
console.log(`PORT: ${PORT ? 'SET' : 'MISSING'}`);
console.log(`SERVER_URL: ${SERVER_URL ? 'SET' : 'MISSING'}`);
console.log(`DB_URI: ${DB_URI ? 'SET' : 'MISSING'}`);
console.log(`JWT_SECRET: ${JWT_SECRET ? 'SET' : 'MISSING'}`);
console.log(`ARCJET_KEY: ${ARCJET_KEY ? 'SET' : 'MISSING'}`);
console.log(`QSTASH_TOKEN: ${QSTASH_TOKEN ? 'SET' : 'MISSING'}`);
console.log(`EMAIL_USER: ${EMAIL_USER ? 'SET' : 'MISSING'}`);
console.log(`EMAIL_PASSWORD: ${EMAIL_PASSWORD ? 'SET' : 'MISSING'}`);
console.log('============================\n');
