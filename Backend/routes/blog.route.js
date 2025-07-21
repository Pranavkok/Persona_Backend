import { Router } from 'express';
import auth from '../middlewares/auth.js'
import { deleteBlogs, editBlogs, getBlogs } from '../controllers/blog.controller.js';

const blogRouter = Router();

blogRouter.get('/getBlogs',auth,getBlogs)
blogRouter.put('/editBlogs',auth,editBlogs)
blogRouter.delete('/deleteBlogs',auth,deleteBlogs)

export default blogRouter;