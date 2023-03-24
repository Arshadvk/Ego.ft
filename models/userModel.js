//require mongoose in to our project
const mongoose = require('mongoose');
const Product = require('./productModel');

// set a user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }, email: {
        type: String,
        required: true,
    }, number: {
        type: String,
        required: true,
    },
    pass: {
        type: String,
        required: true,
    },
    is_admin: {
        type: Number,
        required: true
    },
    wallet:{
        type: Number,
        default: 0
    },
    is_verified: {
        type: Number,
        default: 0
    },
    token: {
        type: String,
        default: ''
    },
    join_date:{
        type:Date,
        default: Date.now()


    },
    status: {
        type: Boolean,
        required: true
    },
    wishlist: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        }

    }],
    cart: [{
        product: {
            type: mongoose.Types.ObjectId,
            ref: "Product",
            required: true
        },
        price: {
            type: Number
        },
        qty: {
            type: Number,
            default: 0

        }
    }],
    cartTotel: {
        type: Number,
        default: 0
    },
    address: [{
        name: {
            type: String,
            required: true
        }, 
        number: {
            type: Number,
            required: true
        }, 
        pincode: {
            type: Number,
            required: true
        }, 
        state: {
            type: String,
            required: true
        },
        district :{
            type : String ,
            required: true
        } ,
        place: {
            type: String,
            required: true
        }, 
        street: {
            type: String,
            required: true
        }, 
        building: {
            type: String,
            required: true
        }, 
        default_address: {
            type: Boolean,
            required: true
        }

    }]


});

const User = mongoose.model("User", userSchema);
module.exports = User;
