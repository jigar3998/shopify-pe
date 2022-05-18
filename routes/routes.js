const express = require('express')
require('dotenv').config();
const router = express.Router()
const Product = require('../models/products')
const multer = require("multer")
const fs = require('fs')

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

router.get('/edit/:id',(req, res) => {
    let id = req.params.id
    Product.findById(id,(err,product)=>{
        if(err){
            res.redirect('/')
        } else{
            if(product==null){
                res.redirect('/')
            }else{
                res.render("edit_products",{title: "Edit Product", product:product})
            }
        }
    })
})

router.post('/update/:id', upload, (req, res)=>{
    let id = req.params.id
    let newImg = ""

    if(req.file){
        newImg = req.file.filename
        try{
            fs.unlinkSync("./uploads/"+ req.body.old_image)
        } catch(e){
            console.error
        }
    }else{
        newImg = req.body.old_image
    }

    Product.findByIdAndUpdate(id,{
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        city: req.body.city,
        image: newImg
    },(err,result)=>{
        if(err){
            res.json({message:err.message, type:'danger'})
        }else {
            req.session.message = {
                type: 'success',
                message: 'Product updated successfully'
            }
            res.redirect('/')
        }
    })
})

router.get('/delete/:id',(req, res)=>{
    let id = req.params.id
    Product.findByIdAndRemove(id,(err, result)=>{
        if(result.image!=""){
            try{
                fs.unlinkSync('/uploads/'+result.image)
            }catch(err){
                console.log(err)
            }
        }

        if(err){
            res.json({message:err.message, type:'danger'})
        }else {
            req.session.message = {
                type: 'info',
                message: 'Product deleted successfully'
            }
            res.redirect('/')
        }
    })
})

module.exports = router

