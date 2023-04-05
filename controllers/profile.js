const User = require('../models/userModel');
const Product = require('../models/productModel');
const Category = require('../models/category');

const show_profile = async (req, res) => {

    try {
        const category = await Category.find({})
        const id = req.session.user._id
        const user = await User.findOne({ _id: id });

        res.render('profile', { user, category });
    } catch (error) {
        res.render('500');
        console.log(error.message);
    }
}

const edit_profile = async (req, res) => {

    try {
        if (req.body.name.trim() == "" || req.body.number.trim() == "" || req.body.email.trim() == "") {

            res.json({ success: false })
        } else {
            const id = req.session.user._id
            await User.updateOne({ _id: id }, {
                $set: {
                    name: req.body.name,
                    number: req.body.number,
                    email: req.body.email
                }
            })
            res.json({ success: true })
        }

    } catch (error) {

        res.render('500');
        console.log(error.message);
    }
}
const add_address = async (req, res) => {

    try {

        const id = req.session.user._id

        const address = await User.updateOne({ _id: id }, {
            $push: {
                address: {
                    name: req.body.name,

                    number: req.body.number,
                    pincode: req.body.pincode,
                    state: req.body.state,
                    place: req.body.place,
                    street: req.body.street,
                    building: req.body.building,
                    district: req.body.district,


                }
            }
        })

        res.redirect('/address')



    } catch (error) {
        res.render('500');
    console.log(error.message);
    }
}


const showAddress = async (req, res) => {
    try {
        const category = await Category.find()
        const id = req.session.user._id
        const user = await User.find({ _id: id })

        res.render('address', { user, category })

    } catch (error) {
        res.render('500');
        console.log(error.message);
    }
}
const edit_address = async (req, res) => {
    try {
      
        const id = req.session.user._id
        const address_id = req.body.id
        const name = req.body.name
        const number = req.body.number
        const pincode = req.body.pincode
        const state = req.body.state
        const place = req.body.place
        const street = req.body.street
        const district = req.body.district
        const building = req.body.building

        const data = await User.updateOne({ _id: id , 'address._id': address_id }, {
            $set: 
                
                {
                    "address.$.name": name,
                    "address.$.number": number,
                    "address.$.pincode": pincode,
                    "address.$.state": state,
                    "address.$.place": place,
                    "address.$.district": district,
                    "address.$.building": building,
                    "address.$.street": street
                },
            
        },
        ).then((res)=>{
            res.json({success: true})
        })
   
        




    } catch (error) {
        res.render('500');
        console.log(error.message);
    }
}


const deleteAddress = async (req, res) => {

    try {


        const id = req.session.user._id
        const address = req.body.address
        const data = await User.updateOne({ _id: id }, { $pull: { address: { _id: address } } })

        res.json({ success: true })

    } catch (error) {
        res.render('500');
        console.log(error.message);
    }
}

module.exports = {
    show_profile,
    edit_profile,
    add_address,
    showAddress,
    deleteAddress,
    edit_address,


}