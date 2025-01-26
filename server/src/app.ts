import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './router/AuthRoutes.ts';

const app = express();
const PORT = process.env.PORT || 3000;
const databaseURL = process.env.DATABASE_URL;

app.use(
  cors({
    origin: [process.env.ORIGIN!],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTONS'],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`SERVER RUN ON PORT: ${PORT}`);
});

mongoose
  .connect(databaseURL!)
  .then(() => {
    console.log('DB CONNECTED');
  })
  .catch((err) => console.log(err.message));
