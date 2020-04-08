// User Model

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

// Indicates the shape of the documents that will be entering the database
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    inventoryClerk: {
        type: Boolean, 
        default: false // Assigned by Database admin
        
    },

    // profilePic: {
    //     type: String
    // },

    dateCreated: {
        type: Date,
        default: Date.now()
    }

});

// Encrypt user password
userSchema.pre('save', function (next) {
    
    //salt random generated characters or strings
    bcrypt.genSalt(10)
        .then((salt) => {

            bcrypt.hash(this.password, salt)
                .then((encryptPassword) => {
                    this.password = encryptPassword;
                    next();

                })
                .catch(err => console.log(`Error occured when hashing ${err}`));
        })
        .catch(err => console.log(`Error occured when salting ${err}`));

});


// Create model object
// Responsible for CRUD commands on given collection
const userModel = mongoose.model('User', userSchema);

// Export model object
module.exports = userModel;