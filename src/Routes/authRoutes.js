const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Seller = mongoose.model('Seller');
const router = express.Router();

router.post('/register_seller', async (req, res) => {
    const {
        name,
        email,
        phone_number,
        password,
        region,
        province,
        city,
        barangay,
        street
    } = req.body;

    const address = { 
        region,
        province,
        city,
        barangay,
        street
    }

    try{
        const seller = new Seller({
            name,
            email,
            phone_number,
            password,
            address
        });
        await seller.save();
        const token = jwt.sign({ sellerId: seller._id }, 'SECRET_KEY');
        res.send({ token, seller });
    }
    catch(err){
        return res.status(422).send(err.message);
    }
});

router.post('/login_seller', async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
        return res.status(422).send({ error: 'Must provide email and password'});
    }

    const seller = await Seller.findOne({ email })
    if(!seller){
        return res.status(422).send({ error: 'User not found.'});
    };

    try{
        await seller.comparePassword(password);
        const token = jwt.sign({ sellerId: seller._id}, 'SECRET_KEY');
        res.send({ token, seller });
    }
    catch(e){
        return res.status(422).send({ error: "Invalid Password" });
    }
});

router.get('/fetch_seller', async (req, res) => {
    const { id } = req.query;
    const seller = await Seller.findOne({ _id: id });

    if(!seller){
        return res.status(422).send({ error: 'User not found.'});
    }

    try{
        res.send({ seller });
    }
    catch(e){
        return res.status(422).send({ error: e});
    };
});

module.exports = router;