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
        res.send({ token: token });
    }
    catch(err){
        return res.status(422).send(err.message);
    }
});

module.exports = router;