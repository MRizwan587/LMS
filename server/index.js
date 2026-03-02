import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';


const app = express();
dotenv.config();
const PORT = process.env.PORT ;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});


mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log(err));

    const db = mongoose.connection;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
