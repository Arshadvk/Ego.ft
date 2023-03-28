const User = require('../models/userModel');
const Product = require('../models/productModel');
const Category = require('../models/category');

const show_cart = async (req, res) => {
    try {
        const id = req.session.user._id
        const category = await Category.find()
        const user = await User.findOne({ _id: id });
        const totel = user.cartTotel
        const product = await User.findOne({ _id: id }).populate('cart.product')
        const cart = product.cart
        res.render('cart', { product, cart, totel, user, category });

    } catch (error) {
        console.log(error.message);
    }
}

const add_cart = async (req, res) => {

    try {

        const id = req.session.user._id
        const product = req.body.productId
        const price = req.body.price
        const prod = await Product.find({ _id: product })



        let exist = await User.findOne({ _id: id, "cart.product": product });
        if (exist) {
            res.json({ exist: true })
        } else {
            const cartdata = await User.updateOne({ _id: id }, { $push: { cart: { product: product, qty: 1, price: price } } })
            const cart = await User.findOne({ _id: id })
            let sum = 0
            for (let i = 0; i < cart.cart.length; i++) {
                sum = sum + cart.cart[i].price
            }
            const update = await User.updateOne({ _id: id }, { $set: { cartTotel: sum } })
            res.json({ success: true })
        }




    } catch (error) {
        console.log(error.message);
    }
}

const delete_cart = async (req, res) => {

    try {

        const id = req.session.user._id
        const proId = req.body.productId

        const data = await User.updateOne({ _id: id }, { $pull: { cart: { product: proId } } })


        res.json({ success: true })


    } catch (error) {
        console.log(error.message);
    }
}

const Qtychange = async (req, res) => {

    try {
        if (req.session.user) {

            const id = req.session.user
            const price = req.body.price
            const proid = req.body.productId
            const count = req.body.count

            const product_data = await Product.findOne({ _id: proid })
            // qty increment and decrement 
            const QtyUpadating = await User.updateOne({ _id: id, 'cart.product': proid }, { $inc: { 'cart.$.qty': count } })
            // updating price 
            const currentqty = await User.findOne({ _id: id, 'cart.product': proid }, { _id: 0, 'cart.qty.$': 1 })

           
            const totelPrice = price * currentqty.cart[0].qty
            
            const updatingprice = await User.updateOne({ _id: id, 'cart.product': proid }, { $set: { 'cart.$.price': totelPrice } })

            // grand totel  
            const cart = await User.findOne({ _id: id }).populate('cart.product').exec()
            let sum = 0
            for (let i = 0; i < cart.cart.length; i++) {
                sum = sum + cart.cart[i].price
            }
            const cartTotel = await User.updateOne({ _id: id }, { $set: { cartTotel: sum } })

            res.json({ success: true, totelPrice, sum })

        }

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    show_cart,
    add_cart,
    show_cart,
    delete_cart,
    Qtychange
}