if(process.env.NODE_ENV != 'production'){
    require('dotenv').config()
}

const express = require('express');
const app = express();
const mongoose = require('mongoose')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('connect-flash')
const passport = require('passport')
const localStrategy = require('passport-local')
const User = require('./models/users')
const PORT = 5000;

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"
const dburl = process.env.ATLASDB_URL


const listingRouter = require("./router/listing")
const reviewRouter = require('./router/reviews')
const userRouter = require('./router/user')

main().then(() => {
    console.log("Connected to the database")
}).catch((e) => {
    console.log(`Error is: ${e}`)
})

async function main() {
    await mongoose.connect(dburl)
}

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, "views"))
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, '/public')))

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECERET
    },
    touchAfter: 24 * 3600,
})

store.on("error", () => {
    console.log('ERROR in Mongo_Session', err)
})

const sessionOptions = { 
    store,
    secret:  process.env.SECERET,
    resave: true,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        httpOnly: true
    }
};

// app.get('/', (req,res)=>{
//     res.send("Hii am airbnb ")   
// })



app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user;
    next()   
})


app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRouter);
app.use('/', userRouter)

// app.get('/demoUser', async(req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: 'delta-name'
//     })

//     const newUs = await User.register(fakeUser, "heloo")
//     res.send(newUs)
// })

// app.get('/testListing', async(req, res) => {
//     let sampleListing = new Listing({
//         title: "My new Vannila ice",
//         discription: "Box",
//         price: 1200,
//         location: "Mumbai, Sawantwadi",
//         country: "India"
//     })

//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Successfull")
// })

//It will catch all routes
app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let {statusCode=500, message="Something Went Wrong!!"} = err;
    res.status(statusCode).render("listings/error", {message})
    // res.status(statusCode).send(message)
})

app.listen(PORT, () => {
    console.log(`app is running on http://localhost:${PORT}`)
})