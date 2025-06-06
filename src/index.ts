import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth';
import detectionRoutes from './routes/detection';
import diseaseRoutes from './routes/disease';
import { verifyToken } from './middleware/authMiddleware';
import plantingRouter from './routes/planting';
import weatherRoutes from './routes/weather';

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_LOCAL_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Server is working!');
});

app.use('/api/auth', authRoutes);
app.use('/api/diseases', diseaseRoutes);
app.use('/api/detection', verifyToken, detectionRoutes);
app.use('/api', weatherRoutes);
app.use('/api/planting', plantingRouter);

const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server started at http://localhost:${PORT}`);
// });

export default app;
