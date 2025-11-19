import { Router } from 'express';

import authorize from '../middlewares/auth.middleware.js';
import { createSubscription, getUserSubscription } from '../controllers/subscription.controller.js';


const subscriptionRouter = Router();

subscriptionRouter.get(`/`, (req, res) => res.send({ tittle: 'GET all subscriptions' }));
subscriptionRouter.get(`/:id`, (req, res) => res.send({ tittle: 'GET subscriptions details' }));
subscriptionRouter.post(`/`, authorize, createSubscription);
subscriptionRouter.put(`/:id`, (req, res) => res.send({ tittle: 'UPDATE subscription' }));
subscriptionRouter.delete(`/:id`, (req, res) => res.send({ tittle: 'Delete a subscription' }));
subscriptionRouter.get(`/user/:id`, authorize, getUserSubscription);
subscriptionRouter.put(`/:id/cancel`, (req, res) => res.send({ tittle: 'CANCEL subscription' }));
subscriptionRouter.get(`/upcoming-renewals`, (req, res) => res.send({ tittle: 'GET upcoming renewals' }));

export default subscriptionRouter;