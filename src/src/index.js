require('./Models/Seller');
require('./Models/Product');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const sellerAuth = require('./Middlewares/sellerAuth');
const authRoutes = require('./Routes/authRoutes');
const productRoutes = require('./Routes/productRoutes');

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(authRoutes);
app.use(productRoutes);

const mongoUri = 'mongodb+srv://Aldrich:Stg5cUk009iUp6K7@e-commerce.pcjkral.mongodb.net/';

mongoose.set('strictQuery', true);

mongoose.connect(mongoUri);

mongoose.connection.on('connected', () => {
    console.log('Connected to e-sari store database');
});

mongoose.connection.on('error', (err) => {
    console.error('Error connecting to database', err);
});

app.get('/', sellerAuth, (req, res) => {
    res.send('Connected');
});

app.listen(3000, () => {
    console.log('Listening to port 3000');
});