import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRouter from './routes/authRouter.js';
import classRouter from './routes/classRouter.js';
import notesRouter from './routes/notesRouter.js';
import studentRouter from './routes/studentRouter.js';
import teacherRouter from './routes/teacherRouter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/auth', authRouter);
app.use('/class', classRouter);
app.use('/notes', notesRouter);
app.use('/student', studentRouter);
app.use('/teacher', teacherRouter);
app.get("/",(req,res) =>{
    return res.status(200).json({message:"Hello"})
})

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
