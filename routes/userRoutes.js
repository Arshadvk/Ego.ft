// require express
const express = require('express');
const bodyParser = require('body-parser');
const config = require('../config/config');
const auth = require('../middileware/auth');
const adminauth = require('../middileware/adminauth');
const userController = require('../controllers/user');
const category_controller = require('../controllers/category');
const product_controller = require('../controllers/product');
const cart_controller = require('../controllers/cart')
const wishlist_controller = require('../controllers/wishlist');
const profile = require('../controllers/profile');
const otp = require('../controllers/otp');
const order = require('../controllers/order');


const user_route = express();
user_route.set('views', './views/users');


user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));


// login and signup 
user_route.get('/signup', userController.loadRegister);
user_route.post('/signup', userController.insertUser);
user_route.get('/login', auth.isLogout, adminauth.isLogout, userController.loadLogin);
user_route.post('/login', userController.verifyLogin);
user_route.get('/logout', userController.logout_user)


// guset home
user_route.get('/', auth.isLogout, userController.loadHome);
user_route.get('/home', auth.islogin, userController.userhome);

user_route.get('/faq',userController.loadfaq)

//profile
user_route.get('/profile', auth.islogin, profile.show_profile);
user_route.post('/edit-profile', profile.edit_profile)


//forget password
user_route.get('/forget', userController.forgetload);
user_route.post('/forget', userController.forgetverify);
user_route.get('/forget-password', userController.forgetpasswordload);
user_route.post('/forget-password/:id', userController.resetPassword);
user_route.post('/change-password',userController.change_password);


//verify email
user_route.get('/verify', userController.VerifyMail);
user_route.get('/verification');
user_route.post('/verification');


//otp verify 
user_route.get('/sendotp', otp.mobileCheck);
user_route.post('/sendotp', otp.verifyPhone);
user_route.post('/otp', otp.verifyOtp)


// product 
user_route.get('/shop', userController.loadshop);
user_route.get('/category/:id', userController.loadbycategory)
user_route.get('/product_view', product_controller.product_view);
user_route.get('/sort', product_controller.sort_az)



user_route.get('/cart', auth.islogin, cart_controller.show_cart);
user_route.post('/add_cart', cart_controller.add_cart);
user_route.post('/remove_cart', cart_controller.delete_cart);
user_route.post('/changeqty', cart_controller.Qtychange);



user_route.get('/address', auth.islogin, profile.showAddress);
user_route.post('/add_address', profile.add_address);
user_route.post('/delete_address', profile.deleteAddress);
user_route.post('/edit-address', profile.edit_address);



user_route.get('/wishlist',auth.islogin, wishlist_controller.show_wishlist);
user_route.post('/add_to_wishlist', wishlist_controller.add_wishlist);
user_route.post('/remove_wishlist', wishlist_controller.remove_from_wishlist);
user_route.post('/add_to_cart',wishlist_controller.add_to_cart);



user_route.get('/orders',auth.islogin, order.show_orderlist);
user_route.get('/checkout',auth.islogin, auth.islogin, order.show_checkout);
user_route.post('/place_order', order.place_order);
user_route.post('/verify-payment',order.verify_payment);
user_route.post('/apply_coupon',order.apply_coupon)
user_route.get('/order_success',auth.islogin, order.order_success);
user_route.get('/view-order' , auth.islogin,order.view_order_user);
user_route.post('/cancel_order',order.cancel_order);
user_route.post('/retrun_order',order.retrun_order);



user_route.get('*', (req, res) => {

  res.render('404', { message: "this page not found" })
})


module.exports = user_route;