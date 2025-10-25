const Listing = require('./models/listing')
const Review = require('./models/reviews')
const ExpressError = require('./utils/ExpressError')
const { listingsSchema, reviewSchema } = require('./schema')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //We save redirect url
        req.session.redirectURL = req.originalUrl;        
        req.flash('error', 'You must logged-in to create listing!!')
        return res.redirect('/login')
    }
    next()
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectURL) {
        res.locals.redirectURL = req.session.redirectURL;
    }
    next()
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    // Check ownership
    if (!listing.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", "You don't have permission to edit or delete this listing.");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

module.exports.validateListing = (req, res, next) => {
    //Using Listing schema here it is a Joi

    let {err} = listingsSchema.validate(req.body)
    if(err) {
        let errMsg = err.details.map((el) => el.message).join(',')
        throw new ExpressError(400, errMsg)
    }
    else{
        next()
    }
}

module.exports.validateReview = (req, res, next) => {
    //Using Listing schema here it is a Joi

    let {err} = reviewSchema.validate(req.body)
    if(err) {
        let errMsg = err.details.map((el) => el.message).join(',')
        throw new ExpressError(400, errMsg)
    }
    else{
        next()
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id ,reviewid } = req.params;
    const review = await Review.findById(reviewid);

    if (!review) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    // Check AuthorShip
    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You don't have permission to delete this review.");
        return res.redirect(`/listings/${id}`);
    }

    next();
};