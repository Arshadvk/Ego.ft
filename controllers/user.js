let User = require('../models/userModel');
let Category = require('../models/category');
let Product = require('../models/productModel');
let Banner = require('../models/banner');
let Coupon = require('../models/coupon');

const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');

const config = require('../config/config');
const { render, response } = require('../routes/adminRoutes');



const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;

    } catch (error) {
        console.log(error.message);
    }
}
const sendVerifyMail = async (name, email, user_id) => {
    try {

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPass
            }
        });
        const mailOptions = {
            from: "egoftverify@gmail.com",
            to: email,
            subject: 'Verify Your Email',
            html: '<p>Heyyy ' + name + ', Wowwee! Thanks for registering an account with Ego.ft! You are the coolest person in all the land. i hope you love our products  Before we get started, we will need to verify your email. <a href= "https://egoft.shop/verify?id=' + user_id + '" </a> click here </p>'


        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log("Email has been sent:-", info.response);
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}
const sendRestPassMail = async (name, email, token,) => {
    try {

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPass
            }
        });
        const mailOptions = {
            from: "egoftverify@gmail.com",
            to: email,
            subject: 'For rest Password',
            html: '<p>Hii ' + name + ',please click here to <a href= "https://egoft.shop/forget-password?token=' + token + ' " Reset Your Password.</a>your mail </p>'

        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log("Email has been sent:-", info.response);
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}

const loadfaq = async ( req , res)=>{
    try {
        const category = await Category.find()
        let user 
        if (req.session.user) {
            user = true
        }

        res.render('faq',{category,user});
    } catch (error) {
        console.log(error.message);
    }
}

const privacy_policy = async (req, res)=>{
    try {
        const category = await Category.find()
        let user 
        if (req.session.user) {
            user = true
        }
        res.render('privacy-policy',{category,user});
    } catch (error) {
        console.log(error.message);
    }
}

const aboutUs = async (req, res)=>{
    try {
        const category = await Category.find()
        let user 
        if (req.session.user) {
            user = true
        }
        res.render('about_us',{category,user});
    } catch (error) {
        console.log(error.message);
    }
}
const loadRegister = async (req, res) => {
    try {
        res.render('register');
    } catch (error) {
        console.log(error.message);
    }
} //create a new  user 
const insertUser = async (req, res) => {
    try {
        if (req.body.pas.trim() != "" && req.body.name.trim() != "" && req.body.email.trim() != "" && req.body.number.trim() != "" && req.body.pass.trim() != "") {
            const email = await User.findOne({ email: req.body.email });
            if (!email) {


                if (req.body.pas === req.body.pass) {
                    const spass = await securePassword(req.body.pass);

                    const user = new User({
                        name: req.body.name,
                        email: req.body.email,
                        number: req.body.number,
                        pass: spass,
                        is_admin: 0,
                        status: true
                    })
                    const userData = await user.save();
                    if (userData) {

                        sendVerifyMail(req.body.name, req.body.email, userData._id);
                        req.session.user = userData;


                        res.redirect('/home')
                    } else {
                        res.render('register', { message: "your registration has failed." })
                    }
                }
                else {
                    res.render('register', { message: "your both password not same" })
                }

            } else {
                res.render('register', { message: "This email already taken" })
            }

        } else {
            res.render('register', { message: "fill your form" })
        }


    } catch (error) {
        console.log(error.message);
    }
}// for show login
const loadLogin = async (req, res) => {
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
    }
}
// verify user 
const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const pass = req.body.pass;

        const userData = await User.findOne({ email: email });

        if (userData) {

            const passwordMatch = await bcrypt.compare(pass, userData.pass);

            if (passwordMatch) {


                if (userData.status === true) {
                    if (userData.is_admin === 1) {

                        req.session.admin = userData;

                        res.redirect('/admin/home')
                    }
                    else {
                        req.session.user = userData;
                        res.redirect('/home')

                    }
                } else {

                    res.render('login', { message: "admin block you  contect him " });
                }

            } else {

                res.render('login', { message: "Email and password is incorrect" });
            }

        } else {

            res.render('login', { message: "Please provide your Email and password is incorrect" });

        }



    } catch (error) {
        console.log(error.message);
    }
}
const logout_user = async (req, res) => {

    try {
        req.session.destroy();
        res.redirect('/')

    } catch (error) {

        console.log(error.message);
    }
}




// forget password code start 

const forgetload = async (req, res) => {
    try {
        res.render('forget')
    } catch (error) {
        console.log(error.message);
    }
}

