const mongoose = require('mongoose');
const Review = require('./reviews');
const User = require('./users');
const { required } = require('joi');
const Schema = mongoose.Schema;

const listengSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: String,
        filename: String
    },
    price: {
        type: Number,
        default: 1000
    },
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    category: {
        type: String,
        enum: ["trending", "rooms", "iconic cities", "mountain", "castle", "amazing pools", "camping", "farm", "lake", "arctic"]

    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
})

listengSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({
            comment: { $in: listing.reviews }
        })
    }
})

const Listing = mongoose.model('Listing', listengSchema);

module.exports = Listing;