const Listing = require('../models/listing')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render('listings/index', { allListings })
}

module.exports.newListining = (req, res) => {
    res.render('listings/new')
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id).populate({
        path: 'reviews', populate: {
            path: 'author'
        }
    }).populate('owner')
    console.log(list)
    if (!list) {
        req.flash("error", "Listing you trying to visit is does not exist!!")
        return res.redirect('/listings')
    }
    console.log(list)
    res.render('listings/show', { list })
}

module.exports.createListings = async (req, res) => {
    // //Using Listing schema here it is a Joi

    // let result = listingsSchema.validate(req.body)
    // console.log(result)
    // if(result.error) {
    //     throw new ExpressError(400, result.error)
    // }
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listings.location,
        limit: 1
    })
        .send()

    console.log(response.body.features[0].geometry);
    // res.send('done')


    let url = req.file.path;
    let filename = req.file.filename
    let listings = req.body.listings;
    req.flash("success", "New Listing is created!")
    const newListining = new Listing(listings)
    console.log(req.user)
    newListining.image = { url, filename };
    newListining.owner = req.user._id;

    newListining.geometry = response.body.features[0].geometry;  //Value is coming from Mapbox

    let savedListing = await newListining.save()
    console.log(savedListing)
    res.redirect('/listings')
}

module.exports.editListings = async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id)
    if (!list) {
        req.flash("error", "Listing you trying to visit is does not exist!!")
        return res.redirect('/listings')
    }

    let orignalImageUrl = list.image.url;
    orignalImageUrl = orignalImageUrl.replace("/upload", '/upload/,w_250');
    res.render('listings/edit', { list, orignalImageUrl })
}

module.exports.updateListings = async (req, res) => {
    // if(!req.body.listings) {
    //     throw new ExpressError(400, "Send valid data for listing")
    // }
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listings })

    if (typeof req.file !== 'undefined') {
        let url = req.file.path;
        let filename = req.file.filename
        listing.image = { url, filename };
        await listing.save()
    }

    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`)
}

module.exports.destoryListings = async (req, res) => {
    let { id } = req.params;
    let deleteList = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing is Deleted!")
    console.log(deleteList)
    res.redirect('/listings')
}

module.exports.categoryListing = async (req, res) => {
    const { category } = req.params;
    const listings = await Listing.find({ category: category.toLowerCase() });
    res.render("listings/category", { listings, category });
}

module.exports.searchListing = async (req, res) => {
    const query = req.query.search;

    let listings = [];
    if (query) {
        // Search in title, location, or country (case-insensitive)
        listings = await Listing.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { location: { $regex: query, $options: 'i' } },
                { country: { $regex: query, $options: 'i' } }
            ]
        });
    } if (query === "") {
        req.flash('error', "Enter Destinition before search")
        return res.redirect('/listings');
    }

    res.render('listings/searchResults', { listings, query });
}

// module.exports.category = async (req, res) => {
//     const { category } = req.query;
//     let listings;

//     if (category) {
//         listings = await Listing.find({ category: category.toLowerCase() });
//     } else {
//         listings = await Listing.find({});
//     }

//     res.render('listings/category', { listings, category });
// };

