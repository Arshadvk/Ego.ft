const islogin = async (req, res, next) => {

    try {
        if (req.session.user) {
            next();
        } else {
            res.redirect('/');
        }
    } catch (error) {
        console.log(error.message);
    }
}

const isLogout = async (req, res, next) => {
    try {

        if (req.session.user) {
            res.redirect('/home');
        } else {
            next()
        }
    } catch (error) {
        console.log(error.message);
    }
}
const is_not_logged = async (req, res, next) => {

    try {

    } catch (error) {

    }
}

module.exports = {
    isLogout,
    islogin
} 