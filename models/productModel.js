const mongoose = require('mongoose')
const category = require('./category');

const productSchema = new mongoose.Schema({

    product_name: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: category,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    offer_price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    image: {
        type: Array
    },
    unlist: {
        type: Boolean,
        default: true
    },
    size: [{
        type: String,
        required: true
    }],
    review :[{
        name: {
            type: String
          
        }, 
        email: {
            type: String
           
        }, 
        rating: {
            type: Number
           
        },
        comment:{
            type: String
        },
        date:{
            type: Date,
            default: Date.now()
        }
    }]


})
const Product = mongoose.model('Product', productSchema);
module.exports = Product;