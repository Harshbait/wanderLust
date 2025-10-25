const { required } = require('joi');
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const plm = require('passport-local-mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    }
})

const User = userSchema.plugin(plm)

module.exports = mongoose.model('User', userSchema)