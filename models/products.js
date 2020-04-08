// const products = {
//     fakeDB:[],

//   // Gets all the images for products
//     init() { 
//         this.fakeDB.push({image:'/img/productsCategory/electronics.jpg', category:'Electronics & Accessories', title: "Headphones", price:'123.00', bestSeller: true});
//         this.fakeDB.push({image:'/img/productsCategory/livingroom.jpg', category:'Furniture', price:'60.00', title:'Living room set', bestSeller: true});
//         this.fakeDB.push({image:'/img/productsCategory/tools.jpg', category:'Tools', price:'$80.00', title:'Tool sets', price:'60.00', bestSeller: true});
//         this.fakeDB.push({image:'/img/productsCategory/household.jpg', category:'Household Supplies', title:'Notepad', price:'10.00', bestSeller: false});
//         this.fakeDB.push({image:'/img/productsCategory/electronics.jpg', category:'Electronics & Accessories', title: "Music player", price:'123.00', bestSeller: false});
//         this.fakeDB.push({image:'/img/productsCategory/electronics.jpg', category:'Electronics & Accessories', title: "", price:'123.00', bestSeller: false});
//         this.fakeDB.push({image:'/img/products/office.jpg', category:'Office supplies', title: "Pens and pencils", price:'20.00', bestSeller: false});
//         this.fakeDB.push({image:'/img/products/laptop.jpg', category:'Computers', title: "Laptop", price:'300.00', bestSeller: true});
//         this.fakeDB.push({image:'/img/products/camera.jpg', category:'Electronics & Accessories', title: 'Camera Lens', price:'123.00', bestSeller: true});
//     },

//     // Returns the data
//     getAllProducts() {
//         return this.fakeDB;
//     }
// }

// // Initiate Populate fakeDB
// products.init();
// module.exports = products;


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
    }


});

// Create model object
// Responsible for CRUD commands on given collection
const productModel = mongoose.model('Product', productSchema);

// Export model object
module.exports = productModel;

