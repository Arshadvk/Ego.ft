const User = require('../models/userModel');
const Product = require('../models/productModel');
const Category = require('../models/category');
require("dotenv").config()

const { TWILIO_SERVICE_SID, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
    lazyLoading: true
})

const show_otp = async (req, res) => {

    try {
        res.render("otp", { message: "" })
    } catch (error) {

        res.render('500');
        console.log(error.message);
    }
}

const mobileCheck = async (req, res) => {
    try {
        res.render("mobileCheck", { message: "" })
    } catch (error) {

        res.render('500');
        console.log(error.message);
    }
}

const verifyPhone = async (req, res) => {

    try {
        const num = await req.body.number
        const check = await User.findOne({ number: num })
        if (check) {
            const otpResponse = await client.verify.v2.services(TWILIO_SERVICE_SID).verifications.create({
                to: `+91${num}`,
                channel: "sms"
            })
            res.render('otp', { message: "", number: num })
        } else {
            res.render('mobileCheck', { message: "did not register this mobile number" })
        }

    } catch (error) {

        res.render('500');
        console.log(error.message);
    }
}

const verifyOtp = async (req, res) => {

    try {

        const num = req.body.number
        const otpp = req.body.otp
        const otp = otpp.join("")

        const verificationResponse = await client.verify.v2.services(TWILIO_SERVICE_SID).verificationChecks.create({
            to: `+91${num}`,
            code: otp,

        })
        if (verificationResponse.status == 'approved') {
            const userDetails = await User.findOne({ number: num })
            req.session.user = userDetails
            res.redirect('/home');
        } else {
            res.render('otp', { message: 'incorect otp', number: num })
        }

    } catch (error) {

        res.render('500');
        console.log(error.message);
    }
}


module.exports = {
    show_otp,
    mobileCheck,
    verifyPhone,
    verifyOtp,

}