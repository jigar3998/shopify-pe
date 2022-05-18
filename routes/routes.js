const express = require('express')
require('dotenv').config();
const router = express.Router()
const Product = require('../models/products')
const multer = require("multer")

let city;

var storage = multer.diskStorage({
    destination: function(req, file,callback){
        callback(null,"./uploads")
    },
    filename: function(req,file,callback){
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname)
    }
})

var upload= multer({
    storage: storage,
}).single("image")

// const getData = fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.weatherApiKey}`)
//   .then(response => response.json)
//   .then(jsonObject => console.log(jsonObject))

router.post('/add', upload, (req, res)=>{
    var city = req.body.city
    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        city: city,
        image: req.file.filename
    })
    product.save((err)=>{
        if(err){
            res.json({message: err.message, type: 'danger'});
        } else{
            req.session.message = {
                type: 'success',
                message:"Product added successfully"
            }
            res.redirect('/')
        }
    })
})

router.get('/',(req, res) => {
    Product.find().exec((err, products) => {
        if (err) {
            res.json({message: message.error})
        }else{
            res.render('index',{
                title: "Home Page",
                products: products
            })
        }
    })
})

router.get('/add',(req, res) => {
    res.render("add_products", {title: "Add Products"})
})


module.exports = router

