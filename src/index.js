require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const db = require('../config/dbConfig');

const app = express();
const cookieParser = require('cookie-parser');

app.use(helmet());
app.use(cors({
    origin: ["http://localhost:3001", "http://localhost:3002"],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use('/public/uploads', express.static('public/uploads'));


async function connectToDatabase() {
    try {
        await db.authenticate();
        console.log('Connected to the database');
    } catch (error) {
        console.error('Database connection error:', error);
    }
}

connectToDatabase();
db.sync({alter: true});

const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const categoryRoutes = require('./routes/category');
const attributeRoutes = require('./routes/attribute');
const authRoutes = require('./routes/auth');

app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/attributes', attributeRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
