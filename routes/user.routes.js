import { Router } from 'express';

import errorMiddleware from '../middlewares/error.middleware.js';
import authorize from '../middlewares/auth.middleware.js';
import { getUsers, getUser } from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.get(`/`, getUsers);
userRouter.get(`/:id`, authorize, errorMiddleware, getUser); // errorMiddleware is called after authorize because we want to handle errors from authorize middleware
userRouter.post(`/`, (req, res) => res.send({ tittle: 'create new users' }));
userRouter.put(`/:id`, (req, res) => res.send({ tittle: 'update users' }));
userRouter.delete(`/:id`, (req, res) => res.send({ tittle: 'delete user' }));

export default userRouter;