// forget verify
const forgetverify = async (req, res) => {

    try {

        const email = req.body.email;

        const userData = await User.findOne({ email: email });

        if (userData) {



            if (userData.is_verified === 0) {

                res.render('forget', { message: "Please verify your email" })

            } else {

                const randomString = randomstring.generate();
                const updatedData = await User.updateOne({ email: email }, { $set: { token: randomString } })

                sendRestPassMail(userData.name, userData.email, randomString);
                res.render('forget', { message: "Please check your mail to rest your password" })

            }
        } else {
            res.render('forget', { message: "User email is incorrect" })
        }

    } catch (error) {

        console.log(error.message);
    }
}
const VerifyMail = async (req, res) => {

    try {

        const updateInfo = await User.updateOne({ _id: req.query.id }, { $set: { is_verified: 1 } });

       
        res.render('email-verified');

    } catch (error) {

        console.log(error.message);
    }
}

const send_verfymail = async (req , res)=>{

    try {
       const name = req.body.name
       const email = req.body.email
       const id = req.body.id
     sendVerifyMail( name , email , id );
     res.json({success:true})

    } catch (error) {

        console.log(error.message);
    }
} 

const forgetpasswordload = async (req, res) => {

    try {

        const token = req.query.token;

        const tokkenData = await User.find({ token: token })

        console.log(tokkenData[0].email);

        if (tokkenData) {
            res.render('forget-password', { user: tokkenData[0]._id });


        } else {

            res.render('404', { message: "token is  invalid" })
        }
    } catch (error) {
        console.log(error.message);
    }
}
const resetPassword = async (req, res) => {
    try {

        if (req.body.pass1 === req.body.pass2) {

            const spass = await securePassword(req.body.pass1)

            const user_id = req.params.id

            console.log(user_id);

            const updatedData = await User.findByIdAndUpdate({ _id: user_id }, { $set: { pas: spass, pass: spass, token: '' } })
            if (updatedData) {

                res.redirect('/login')
            }
            else {
                console.log('hi');
            }

        } else {

            res.render('forget-password', { message: "both password is not same" });

        }

    } catch (error) {
        console.log(error.message);
    }

}
const change_password = async (req, res) => {
    try {
        
        const id = req.session.user._id
        const user = req.session.user
        const old = req.body.oldPassword
        const newpassword = req.body.pass
        const repassword = req.body.pas
        if (repassword == newpassword) {
            const passwordMatch = await bcrypt.compare(old, user.pass);
            if (passwordMatch) {
                const spass = await securePassword(newpassword);
                const user = await User.updateOne({ _id: id }, { $set: { pass: spass } });

                res.json({ success: true })
            }else{

                res.json({success:false})
            }
            


        }

    } catch (error) {
        console.log(error.message);
    }
}

// show guest home page
const loadHome = async (req, res) => {
    try {

        const category = await Category.find()
        const banner = await Banner.find()
        const user = false
        const product = await Product.find({ unlist: true }).limit(6)
        res.render('home', { category, product, user, banner  });

    } catch (error) {
        console.log();
    }
}
const userhome = async (req, res) => {

    try {
        const id = req.session.user._id
        const banner = await Banner.find()
        const userdata = await User.findOne({ _id: id })
        const user = true
        const product = await Product.find({ unlist: true }).limit(6)
        const category = await Category.find()


        res.render('home', { user, product, category, userdata, banner })
    } catch (error) {

        console.log(error.message);
    }
}
const loadbycategory = async (req, res) => {

    try {

        let page = 1
        if (req.query.page) {
            page = req.query.page
        }
        let limit = 3
        let user
        if (req.session.user) {
            user = true
        } else {
            user = false
        }

        const cat_id = req.params.id
        const category = await Category.find({})
        const cat_name = await Category.findOne({ _id: cat_id })
        const coupon = await Coupon.find({active : true})
        const category_name = cat_name.category_name
        const product = await Product.find({ category: cat_id, unlist: true }).populate("category")
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec()
        const count_product = await Product.find().countDocuments()
        let countpro = Math.ceil(count_product / limit)
        res.render('shop', { product,  category_name, user, category, countpro ,coupon })

    } catch (error) {
        console.log(error.message);
    }
}

const loadshop = async (req, res) => {

    try {
        let page = 1
        if (req.query.page) {
            page = req.query.page
        }
        let limit = 3
        let user
        if (req.session.user) {
            user = true
        } else {
            user = false
        }
        const category_name = "All Products"
        const product = await Product.find({ unlist: true })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec()
        const count_product = await Product.find().countDocuments()
        let countpro = Math.ceil(count_product / limit)
        const category = await Category.find({})
        const coupon = await Coupon.find({active : true})
        res.render('shop', { product, user, category, category_name, countpro , coupon })

    } catch (error) {
        console.log(error.message);
    }
}
module.exports = {
    loadRegister,
    insertUser,
    loadLogin,
    logout_user,
    verifyLogin,
    loadHome,
    userhome,
    forgetload,
    forgetverify,
    VerifyMail,
    sendRestPassMail,
    forgetpasswordload,
    resetPassword,
    change_password,
    loadshop,
    loadbycategory,
    loadfaq,
    privacy_policy,
    aboutUs,
    send_verfymail
}