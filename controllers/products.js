const express = require('express');
const router = express.Router();

// Products model
const products = require('../model/products');

// Products Page 
router.get('/', (req, res) => { 
    res.render('products', {
        title: 'Products',
        logo: "img/everythingStore.jpg",
        products: products.getAllProducts()
    });
});

module.exports = router;