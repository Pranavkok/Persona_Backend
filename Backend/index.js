import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import userRouter from './routes/user.route.js';
import blogRouter from './routes/blog.route.js';

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}));
app.use(express.json());
app.use(helmet({
    crossOriginResourcePolicy: false
}));
app.use(morgan())
app.use(cookieParser())

app.get('/', (req, res) => {
    res.json({
        message: 'Serving from the backend',
    })
}
);

app.use('/api/user',userRouter)
app.use('/api/blog',blogRouter)

connectDB().then(()=>{
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})