import nodemailer from 'nodemailer';
import { EMAIL_USER, EMAIL_PASSWORD } from './env.js';

export const accountEmail = EMAIL_USER || 'nicolasdhaan@gmail.com';

// Temporary logging to check if EMAIL_PASSWORD is loaded
console.log('EMAIL_PASSWORD exists:', !!EMAIL_PASSWORD);
console.log('EMAIL_PASSWORD length:', EMAIL_PASSWORD?.length || 0);
console.log('EMAIL_PASSWORD first 3 chars:', EMAIL_PASSWORD ? EMAIL_PASSWORD.substring(0, 3) + '...' : 'undefined');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER || 'nicolasdhaan@gmail.com',
        password: EMAIL_PASSWORD || '', // Will fail if empty, but prevents crash
    },

})

export default transporter;
