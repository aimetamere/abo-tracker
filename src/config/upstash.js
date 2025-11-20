import { Client } from '@upstash/workflow';

import { QSTASH_TOKEN, QSTASH_URL } from './env.js';

// Validate QSTASH_TOKEN before creating client
if (!QSTASH_TOKEN) {
    console.error('ERROR: QSTASH_TOKEN is not set in environment variables');
    console.error('Please add QSTASH_TOKEN to your .env or .env.local file');
    throw new Error('QSTASH_TOKEN is required but not found in environment variables');
}

// Validate QSTASH_URL (optional, has default)
const qstashUrl = QSTASH_URL || 'https://qstash.upstash.io';

export const workflowClient = new Client({
    token: QSTASH_TOKEN,
    baseUrl: qstashUrl,
});

export default Client;