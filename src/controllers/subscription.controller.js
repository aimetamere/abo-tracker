import Subscription from '../models/subscription.model.js';
import { workflowClient } from '../config/upstash.js';
import { SERVER_URL } from '../config/env.js';
import ErrorResponse from '../utils/ErrorResponse.js';

export const createSubscription = async (req, res, next) => {
    try {
        const { name, price, currency, frequency, category, paymentMethod, startDate } = req.body;
        const userId = req.user._id;

        // Create subscription
        const subscription = await Subscription.create({
            name,
            price,
            currency,
            frequency,
            category,
            paymentMethod,
            startDate,
            user: userId,
        });

        // Schedule QStash workflow for reminders
        const workflowUrl = `${SERVER_URL}/api/v1/workflow/subscription/reminder`;
        const workflowRun = await workflowClient.trigger({
            url: workflowUrl,
            body: {
                subscriptionId: subscription._id.toString(),
            },
        });

        res.status(201).json({
            success: true,
            message: 'Subscription created successfully',
            data: {
                subscription,
                workflowRunId: workflowRun.runId,
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getUserSubscription = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const subscriptions = await Subscription.find({ user: userId }).sort({ renewalDate: 1 });

        res.status(200).json({
            success: true,
            message: 'Subscriptions retrieved successfully',
            data: {
                subscriptions,
            }
        });
    } catch (error) {
        next(error);
    }
};

export const deleteSubscription = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const subscription = await Subscription.findById(id);

        if (!subscription) {
            const error = new ErrorResponse('Subscription not found', 404);
            throw error;
        }

        // Check ownership
        if (subscription.user.toString() !== userId.toString()) {
            const error = new ErrorResponse('Unauthorized to delete this subscription', 403);
            throw error;
        }

        await Subscription.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Subscription deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

