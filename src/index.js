require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const db = require('../config/dbConfig');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

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
const authRoutes = require('./routes/auth');
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
