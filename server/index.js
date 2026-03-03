import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';


const app = express();
dotenv.config();
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
app.use('/auth', authRoutes);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log(err));

    const db = mongoose.connection;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
