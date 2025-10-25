const mongoose = require('mongoose')
const initData = require('./data');
const Listing = require('../models/listing');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"

main().then(() => {
    console.log('Connected to DB')
}).catch((e) => console.log(`Error is: ${e}`))

async function main() {
    await mongoose.connect(MONGO_URL)
}

const initDB = async () => {
    await Listing.deleteMany({})
    initData.data  = await initData.data.map((obj) => ({...obj, owner: '68e89295a79668afaeb742c4'}))
    await Listing.insertMany(initData.data)
    console.log("Data is been Initilized")

}

initDB()