const isLogin = async (req, res, next) => {
    try {

        if (req.session.admin) {

        }
        else {
            res.redirect('/login');
            return;
        }
        next();

    } catch (error) {
        console.log(error.message);
    }
}

const isLogout = async (req, res, next) => {
    try {

        if (req.session.admin) {
            res.redirect('/admin/home')
            return;
        }
        next();

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    isLogin,
    isLogout
}