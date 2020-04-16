/******** PRODUCTS MODEL ********/

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({

    productName: {
        type: String,
        required: true
    },

    productPrice: {
        type: String,
        required: true
    },

    productDesc: {
        type: String
    },

    productPic: {
        type: String
    },

    productCategory: {
        type: String,
    },

    productQuantity: {
        type: String,
    },

    bestSeller: {
        type: Boolean,
        default: false
    },

    dateCreated: {
        type: Date,
        default: Date.now()
    }


});

// Create model object
// Responsible for CRUD commands on given collection
const productModel = mongoose.model('Product', productSchema);

// Export model object
module.exports = productModel;

