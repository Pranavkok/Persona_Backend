import { Router } from 'express';
import { login, logout, register } from '../controllers/user.controller.js';
import auth from '../middleware/auth.js';

const userRouter = Router();

userRouter.post('/register',register)
userRouter.post('/login',login)
userRouter.get('/logout',auth,logout)

export default userRouter;