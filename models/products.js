const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: 'string',
        required: true
    },
    city: {
        type: 'string',
        required: true
    },
    description: {
        type: 'string',
        required: true
    },
    image: {
        type: 'string',
        required: true
    },
    created: {
        type: Date,
        required: true,
        default: Date.now()
    }
    
})

module.exports = mongoose.model("Product",productSchema)