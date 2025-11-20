// Load environment variables from .env
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Resolve path to project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "..", ".env") });

// Export variables
export const NODE_ENV = process.env.NODE_ENV || "development";
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

// Defaults
export const PORT_NUMBER = PORT ? parseInt(PORT, 10) : 5501;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Debug output
console.log("\nLoaded environment:");
console.log("  NODE_ENV:", NODE_ENV);
console.log("  DB_URI:", DB_URI ? "SET" : "UNDEFINED");
console.log("  EMAIL_USER:", EMAIL_USER ? "SET" : "UNDEFINED");
console.log("  EMAIL_PASSWORD:", EMAIL_PASSWORD ? "SET" : "UNDEFINED");
console.log("");
