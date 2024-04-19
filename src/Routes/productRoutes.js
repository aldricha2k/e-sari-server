const express = require('express');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

const Seller = mongoose.model('Seller');
const router = express.Router();

cloudinary.config({ 
    cloud_name: 'doquxuj1b',
    api_key: '944233345565796',
    api_secret: 'jkwZ7jWAT3m1H78jqewf5gV_aDY'
});

router.get('/fetch_sign', async (req, res) => {
    const generateCloudinarySignature = (params_to_sign) => {
        return cloudinary.utils.api_sign_request(params_to_sign, 'jkwZ7jWAT3m1H78jqewf5gV_aDY');
    };
    
    const params_to_sign = {
        timeStamp: Math.round( new Date().getTime()/1000 ),
    }
    
    const signature = generateCloudinarySignature(params_to_sign);
    res.send(signature);
})

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
        prodId 
    } = req.body;

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