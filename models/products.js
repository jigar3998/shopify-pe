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
    created: {
        type: Date,
        required: true,
        default: Date.now()
    }
    
})

module.exports = mongoose.model("Product",productSchema)