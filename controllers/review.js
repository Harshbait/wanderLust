const Review = require('../models/reviews')
const Listing = require('../models/listing')

module.exports.uploadReview = async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review)
    newReview.author = req.user._id
    console.log(newReview)

    listing.reviews.push(newReview)

    await newReview.save() 
    await listing.save()
    req.flash("success", "New Review created!")

    res.redirect(`/listings/${listing._id}`)
}

module.exports.destoryReview = async(req, res) => {
    let {id, reviewid} = req.params

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewid}})
    await Review.findByIdAndDelete(reviewid)
    req.flash("success", "Review is Deleted!")
    res.redirect(`/listings/${id}`)
}