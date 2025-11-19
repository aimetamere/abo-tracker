import { Client } from '@upstash/workflow';

import { QSTASH_TOKEN, QSTASH_URL } from './env.js';

export const workflowClient = new Client({
    token: QSTASH_TOKEN,
    baseUrl: QSTASH_URL,
});

export default Client;