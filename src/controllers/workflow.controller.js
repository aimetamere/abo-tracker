import dayjs from 'dayjs';

import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');

import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send.email.js';

const REMINDERS = [7, 5, 2, 1]; // this is for the workflow server to send reminders 7 days, 5 days, 2 days, 1 day before the renewal date

export const sendReminders = serve(async (context) => { //this is for the workflow server to run the function
    console.log('\n ============================================');
    console.log(' WORKFLOW ENDPOINT CALLED BY QSTASH');
    console.log(' ============================================');
    console.log('Request payload:', JSON.stringify(context.requestPayload, null, 2));
    
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    console.log(`Workflow started for subscription ${subscriptionId}`);
    console.log(`Subscription status: ${subscription?.status}`);
    console.log(`Renewal date: ${subscription?.renewalDate}`);

    if (!subscription || subscription.status !== 'active') {
        console.log(`Subscription not found or not active. Stopping workflow.`);
        return; // if the subscription is not found or is not active, return so exit the function
    }

    const renewalDate = dayjs(subscription.renewalDate);

    if(renewalDate.isBefore(dayjs())) { // this is for the workflow server to check if the renewal date has passed
        console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
        return; // if the renewal date has passed, return so exit the function
    }

    for (const daysBefore of REMINDERS) { // loop for each reminder 
        const reminderDate = renewalDate.subtract(daysBefore, 'day');

        if(reminderDate.isAfter(dayjs())) { // to put it to sleep before the reminder date 
            console.log(`Reminder date is in the future. Sleeping until ${reminderDate.format('YYYY-MM-DD')}`);
            await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate); // to put it to sleep until the reminder date
        }

        if (dayjs().isSame(reminderDate, 'day')) {
            console.log(`Reminder date is today. Sending email immediately.`);
            await triggerReminder(context, `${daysBefore} days before reminder`, subscription); // to trigger the reminder
        }
    }
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
      return Subscription.findById(subscriptionId).populate('user', 'name email');
    })
  }
  
  const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate());
  }
  
  const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
      console.log(`Triggering ${label} reminder`);
      console.log(`Attempting to send ${label} to ${subscription.user.email}`);
      try {
        await sendReminderEmail({
          to: subscription.user.email,
          type: label,
          subscription,
        });
        console.log(`Successfully sent ${label}`);
      } catch (error) {
        console.error(`Failed to send ${label}:`, error.message);
        throw error;
      }
    })
  }
