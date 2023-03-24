let Banner = require('../models/banner');
let User = require('../models/userModel')
const show_banner = async (req, res) => {

    try {
        const user = req.session.admin
        res.render('add-banner', { user })

    } catch (error) {
        console.log(error.message);
    }
}

const add_banner = async (req, res) => {

    try {
        const user = req.session.admin
        const title = req.body.title
        const image = req.file.filename
        const sub_title = req.body.sub_title

        if (image !== "" && sub_title.trim() !== "" && title.trim() !== "" ) {
            const banner = new Banner({
                title: title,
                Image: image,
                sub_title: sub_title

            })

            const bannerData = await banner.save();
            if (bannerData) {
                res.render('add-banner', { user })
            }
        } else {
            res.render('add-banner', { message: "fill your form", user })
        }


    } catch (error) {
        console.log(error.message);
    }
}

const show_banner_list = async (req, res) => {

    try {
        const user = await User.findOne({ _id: req.session.admin })
        const bannerData = await Banner.find()
        res.render('list-banner', { banner: bannerData, user })

    } catch (error) {
        console.log(error.message);
    }
}

const delete_banner = async (req, res) => {

    try {
        const banner_id = req.body.banner
        const data = await Banner.deleteOne({ _id: banner_id })

        res.json({ success: true })



    } catch (error) {
        console.log(error.message);
    }


}
module.exports = {
    show_banner,
    add_banner,
    show_banner_list,
    delete_banner
}