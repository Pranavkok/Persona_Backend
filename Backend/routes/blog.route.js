import { Router } from 'express';
import auth from '../middlewares/auth.js'
import { getBlogs } from '../controllers/blog.controller.js';

const blogRouter = Router();

blogRouter.get('/getBlogs',auth,getBlogs)

export default blogRouter;