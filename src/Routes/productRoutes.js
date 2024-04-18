const express = require('express');
const mongoose = require('mongoose');

const Seller = mongoose.model('Seller');
const router = express.Router();

router.get('/fetch_products', async (req, res) => {
    const { _id } = req.query;

    try{
        const fetchProduct = await Seller.findOne({ _id });
        res.send(fetchProduct);
    }
    catch(err){
        console.error(err);
        res.status(500).send({ error: err});
    }
});

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

    const product = {
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
                products : product
            }
        },{
            new: true
        })
        res.send(newProduct);
    }
    catch(err){
        console.error(err);
        res.status(500).send({ error: err})
    }
});

router.put('/edit_product', async (req, res) => {
    const {
        _id,
        prodId,
        product_name,
        product_description,
        category,
        brand,
        price,
        stock
    } = req.body;

    try{
        const UpdateProduct = await Seller.findOneAndUpdate({
            _id,
            "products._id": prodId,
        },{
            $set: {
                "products.$.product_name": product_name,
                "products.$.product_description": product_description,
                "products.$.category": category,
                "products.$.brand": brand,
                "products.$.price": price,
                "products.$.stock": stock
            }
        },{
                new: true
        })
        res.send(UpdateProduct);
    }
    catch(err){
        console.error(err);
        res.status(500).send({ error: err})
    }
})

module.exports = router;