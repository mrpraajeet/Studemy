import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/course.js';
import orderRoutes from './routes/order.js';
import path from 'path';

const app = express();
const _dirname = path.resolve();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/orders', orderRoutes);
app.use('/', express.static(path.join(_dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(_dirname, 'dist', 'index.html'));
})

mongoose.connect(process.env.MONGODB_URL, {
  connectTimeoutMS: 30000,
  serverSelectionTimeoutMS: 30000,
})
  .then(console.log('Connected to MongoDB'))
  .catch((error) => console.log(error));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});