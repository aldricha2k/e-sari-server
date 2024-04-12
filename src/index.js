require('./Models/Seller');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const sellerAuth = require('./Middlewares/sellerAuth');
const authRoutes = require('./Routes/authRoutes');

const app = express();

app.use(bodyParser.json());
app.use(authRoutes);

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