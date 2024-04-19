const express = require('express');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');

const Seller = mongoose.model('Seller');
const router = express.Router();

const cloud_name = 'doquxuj1b';
const api_key = '944233345565796';
const api_secret = 'jkwZ7jWAT3m1H78jqewf5gV_aDY';

cloudinary.config({ 
    cloud_name: 'doquxuj1b',
    api_key: '944233345565796',
    api_secret: 'jkwZ7jWAT3m1H78jqewf5gV_aDY'
});

const generateCloudinarySignature = (timeStamp, public_id) => {
    const stringtoSign = `public_id=${public_id}&timestamp=${timeStamp}${api_secret}`;
    return stringtoSign;
};


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
        product_image,
        image_id,
        product_name,
        product_description,
        category,
        brand,
        price,
        stock
    } = req.body;

    const product = {
        product_image,
        image_id,
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
        product_image,
        image_id,
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
                "products.$.product_image": product_image,
                'products.$.image_id': image_id,
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
        res.status(500).send({ error: err })
    }
});

router.put('/delete_product', async (req, res) => {
    const {
        _id,
        prodId,
        imageId 
    } = req.body;

    const timeStamp = new Date().getTime();
    const signature = generateCloudinarySignature(timeStamp, imageId);
    const data = new FormData();
    data.append('public_id', imageId);
    data.append('signature', signature);
    data.append('api_key', api_key);
    data.append('timestamp', timeStamp);

    try{
        await axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/image/destroy`, data);
        console.log('success');
    }
    catch(e){
        console.log('error');
    }

    try{
        const DeleteProduct = await Seller.findOneAndUpdate({
            _id
        },{
            $pull: {
                products: {
                    _id: prodId
                }
            }
        },{
            new: true
        });

        res.send(DeleteProduct);
    }
    catch(err){
        console.error(err);
        res.status(500).send({ error: err });
    }
});

module.exports = router;