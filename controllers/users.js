const User = require('../models/users');

module.exports.renderSignupForm = (req, res) => {
    res.render('users/signup')
}

module.exports.signup = async (req, res) => {
    try {

        const { username, email, password } = req.body;
        const newUser = new User({
            username, email
        });

        const registedUser = await User.register(newUser, password)
        console.log(registedUser)
        req.login(registedUser, (err) => {
            if(err) {
                return next(err)
            }
            req.flash("success", 'User is been Successfully Registered')
            res.redirect('/listings')
        })

        
    } catch (e) {
        req.flash("error", e.message)
        res.redirect('/signup')
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login')
}

module.exports.login = async (req, res) => {
        req.flash('success', 'Welocome to Wanderlust')
        let redirectURL = res.locals.redirectURL || '/listings'
        res.redirect(redirectURL)
    }

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err)
        }
        req.flash('success', 'Your now logged out!!')
        res.redirect('/listings')
    })
}