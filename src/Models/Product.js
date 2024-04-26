const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    seller_id: String,
    product_image: String,
    image_id: String,
    product_name: String,
    product_description: String,
    category: String,
    brand: String,
    price: Number,
    stock: Number,
    barcode: Number,
    rating: {
        type: Number,
        default: 0
    },
    sold: {
        type: Number,
        default: 0
    }

});

mongoose.model('Product', ProductSchema);