const express = require('express');
const router = express.Router();

// Products Model
const productsModel = require('../models/products');

router.get('/', (req, res) => {
    productsModel.find()
        .then((products) => {

            const filteredProduct = products.map(product => {

                return {
                    _id: product._id,
                    productName: product.productName,
                    productPrice: product.productPrice,
                    productDesc: product.productDesc,
                    productCategory: product.productCategory,
                    productQuantity: product.productQuantity,
                    bestSeller: product.bestSeller,
                    productPic: product.productPic

                }

            })

            res.render('home', {
                title: 'Home',
                logo: "img/everythingStore.jpg",
                products: filteredProduct
            });

        })
        .catch(err => console.log(`${err}`));


});


module.exports = router;