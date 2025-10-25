const express = require('express');
const router = express.Router();
const Listing = require('../models/listing')
const wrapAsync = require('../utils/asyncWrap')
const flash = require('connect-flash')
const { isLoggedIn, isOwner, validateListing } = require('../middleware')
const listingControllers = require('../controllers/listings');
const { route } = require('./user');
const multer  = require('multer')
const { storage } = require('../cloudConfig')
const upload = multer({ storage })

//Index Route & Create Route
router
    .route('/')
    .get(wrapAsync(listingControllers.index))
    
    .post(isLoggedIn, upload.single('listings[image]'), validateListing, wrapAsync(listingControllers.createListings))
    // .post(upload.single('listings[image]'), (req, res) => {
    //     res.send(req.file)
    // })


router.get('/search', wrapAsync(listingControllers.searchListing));


    
// Filter listings by category
router.get("/category/:category", listingControllers.categoryListing);




//New Route
router.get('/new', isLoggedIn, listingControllers.newListining)


// Show & Update & Delete Route
router
    .route('/:id')
    .get(wrapAsync(listingControllers.showListing))
    .put(isLoggedIn, isOwner, upload.single('listings[image]'), validateListing, wrapAsync(listingControllers.updateListings))
    .delete(isLoggedIn, isOwner, wrapAsync(listingControllers.destoryListings))

//Edite Route
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingControllers.editListings))

module.exports = router;