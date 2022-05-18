const express = require('express')
const router = express.Router()

router.get('/',(req, res) => {
    res.render("index", {title: "Home Page"})
})

router.get('/add',(req, res) => {
    res.render("add_products", {title: "Add Products"})
})


module.exports = router

