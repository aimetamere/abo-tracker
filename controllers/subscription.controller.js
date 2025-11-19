import Subscription from '../models/subscription.model.js';
import { workflowClient } from '../config/upstash.js';
import { SERVER_URL } from '../config/env.js';

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body, // passes every request user in the body to the subscription
            user: req.user._id, // passes the user id to the subscription
        });

        // Trigger the reminder workflow for the newly created subscription
        console.log(`Triggering workflow for subscription ${subscription._id.toString()}`);
        console.log(`Workflow URL: ${SERVER_URL}/api/v1/workflows/subscription/reminder`);
        
        try {
            const triggerResponse = await workflowClient.trigger({
                url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
                body: {
                    subscriptionId: subscription._id.toString(),
                },
                headers: {
                    'Content-Type': 'application/json',
                },
                retries: 0,
            });

            const workflowRunId = triggerResponse?.workflowRunId || triggerResponse?.id;
            res.status(201).json({ success: true, data: { subscription, workflowRunId } });
        } catch (workflowError) {
            console.error('Failed to trigger workflow:', workflowError);
            res.status(201).json({ success: true, data: { subscription } });
        }
    } catch (e) {
      next(e);
    }   
}

export const getUserSubscription = async (req, res, next) => {
    try {
        // will check if user is the same as the one in the token 
        // Convert both to strings for comparison (req.user._id is ObjectId, req.params.id is string)
        if (req.user._id.toString() !== req.params.id) {
            const error = new Error('you are not the owner of this account');
            error.status = 401;
            throw error;
        }

        const subscription = await Subscription.find({ user: req.params.id });
        res.status(200).json({ success: true, data: subscription});
    } catch (error) {
        next(error);
    }
}