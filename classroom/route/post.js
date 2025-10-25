const express = require('express')
const route = express.Router()

//Index Route 
route.get("/", (req, res) => {
    res.send("Get for Post")
})
route.get("/:id", (req, res) => {
    res.send("Get for Post Id")
})
route.post("/", (req, res) => {
    res.send("post for Post")
})
route.delete("/:id", (req, res) => {
    res.send("Get for Post")
})

module.exports = route