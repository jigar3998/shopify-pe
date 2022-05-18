const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: 'string',
    },
    city: {
        type: 'string',
    },
    description: {
        type: 'string',
    },
    price: {
        type: 'string',
    },
    image: {
        type: 'string',
    },
    weather: {
        temp: {
            type: 'string',
        },
        feels_like:{
            type: 'string',
        },
        temp_min:{
            type: 'string',
        },
        temp_max:{
            type: 'string',
        },
        pressure:{
            type: 'string',
        },
        humidity:{
            type: 'string',
        },
    },
    created: {
        type: Date,
        required: true,
        default: Date.now()
    }
    
})

module.exports = mongoose.model("Product",productSchema)