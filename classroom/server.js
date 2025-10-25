//Just an example

const express = require('express')
const app = express()
const port = 3000
const users = require('./route/users')
const posts = require('./route/post')
const cookieParser = require('cookie-parser')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, "views"))

const sessionOptions = { secret: "mySeceret", resave: true, saveUninitialized: true }


app.use(session(sessionOptions))
app.use(flash())

app.use((req, res, next) => {
    res.locals.messages = req.flash("sucess")
    res.locals.m = req.flash("e")
    next()
})

app.get('/register', (req, res) => {
    let { name="Anyomus" } = req.query
    req.session.name = name
    if(name === "Anyomus") {
        req.flash("e", "User has not successfully Registered!!")
    } else {

        req.flash("sucess", "User has successfully Registered!!")
    }
    res.redirect('/hello')
})

app.get('/hello', (req, res) => {
    // res.send(`Hello, ${req.session.name}`)
    
    res.render('page', { name: req.session.name})
})

// app.get('/reqSes', (req, res) => {
//     if(req.session.count) {
//         req.session.count++
//     } else {
//         req.session.count = 1
//     }

//     res.send(`You sent a req for ${req.session.count} times`)
// })

app.get('/test', (req, res) => {
    res.send('Test sucessful')
})

// app.use(cookieParser('seceretCode'))

// app.get("/signedcookies", (req, res) => {
//     res.cookie('madein', 'Japan', { signed: true });
//     res.send("Signed cookies")
// })

// app.get("/verify", (req, res) => {
//     console.log(req.signedCookies)

// })

// app.get('/', (req, res) => {
//     console.dir(req.cookies)
//     res.send("I am Root")
// })

// app.get('/cookes', (req, res)=> {
//     res.cookie("Brother", "Ayush")
//     res.cookie("Name", "Harsh")
//     res.send("Cookies")
// })

// app.use('/users', users);

// app.use('/post', posts)

// app.use('/post', post)



app.listen(port, () => {
    console.log(`server is running on ${port}`)
})