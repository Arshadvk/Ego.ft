let User = require("../models/userModel");
let Category = require("../models/category");
let Product = require("../models/productModel");

const {
    TrustProductsEntityAssignmentsContextImpl,
} = require("twilio/lib/rest/trusthub/v1/trustProducts/trustProductsEntityAssignments");
const Coupon = require("../models/coupon");

const loadAddProduct = async (req, res) => {
    try {
        const user = req.session.admin;
        const category = await Category.find();
        res.render("add-product", { category, user });
    } catch (error) {

        res.render('500');
        console.log(error.message);
    }
};
const addProduct = async (req, res) => {
    try {
        if(req.body.name.trim()!= "" && req.body.category.trim()!= "" && req.body.price > 0 && req.body.quantity > 0 && req.body.offer_price > 0 && req.body.description.trim()!= ""){
            const image = [];
        for (file of req.files) {
            image.push(file.filename);
        }
        
        const product = new Product({
            product_name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            quantity: req.body.quantity,
            description: req.body.description,
            offer_price: req.body.offer_price,
            image: image,
            size: req.body.size,
        });

        const result = await product.save();

        if (result) {
            res.redirect("/admin/add-product");
        } 
        }else{
     
        }
        
    } catch (error) {

        res.render('500');
        console.log(error.message);
    }
};

const productlist = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.session.admin });
        const product = await Product.find().populate("category");

        res.render("list-products", { product, user });
    } catch (error) {

        res.render('500');
        console.log(error.message);
    }
};


const editproduct = async (req, res) => {
    try {
        const user = req.session.admin;
        const category = await Category.find();
        const product = await Product.findOne({ _id: req.query.id });
        res.render("edit-product", { product, category, user });
    } catch (error) {

        res.render('500');
        console.log(error.message);
    }
};


const unlistproduct = async (req, res) => {
    try {
        const product_id = req.body.productId;
        const data = await Product.updateOne(
            { _id: product_id },
            { $set: { unlist: false } }
        );

        res.json({ success: true });
    } catch (error) {

        res.render('500');
        console.log(error.message);
    }
};


const listproduct = async (req, res) => {
    try {
        const product_id = req.body.productId;
        const data = await Product.updateOne(
            { _id: product_id },
            { $set: { unlist: true } }
        );

        res.json({ success: true });
    } catch (error) {

        res.render('500');
        console.log(error.message);
    }
};

const updateproduct = async (req, res) => {
    try {
        const id = req.params.id;

        await Product.updateOne(
            { _id: id },
            {
                $set: {
                    product_name: req.body.name,
                    category: req.body.category,
                    price: req.body.price,
                    offer_price: req.body.offer_price,
                    description: req.body.description,
                    quantity: req.body.quantity,
                },
            }
        );
        res.redirect("/admin/list-product");
    } catch (error) {

        res.render('500');
        console.log(error.message);
    }
};

const add_review = async ( req, res )=>{

    try {
        const proid = req.body.proid

        const review = await Product.updateOne({_id : proid},{$push:{review:{
            name:req.body.name,
            email:req.body.email,
            comment:req.body.comment,
            rating: req.body.rate
        }}})

        res.json({success})

    } catch (error) {

        res.render('500');
        console.log(error.message);
    }
}
const product_view = async (req, res) => {
    try {
        let user;
        if (req.session.user) {
            user = true;
        } else {
            user = false;
        }
        const products = await Product.find().limit(5);
        const category = await Category.find({});
        const product = await Product.find({ _id: req.query.name });

        res.render("product-veiw", { product, user, category, products });
    } catch (error) {

        res.render('500');
        console.log(error.message);
    }
};

const sort_az = async (req, res) => {
    try {
        let user;
        if (req.session.user) {
            user = true;
        } else {
            user = false;
        }

        const product = await Product.find({}).sort({ product_name: -1 });
        res.render("shop", { product, user });
    } catch (error) {
        res.render('500');
        console.log(error.message);
    }
};

const search_product = async (req , res )=>{
    
    try {
        let user 
        if(req.session.user){
            user = true
        }else{
            user = false
        }
        const input = req.body.s
        const result = new RegExp(input,'i')
        const product = await Product.find({product_name:result}).populate('category')
        const coupon = await  Coupon.find({active:true})
        const category = await Category.find()
       
        
        res.render('shop',{category,product,user,category_name:"search" ,coupon,countpro:''})
    } catch (error) {

        res.render('500');
        console.log(error.message);
    }
}

module.exports = {
    loadAddProduct,
    addProduct,
    productlist,
    editproduct,
    unlistproduct,
    listproduct,
    updateproduct,
    product_view,
    sort_az,
    add_review,
    search_product
};
