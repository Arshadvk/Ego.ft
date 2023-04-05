let User = require("../models/userModel");
let Category = require("../models/category");
let Product = require("../models/productModel");
let Coupon = require("../models/coupon");
let Order = require("../models/order");
const uuid = require("uuid");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const { findOne } = require("../models/category");
require("dotenv").config();


var instance = new Razorpay({

  key_id: process.env.KEY_ID,

  key_secret: process.env.KEY_SECRET,

});



const load_coupon = async (req, res) => {

  try {



    const admin = req.session.admin;

    req.session.admin = admin;

    res.render("add-coupon", { user: admin });

  } catch (error) {

    console.log(error.message);

  }

};



const add_coupon = async (req, res) => {

  try {

    const user = req.session.admin;

    const id = req.session.admin;

    const name = req.body.name;

    const code = req.body.code;

    const date = req.body.date;

    const discountprice = req.body.discountprice;

    const discount_percentage = req.body.discount_percentage;

    const description = req.body.description;

    const min_amount = req.body.min_amount;

    if (min_amount.trim() > 0 &&
      description.trim() !== "" &&
      discount_percentage > 0 &&
      discountprice > 0
      && code.trim() !== "" &&
      name.trim() !== "") {

      const coupon = new Coupon({

        coupon_name: req.body.name,

        description: req.body.description,

        code: req.body.code,

        expiry_date: req.body.date,

        discountpercentage: req.body.discount_percentage,

        maxdiscountprice: req.body.discountprice,

        min_amount: req.body.min_amount,

      });

      const data = await coupon.save();

      if (data) {

        res.render("add-coupon", { user });

      }
    } else {

    }
  } catch (error) {

    console.log(error.message);

  }

};



const list_coupon = async (req, res) => {

  try {

    const user = await User.findOne({ _id: req.session.admin });

    const coupon = await Coupon.find();

    res.render("list-coupon", { coupon, user });

  } catch (error) {

    console.log(error.message);

  }
};

const delete_coupon = async (req, res) => {

  try {

    const id = req.body.couponid;

    const coupon = await Coupon.deleteOne({ _id: id });

    res.json({ success: true });

  } catch (error) {

    console.log(error.message);

  }
};



const edit_coupon = async (req, res) => {

  try {

    const user = req.session.admin;

    const id = req.query.id;

    const coupon = await Coupon.find({ _id: id });

    res.render("edit-coupon", { coupon, user });

  } catch (error) {

    console.log(error.message);

  }
};



const editing_coupon = async (req, res) => {

  try {

    const id = req.body.id;

    const name = req.body.name;

    const code = req.body.code;

    const date = req.body.date;

    const discountprice = req.body.discountprice;

    const min_amount = req.body.min_amount;

    const discount_percentage = req.body.discount_percentage;

    const description = req.body.description;

    const upadate = await Coupon.updateOne(
      { _id: id },
      {
        $set: {

          coupon_name: name,

          code: code,

          expiry_date: date,

          discountpercentage: discountprice,

          description: description,

          maxdiscountprice: discount_percentage,

          min_amount: min_amount

        },
      }
    );


    res.redirect("/admin/list-coupon");

  } catch (error) {

    console.log(error.message);

  }

};

const coupon_active = async (req, res) => {

  try {
    const coupon_id = req.body.coupid
    const value = req.body.value
    const coupon = await Coupon.updateOne({ _id: coupon_id }, { $set: { active: value } })
    res.json({ success: true })
  } catch (error) {

    console.log(error.message);
  }
}

const show_checkout = async (req, res) => {

  try {

    const id = req.session.user._id;

    const user = await User.find({ _id: id }).populate("cart.product");

    const cart = await User.find({ _id: id });

    if (cart[0].cart.length > 0) {

      res.render("checkout", { user });

    } else {

    }
  } catch (error) {

    console.log(error.message);

  }

};


