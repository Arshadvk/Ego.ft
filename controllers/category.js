let User = require('../models/userModel');
let Category = require('../models/category');
let Product = require('../models/productModel');


const loadAddCategory = async (req, res) => {

    try {

        const user = await User.findOne({ _id: req.session.admin })
        res.render('add-category', { user })

    } catch (error) {

        res.render('505')
    }

}
const addCategory = async (req, res) => {

    try {
        const user = req.session.admin
        const exist = await Category.find({ category_name: req.body.name });
        if (exist !== "" && req.body.name.trim() !== "" ) {

            const category = new Category({
                category_name: req.body.name,
                description: req.body.description,
                image: req.file.filename

            })
            const result = await category.save();
            if (result) {
                res.redirect('/admin/add-category');
            } else {
                
            }

        }
        else if (req.body.name.trim() == "" || req.body.description.trim() == "") {
            res.render('add-category', { message: "fill your form", user });
        } else {
            res.render('add-category', { message: "this category already taken", user });
        }




    } catch (error) {

        res.render('505')
    }

}
const deleteCategory = async (req, res) => {
    try {

        const id = req.query.id;
        await Product.deleteMany({ category: id })
        await Category.deleteOne({ _id: id })
        res.redirect('/admin/list-category');


    } catch (error) {
        res.render('505')
    }
}

const editCategory = async (req , res)=>{
    try {
        const user = await User.findOne({ _id: req.session.admin })
        const id = req.query.id;
        const category = await Category.findOne({_id : id })
        res.render("edit-category",{user , category })
    } catch (error) {

        res.render('505')
    }
}

const upadte_category = async (req , res)=>{
    try {
        
        const id = req.body.id
        const name = req.body.name
        const description = req.body.description

        

    } catch (error) {
        res.render('505')  
    }
}
const listCategory = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.session.admin })
        const category = await Category.find()
        res.render('list-category', { category, user })
    } catch (error) {

        res.render('505')
    }
}

module.exports = {
    loadAddCategory,
    addCategory,
    deleteCategory,
    listCategory,
    editCategory,
    upadte_category
}