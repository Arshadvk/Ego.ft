let User = require('../models/userModel');
let Category = require('../models/category');
let Product = require('../models/productModel');

const config = require('../config/config')

const bcrypt = require('bcrypt');

// reguire nodemailer
const nodemailer = require('nodemailer');
const Order = require('../models/order');

const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;

    } catch (error) {
        console.log(error.message);
    }
}

const sendBlockMail = async (name, email, user_id) => {
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
            html: '<p>Hey ' + name + ', you are against our terms and conditions sorry sir we block your account for few days'


        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
             
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}

const sendunBlockMail = async (name, email, user_id) => {
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
            html: '<p>Hey ' + name + ', no you can use our website'


        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
              
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}

// login and logout
const loadLogin = async (req, res) => {
    try {
        res.redirect('/login')

    } catch (error) {

        console.log(error.message);
    }
}
const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;

        const pass = req.body.pass;

        const userData = await User.findOne({ email: email })

        if (userData) {

            const passwordMatch = await bcrypt.compare(pass, userData.pass)

            if (passwordMatch) {

                if (userData.is_admin === 1) {

                    req.session.admin = userData;

                    res.redirect('/admin/home')

                }

            } else {
                res.render('login', { message: "password is in correct ! " })
            }

        } else {
            res.render('login', { message: "Email and password is incorrect !" })
        }
    } catch (error) {
        console.log(error.message);
    }
}

const logout = async (req, res) => {

    try {
        req.session.destroy();
        res.redirect("/admin/login")

    } catch (error) {
        console.log(error.message);
    }
}
const addAdmin = async (req, res) => {
    try {
        const user = req.session.admin
        res.render('add-admin', { user });

    } catch (error) {

        console.log(error.message);
    }

}
const change_password = async (req, res) => {
    try {
        const id = req.session.admin._id
        const user = req.session.admin
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

const insertAdmin = async (req, res) => {

    try {


        if (req.body.pas != "" || req.body.name != "" || req.body.email != "" || req.body.number != "") {

            const email = await User.findOne({ email: req.body.email });

            if (!email) {


                if (req.body.pass === req.body.pas) {

                    const spass = await securePassword(req.body.pass);
                    const admin = req.session.admin

                    const user = new User({
                        name: req.body.name,
                        email: req.body.email,
                        number: req.body.number,
                        pas: spass,
                        pass: spass,
                        is_admin: 1,
                        status: true
                    })
                    const userData = await user.save();
                    if (userData) {
                        res.render('add-admin', { success: "your registration has been successfully.", user: admin })
                    } else {
                        res.render('add-admin', { message: "your registration has failed.", user: admin })
                    }
                }
                else {
                    res.render('add-admin', { message: "your both password not same", user: admin })
                }

            } else {
                res.render('add-admin', { message: "This email already taken", user: admin })
            }

        } else {
            res.render('add-admin', { message: "fill your form", user: admin })
        }



    } catch (error) {
        console.log(error.message);
    }
}

// user managment 
const loadUserlist = async (req, res) => {
    try {
        const user = req.session.admin
        const userData = await User.find({ is_admin: 0 });
        res.render('list-users', { users: userData, user })
    } catch (error) {
        console.log(error.message);
    }
}

const loadadmin = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.session.admin })
        const userData = await User.find({ is_admin: 1 });
        res.render('list-users', { users: userData, user })
    } catch (error) {
        console.log(error.message);
    }
}

// load home
const loadHome = async (req, res) => {

    try {
        // total sales
        const totalsales = await Order.find({ status: "Delivered" })
        let sum = 0
        for (let i = 0; i < totalsales.length; i++) {
            sum = sum + totalsales[i].totel
        }
        const salescount = await Order.find({ status: "Delivered" }).count()


        const cod = await Order.find({ paymentType: "COD" , status: "Delivered"  })
        let cod_sum = 0
        for (var i = 0; i < cod.length; i++) {
            cod_sum = cod_sum + cod[i].totel
        }

        const upi = await Order.find({ paymentType: "UPI" , status: "Delivered"  })

        let upi_sum = 0
        for (var i = 0; i < upi.length; i++) {
            upi_sum = upi_sum + upi[i].totel
        }

        const wallet = await Order.find({ paymentType: "WALLET" , status: "Delivered" })

        let wallet_sum = 0
       
        for (var i = 0; i < wallet.length; i++) {
            wallet_sum = wallet_sum + wallet[i].totel
        }

        

        const methodtotal = cod_sum + upi_sum + wallet_sum

        const upi_percentage = upi_sum / methodtotal * 100
        const wallet_percentage = wallet_sum / methodtotal * 100
        const cod_percentage = cod_sum / methodtotal * 100

        const deliveryCount = await Order.find({ status: "Delivered" }).count()
        const confirmedCount = await Order.find({ status: "Confirmed" }).count()
        const cancelledCount = await Order.find({ status: "Cancelled" }).count()
        const returnedCount = await Order.find({ status: "Return" }).count()

    

        const salesChart = await Order.aggregate([
          
            {
                $match: { status: "Delivered" } // Add $match stage to filter by status
              },
              {
                
              $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },

                sales: { $sum: '$totel' },
              },
            },
            {
              $sort: { _id: -1 },
            },
            {
              $limit: 7,
            },
          ]);
          

          const dates = salesChart.map((item) => {
            return item._id;
          })
      
          const sale = salesChart.map((item) => {
            return item.sales;
          });


      const salesr = sale.map((x)=>{
        return x
      })

      const date = dates.reverse()

      const sales = salesr.reverse()


        const user = await User.findOne({ _id: req.session.admin })
        res.render('home', {
            user,
            date , 
            sales ,
            catacount:"",
            deliveryCount,
            cancelledCount,
            returnedCount,
            confirmedCount,
            sum, cod_sum, upi_sum, wallet_sum,
            salescount,
            upi_percentage,
            cod_percentage,
            wallet_percentage

        })

    } catch (error) {

        console.log(error.message);
    }

}
const loadprofile = async (req, res) => {

    try {
        const user = await User.findOne({ _id: req.session.admin })
        res.render('profile', { user })
    } catch (error) {

        console.log(error.message);
    }
}

const edit_profile = async (req, res) => {

    try {
        if (req.body.name.trim() == "" || req.body.number.trim() == "" || req.body.email.trim() == "") {

            res.json({ success: false })
        } else {
            const id = req.session.admin._id
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

        console.log(error.message);
    }
}

const blockuser = async (req, res) => {

    try {
        const userId = req.query.id;

        const userData = await User.findByIdAndUpdate({ _id: userId }, { $set: { status: false } });

        sendBlockMail(userData.name, userData.email);

        res.redirect('/admin/userlist');

    } catch (error) {

        console.log(error.message);

    }
}

const unblockuser = async (req, res) => {

    try {

        const userId = req.query.id;

        const userData = await User.findByIdAndUpdate({ _id: userId }, { $set: { status: true } })

        sendunBlockMail(userData.name, userData.email);

        res.redirect('/admin/userlist');

    } catch (error) {

        console.log(error.message);

    }

}



module.exports = {
    loadLogin,
    loadUserlist,
    verifyLogin,
    logout,
    loadHome,
    loadprofile,
    logout,
    addAdmin,
    blockuser,
    unblockuser,
    insertAdmin,
    loadadmin,
    change_password,
    edit_profile
}