const apply_coupon = async (req, res) => {

  try {

    const id = req.session.user._id;

    const code = req.body.couponcode;

    const cartTotel = req.body.cartTotel;


    const coupondata = await Coupon.findOne({ code: code });

    const userused = await Coupon.findOne({ code: code, used: { $in: [id] } });

    const currentdate = Date.now();

    if (coupondata) {

      if (userused) {


        res.json({ used: true });

      } else {

        if (currentdate <= coupondata.expiry_date) {

          if (coupondata.min_amount <= cartTotel) {

            let discountAmount =

              cartTotel * (coupondata.discountpercentage / 100);


            if (discountAmount <= coupondata.maxdiscountprice) {

              let discount_value = discountAmount;

              let value = cartTotel - discount_value;


              const coupon_apply = await User.updateOne(

                { _id: req.session.user._id },

                { $set: { cartTotel: value } }

              );

              const coupon_used = await Coupon.updateOne(

                { code: code },

                { $push: { used: id } }

              );


              res.json({ success: true, value, discount_value, code });

            } else {

              let discount_value = coupondata.maxdiscountprice;

              let value = cartTotel - discount_value;

              const coupon_apply = await User.updateOne(

                { _id: req.session.user._id },

                { $set: { cartTotel: value } }

              );

              const coupon_used = await Coupon.updateOne(

                { code: code },

                { $push: { used: id } }

              );


              res.json({ success: true, value, discount_value, code });

            }

          } else {

            res.json({ lessamount: true });

          }

        } else {

          res.json({ expired: true });

        }

      }

    } else {

      res.json({ invalid: true });

    }

  } catch (error) {

    console.log(error.message);

  }
};

const place_order = async (req, res) => {
  try {

    const id = req.session.user._id;

    const user = await User.findOne({ _id: id })

    const productPush = [];

    const orderData = req.body;

    //converting to array
    if (!Array.isArray(orderData.productId)) {

      orderData.productId = [orderData.productId];

    }
    if (!Array.isArray(orderData.qty)) {

      orderData.qty = [orderData.qty];

    }
    if (!Array.isArray(orderData.singleTotel)) {

      orderData.singleTotel = [orderData.singleTotel];

    }
    if (!Array.isArray(orderData.price)) {

      orderData.price = [orderData.price];

    }


    for (let i = 0; i < orderData.productId.length; i++) {
      let productssid = orderData.productId[i];
      let quantitys = orderData.qty[i];
      let singleTotels = orderData.singleTotel[i];
      let price = orderData.price[i];


      productPush.push({
        productid: productssid,
        qty: quantitys,
        singleTotel: singleTotels,
        singlePrice: price,
      });
    }

    // status updating
    let status

    if (req.body.payment_method == "COD") {

      status = "Confirmed"

    } else if (req.body.payment_method == "UPI") {

      status = "Pending"

    } else if (req.body.payment_method == "WALLET") {
      if (user.wallet < orderData.totel) {

        res.json({ wallet: false })

        return
      }

      status = "Confirmed"

    }

    const index = req.body.address
    const address = {
      name: user.address[index].name  ,
      number: user.address[index].number ,
      pincode: user.address[index].pincode ,
      state: user.address[index].state ,
      district : user.address[index].district ,
      place : user.address[index].place ,
      street: user.address[index].street ,
      building: user.address[index].building ,

    }
    const totel = req.body.totel;
    const orderId = `Order#${uuid.v4()}`;
    const order = new Order({
      userId: req.session.user._id,
      address: address,
      product: productPush,
      totel: totel,
      paymentType: req.body.payment_method,
      status: status,
      orderId: orderId,
    });

    const neworderData = await order.save();

    if (req.body.payment_method == "COD") {

      res.json({ status: true });

    }


    else if (req.body.payment_method == "UPI") {

      const order = await Order.findOne().sort({ date: -1 });

      let options = {
        amount: req.body.totel * 100,
        currency: "INR",
        receipt: "" + order._id,
      };

      instance.orders.create(options, function (err, order) {

        res.json({ viewRazorpay: true, order });

      });
    } else if (req.body.payment_method == "WALLET") {

      const walupdate = user.wallet - orderData.totel

      await User.updateOne({ _id: id }, { $set: { wallet: walupdate } })

      res.json({ status: true })

    }


  } catch (error) {

    res.render('500');
    console.log(error.message);
    
  }
};

const verify_payment = async (req, res) => {
  try {
    const id = req.session.user._id;

    const latestOrder = await Order.findOne().sort({ date: -1 });

    const upadateOrder = await Order.updateOne(
      { orderId: latestOrder.orderId },
      { $set: { status: "Confirmed" } }
    );

    const details = req.body;


    let hmac = crypto.createHmac("sha256", process.env.KEY_SECRET);
    hmac.update(
      details["payment[razorpay_order_id]"] +
      "|" +
      details["payment[razorpay_payment_id]"]
    );
    hmac = hmac.digest("hex");
    if (hmac == details["payment[razorpay_signature]"]) {
      res.json({ status: true });
    } else {
      res.json({ failed: true });


    }
  } catch (error) {

    res.render('500');
    console.log(error.message);

  }
};

