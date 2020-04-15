const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    cart: {
        type: Object,
        required: true
    },
    name: {
        type: String,
        require: true
    }

});

// Create model object
// Responsible for CRUD commands on given collection
const orderModel = mongoose.model('Order', orderSchema);

// Export model object
module.exports = orderModel;