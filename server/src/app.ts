import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './router/AuthRoutes.ts';
import contactRoutes from './router/ContactRoutes.ts';
import messageRoutes from './router/MessageRoutes.ts';

import { setupSocket } from './socket/socket.ts';
import groupRoutes from './router/GroupRoutes.ts';

const app = express();
const PORT = process.env.PORT || 3000;
const databaseURL = process.env.DATABASE_URL;

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/group', groupRoutes);

const server = app.listen(PORT, () => {
  console.log(`SERVER RUN ON PORT: ${PORT}`);
});

setupSocket(server);

mongoose
  .connect(databaseURL!)
  .then(() => {
    console.log('DB CONNECTED');
  })
  .catch((err) => console.log(err.message));
