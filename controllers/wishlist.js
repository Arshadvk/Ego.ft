const User = require("../models/userModel");
const Category = require("../models/category");
const Product = require("../models/productModel");


const show_wishlist = async (req, res) => {

    try {
        
        const category = await Category.find({})

        const id = req.session.user._id

        const user =  await User.findOne({_id : id })

        console.log(user+'sfdsdf');

        const product = await User.findOne({ _id: id }).populate('wishlist.product')

        let wishlist = product.wishlist

        res.render('wishlist', { product, wishlist, category, user })


    } catch (error) {

        console.log(error.message)

    }

}


const add_wishlist = async (req, res) => {

    try {

        id = req.session.user._id

        proid = req.body.productId

        const data = await User.findOne({ _id: id, "wishlist.product": proid });

        if (data) {

            res.json({ exist : true })

        } else {
          
            const wishdata = await User.updateOne({ _id: id }, { $push: { wishlist: { product: proid } } })

            res.json({ success: true })

        }


    } catch (error) {

        console.log(error.message);

    }
}

const add_to_cart = async (req, res) => {

    try {

        const product_id = req.body.productId

        const id = req.session.user._id

        const data = await User.updateOne({ _id: id }, { $push: { cart: { product: product_id } } })


        res.json({ success: true })

    } catch (error) {

        console.log(error.message);

    }

}

const remove_from_wishlist = async (req, res) => {

    try {

        const product_id = req.body.productId

        const id = req.session.user._id

        const data = await User.updateOne({ _id: id }, { $pull: { wishlist: { product: product_id } } })

        res.json({ success: true })


    } catch (error) {
        console.log(error.message);
    }

}

module.exports = {
    show_wishlist,
    add_wishlist,
    add_to_cart,
    remove_from_wishlist
}