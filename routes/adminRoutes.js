const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('../config/config');
const banner = require('../controllers/banner');
const auth = require('../middileware/adminauth');
const admincontroller = require('../controllers/admin');
const product_controller = require('../controllers/product');
const category_controller = require('../controllers/category');
const order_controller = require('../controllers/order');
const Banner = require('../models/banner');

const upload = config.Storage()

const admin_route = express();

admin_route.set('views', './views/admin');


admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({ extended: true }));

//login
admin_route.get('/login', auth.isLogout, admincontroller.loadLogin);
admin_route.post('/login', admincontroller.verifyLogin);
admin_route.get('/logout', auth.isLogin, admincontroller.logout);



// dashborad
admin_route.get('/home', auth.isLogin, admincontroller.loadHome)
admin_route.post('/change-password',admincontroller.change_password)

//user management
admin_route.get('/userlist', auth.isLogin, admincontroller.loadUserlist);
admin_route.get('/block-user', auth.isLogin, admincontroller.blockuser);
admin_route.get('/unblock-user', auth.isLogin, admincontroller.unblockuser);



// admin management
admin_route.get('/profile', auth.isLogin, admincontroller.loadprofile);
admin_route.post('/edit-address', admincontroller.edit_profile)
admin_route.get('/add-admin', auth.isLogin, admincontroller.addAdmin);
admin_route.post('/add-admin', admincontroller.insertAdmin);
admin_route.get('/admin_list', auth.isLogin, admincontroller.loadadmin)


// product managment
admin_route.get('/add-product', auth.isLogin, product_controller.loadAddProduct);
admin_route.post('/add-product', upload.array('image', 4), product_controller.addProduct);
admin_route.get('/list-product', auth.isLogin, product_controller.productlist);
admin_route.post('/delete-product', product_controller.unlistproduct);
admin_route.post('/unlist-product', product_controller.listproduct)
admin_route.get('/edit-product', auth.isLogin, product_controller.editproduct);
admin_route.post('/edit-product/:id', auth.isLogin, product_controller.updateproduct);


// category managment 
admin_route.get('/add-category', auth.isLogin, category_controller.loadAddCategory);
admin_route.post('/add-category', upload.single('image'), category_controller.addCategory);
admin_route.get('/list-category', auth.isLogin, category_controller.listCategory);
admin_route.get('/delete-category', auth.isLogin, category_controller.deleteCategory);
admin_route.get('/edit-category',auth.isLogin , category_controller.editCategory)
admin_route.post('/edit-category',category_controller.upadte_category)

//banner managment 
admin_route.get('/add-banner', auth.isLogin, banner.show_banner)
admin_route.post('/add-banner', auth.isLogin, upload.single('image'), banner.add_banner)
admin_route.get('/list-banner', auth.isLogin, banner.show_banner_list)
admin_route.post('/delete-banner', banner.delete_banner);
admin_route.post('/edit-banner', banner.edit_banner);



admin_route.get('/add-coupon', auth.isLogin, order_controller.load_coupon);
admin_route.post('/add-coupon', order_controller.add_coupon);
admin_route.get('/list-coupon', auth.isLogin, order_controller.list_coupon);
admin_route.post('/delete-coupon', auth.isLogin, order_controller.delete_coupon)
admin_route.get('/edit-coupon', auth.isLogin, order_controller.edit_coupon);
admin_route.post('/edit-coupon', order_controller.editing_coupon);
admin_route.post('/coupon_active', order_controller.coupon_active)


admin_route.get('/list-order', auth.isLogin, order_controller.load_order);
admin_route.get('/view-order', auth.isLogin, order_controller.view_order_admin)
admin_route.post('/update_status', auth.isLogin, order_controller.updateStatus);
admin_route.post('/confirm_return', order_controller.confirm_return)


admin_route.get('/sales-report', auth.isLogin , admincontroller.salesReport );
admin_route.post('/sales-report' , auth.isLogin , admincontroller.showSalesreport );

admin_route.get('/500' ,admincontroller.serverError )

admin_route.get('*', (req, res) => {

    res.redirect('/login')
})


module.exports = admin_route;