const order_success = async (req, res) => {
  try {
    const user = req.session.user;
    const userdata = await User.findOne({ _id: user });

    const removeing = await User.updateOne(
      { _id: user },
      { $set: { cart: [], cartTotel: 0 } }
    );

    const order = await Order.findOne().sort({ date: -1 }).populate({ path: 'product', populate: { path: 'productid', model: 'Product' } })

   
    for (let i = 0; i < order.product.length; i++) {
      await Product.updateOne(
        { _id: order.product[i].productid },
        { $inc: { quantity: -order.product[i].qty } }
      );
    }

    const category = await Category.find();
    res.render("order_success", { user, category, order, userdata });
  } catch (error) {

    res.render('500');
    console.log(error.message);

  }
};

const load_order = async (req, res) => {
  try {
    const user = req.session.admin;
    const order = await Order.find().populate("userId");
    const user_id = await Order.find()
    res.render("list-order", { order, user, user_id });
  } catch (error) {

    res.render('500');
    console.log(error.message);

  }
};

const cancel_order = async (req, res) => {
  try {
    const orderId = req.body.orderId;
    const userid = req.session.user._id;

    const cancel = await Order.updateOne(
      { _id: orderId },
      { $set: { status: "Cancelled" } }
    );
    const orderdata = await Order.findOne({ _id: orderId });
    if (orderdata.paymentType == "UPI") {
      const refund = await User.updateOne(
        { _id: userid },
        { $inc: { wallet: orderdata.totel } }
      );
    }

    if (cancel) {
      res.json({ success: true });
    }
  } catch (error) {
    res.render('500');
    console.log(error.message);
  }
};

const retrun_order = async (req, res) => {
  try {
    const order_id = req.body.orderId;
    const retrun_order = await Order.updateOne(
      { _id: order_id },
      { $set: { status: "Return Pending" } }
    );
    res.json({ success: true });
  } catch (error) {
    res.render('500');
    console.log(error.message);
  }
};

const updateStatus = async (req, res) => {
  try {
    const orderId = req.body.order_Id;

    const status = req.body.status;

    const update = await Order.updateOne(
      { _id: orderId },
      { $set: { status: status } }
    );
    res.json({ success: true });
  } catch (error) {
    res.render('500');
    console.log(error.message);
  }
};

const confirm_return = async (req, res) => {
  try {
    const orderId = req.body.order_Id;

    const status = req.body.status;
    const order = await Order.find({ _id: orderId });

    const upate = await Order.updateOne(
      { _id: orderId },
      { $set: { status: status } }
    );
  } catch (error) {

    res.render('500');
    console.log(error.message);
  }
};

const show_orderlist = async (req, res) => {
  try {
    const id = req.session.user._id;

    const user = await User.findOne({ _id: id });

    const orders = await Order.find({ userId: user });

    const category = await Category.find();

    res.render("list-orders", { user, category, orders });

  } catch (error) {
    res.render('500');
    console.log(error.message);

  }

};

const view_order_admin = async (req, res) => {
  try {

    const user = req.session.admin;

    const order_id = req.query.id;

    const order = await Order.find({ _id: order_id }).populate(

      "product.productid"

    );

    const user_id = await Order.find({ _id: order_id }).populate("userId");


    res.render("view-order", { user, order, user_id });

  } catch (error) {

    res.render('500');
    console.log(error.message);

  }

};

const view_order_user = async (req, res) => {

  try {

    const user = true;

    const order_id = req.query.id;

    const category = await Category.find();

    const order = await Order.find({ _id: order_id }).populate(

      "product.productid"

    );

    res.render("view-order", { order, user, category });

  } catch (error) {

    res.render('500');
    console.log(error.message);

  }
};
module.exports = {
  show_checkout,
  load_coupon,
  add_coupon,
  delete_coupon,
  edit_coupon,
  list_coupon,
  place_order,
  cancel_order,
  load_order,
  order_success,
  updateStatus,
  show_orderlist,
  editing_coupon,
  view_order_admin,
  view_order_user,
  verify_payment,
  retrun_order,
  confirm_return,
  apply_coupon,
  coupon_active
};
