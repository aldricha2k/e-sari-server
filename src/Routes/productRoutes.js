const express = require('express');
const mongoose = require('mongoose');

const Seller = mongoose.model('Seller');
const router = express.Router();

router.post('/add_products', async (req, res) => {
    const {
        _id,
        product_name,
        product_description,
        category,
        brand,
        price,
        stock
    } = req.body;

    const products = {
        product_name,
        product_description,
        category,
        brand,
        price,
        stock
    }

    try{
        const newProduct = await Seller.findOneAndUpdate({
            _id
        },{
            $push: {
                products
            }
        },{
            new: true
        })
        res.send(newProduct);
    }
    catch(err){
        res.status(500).send({ error: err})
    }
})

module.exports = router;