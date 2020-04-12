const mongoose = require('mongoose');

// const cartSchema = new mongoose.Schema({


// })

const Schema = mongoose.Schema;

const cartSchema = new Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [
        {
            //productId: Number, //?
            productName: String,
            productCategory: String,
            productDesc: String,
            productQuantity: String,
            productPic: String,
            productPrice: String
            // bestseller??
        }
    ],
    active: {
        type: Boolean,
        default: true
    },
    modifiedOn: {
        type: Date,
        default: Date.now()
    }

})

const cartModel = mongoose.model('Cart', cartSchema);

module.exports = cartModel;