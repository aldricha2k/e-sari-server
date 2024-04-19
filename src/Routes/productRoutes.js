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
    let product_image = '';
    let image_id = '';

    const {
        _id,
        imageUri,
        product_name,
        product_description,
        category,
        brand,
        price,
        stock
    } = req.body;

    try{
        cloudinary.uploader.upload(imageUri, ( error, result ) => {
            console.log(result);
        })

        const product = {
            product_name,
            product_image,
            image_id,
            product_description,
            category,
            brand,
            price,
            stock
        }
    
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
        image_id 
    } = req.body;


    try{
        cloudinary.api.delete_resources([image_id], { type: 'upload', resource_type: 'image'}).then(console.log); 
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