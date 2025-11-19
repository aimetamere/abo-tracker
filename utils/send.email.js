import { emailTemplates } from './email-template.js';
import dayjs from 'dayjs';
import transporter, { accountEmail } from '../config/nodemailer.js';


export const sendReminderEmail = async ({ to, type, subscription }) => {
    if(!to || !type) throw new Error('missing required fields'); // this will do the validation for the required fields

    const template = emailTemplates.find((t) => t.label === type); // this is for the find the template based on the type

    if(!template) throw new Error('invalid email template'); // this will do the validation for the invalid template

    const mailInfo = {
        userName: subscription.user.name,
        subscriptionName: subscription.name,
        renewalDate: dayjs(subscription.renewalDate).format('MMMM D, YYYY'), // format eg: January 1, 2025 
        planName: subscription.name,
        price: `${subscription.price} ${subscription.currency} (${subscription.frequency})`,
        paymentMethod: subscription.paymentMethod,
    }

    const message = template.generateBody(mailInfo); // this is for the generate the message based on the template
    const subject = template.generateSubject(mailInfo); // this is for the generate the subject based on the template

    const mailOptions = { // this is to send the email
        from: accountEmail,
        to: to,
        subject: subject,
        html: message,
    }

    // Wrap sendMail in a Promise so it can be properly awaited
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => { 
            if(error) {
                console.error('Failed to send email:', error);
                reject(error);
                return;
            }

            console.log('Email sent!');
            
            resolve(info);
        });
    });
}

