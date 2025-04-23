import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from 'express';

import apiRoutes from './src/modules';
import { errorHandler } from './src/middlewares/error-handler';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRoutes);

// Error handling
app.use(errorHandler as ErrorRequestHandler);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    code: 'NOT_FOUND',
    message: `Cannot ${req.method} ${req.path}`,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
