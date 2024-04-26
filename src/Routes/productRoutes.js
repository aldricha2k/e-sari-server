const express = require('express');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

const Seller = mongoose.model('Seller');
const Product = mongoose.model('Product');
const router = express.Router();

cloudinary.config({ 
    cloud_name: 'doquxuj1b',
    api_key: '944233345565796',
    api_secret: 'jkwZ7jWAT3m1H78jqewf5gV_aDY'
});


router.get('/fetch_products', async (req, res) => {
    const { _id } = req.query;

    try{
        const fetchProduct = await Product.find({ seller_id: _id });
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
        imageUri,
        product_name,
        product_description,
        category,
        brand,
        price,
        stock,
        barcode
    } = req.body;

    try{    
        let product_image = null;
        let image_id = null;

        await cloudinary.uploader.upload(imageUri, ( error, result ) => {
            product_image = result.secure_url;
            image_id = result.public_id;
        });
        
        const newProduct = new Product({
            seller_id: _id,
            product_image,
            image_id,
            product_name,
            product_description,
            category,
            brand,
            price,
            stock,
            barcode
        });
        await newProduct.save();
        
        const sellerProduct = await Seller.findOneAndUpdate({
            _id
        },{
            $push: {
                products: {
                    product_id: newProduct._id
                }
            }
        },{
            new: true
        });

        res.send(sellerProduct);
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
        imageUri,
        imageId,
        product_name,
        product_description,
        category,
        brand,
        price,
        stock
    } = req.body;

    try{
        let newUri = '';
        let newId = '';

        await cloudinary.uploader.upload(imageUri, { public_id: imageId, overwrite: true }, ( error, result ) => {
            newUri = result.secure_url;
            newId = result.public_id;
        });

        const UpdateProduct = await Seller.findOneAndUpdate({
            _id,
            "products._id": prodId,
        },{
            $set: {
                "products.$.product_name": product_name,
                "products.$.product_image": newUri,
                'products.$.image_id': newId,
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
        await cloudinary.api.delete_resources([image_id], { type: 'upload', resource_type: 'image'}); 
        await Seller.findOneAndUpdate({
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
        const deleteProduct = await Product.findOneAndDelete({ _id: prodId}, {new: true});

        res.send(deleteProduct);
    }
    catch(err){
        console.error(err);
        res.status(500).send({ error: err });
    }
});

module.exports = router;