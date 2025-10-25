const express = require('express')
const route = express.Router()

//Index Route 
route.get("/", (req, res) => {
    res.send("Get for User")
})
route.get("/:id", (req, res) => {
    res.send("Get for User Id")
})
route.post("/", (req, res) => {
    res.send("post for User")
})
route.delete("/:id", (req, res) => {
    res.send("Get for User")
})

module.exports = route