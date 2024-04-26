const mongoose = require('mongoose');

const ProductsSchema = new mongoose.Schema({
    product_image: String,
    image_id: String,
    product_name: String,
    product_description: String,
    category: String,
    brand: String,
    barcode: String
});

mongoose.model('Products', ProductsSchema);