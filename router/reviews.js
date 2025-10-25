const express = require('express')
const router = express.Router({ mergeParams: true  });
const wrapAsync = require('../utils/asyncWrap')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
const reviewControllers = require('../controllers/review')


//Reviews
//Post Route
router.post('/', validateReview ,isLoggedIn, wrapAsync(reviewControllers.uploadReview))

//Delete Review Route
router.delete('/:reviewid', isReviewAuthor,wrapAsync(reviewControllers.destoryReview))


module.exports = router;