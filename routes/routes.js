const express = require('express')
require('dotenv').config();
const router = express.Router()
const Product = require('../models/products')
const multer = require("multer")
const axios = require('axios');
const fs = require('fs')

//Storing the uploaded image to Disk
var storage = multer.diskStorage({
    destination: function(req, file,callback){
        callback(null,"./uploads")
    },
    filename: function(req,file,callback){
        let fname=(file.fieldname+"_"+Date.now()+file.originalname)
        callback(null, fname.trim())
    }
})

var upload= multer({
    storage: storage,
}).single("image")

//Route to upload and send data to MongoDB
router.post('/add', upload, async (req, res)=>{
    try{
        let weather
        const response = await axios.post("https://api.openweathermap.org/data/2.5/weather?q="+req.body.city+"&appid="+process.env.weatherApiKey+"&units=metric")
        .then(response => {
            weather=response?.data?.main
        })
        .catch(err => {
            console.log(err)
        })
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            city: req.body.city,
            weather: weather,
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
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

//Home Page Route
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

//Add products Route
router.get('/add',(req, res) => {
    res.render("add_products", {title: "Add Products"})
})

//Open Edit Page Route
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


//Update Product Route
router.post('/update/:id', upload, (req, res)=>{
    let id = req.params.id
    let newImg = ''
    if(req.file){
        newImg = req.file.filename
        try{
            let givenpath="./uploads/"+req.body.old_image.trim()
            console.log(givenpath)
            fs.unlinkSync(givenpath);
        } catch(e){
            console.log(e)
        }
    }else{
        newImg = req.body.old_image
    }

    Product.findByIdAndUpdate(id,{
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
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
//Delete Product Route
router.get("/delete/:id",(req, res)=>{
    let id = req.params.id
    Product.findByIdAndRemove(id,(err, result)=>{
        if(result.image!=""){
            try{
                let givenpath="./uploads/"+result.image.trim()
                fs.unlinkSync(givenpath)
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

