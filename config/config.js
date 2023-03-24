const sessionSecret = "mysecretsession";
const emailUser = process.env.EMAIL;
const emailPass = process.env.PASSWORD ;

const mongoose = require('mongoose');

const multer = require('multer');
const path = require('path');

function Storage() {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, '../public/product_img'));
        }, filename: function (req, file, cb) {
            const name = Date.now() + '-' + file.originalname;
            cb(null, name);
        }
    })

    const upload = multer({ storage: storage })
    return upload
}


function mongooseconnection() {
    mongoose.set('strictQuery', true)
    mongoose.connect(process.env.MONGO_CONNECTION);

}
module.exports = {

    sessionSecret,
    emailPass,
    emailUser,
    Storage,
    mongooseconnection

} 
