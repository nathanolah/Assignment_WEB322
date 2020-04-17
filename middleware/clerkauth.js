const isClerkLoggedIn = (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.inventoryClerk == true) {
            next();
        }
        else {
            res.redirect('/user/login');
        }
    }
    else {
        res.redirect('/user/login');
    }
}

module.exports = isClerkLoggedIn; 