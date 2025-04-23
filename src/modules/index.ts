import { Router } from 'express';
import todoRouter from './routes/todo.routes';

const router = Router()


router.use('/v1/todos', todoRouter)

export default router

