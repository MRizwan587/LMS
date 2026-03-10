import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import bookRoutes from './routes/books.js';
import userRoutes from './routes/users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ;
//node:internal/modules/esm/resolve:283
//throw new ERR_MODULE_NOT_FOUND(
//handle this error
try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
} catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
}
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/users', userRoutes);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log(err));

    const db = mongoose.connection;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
