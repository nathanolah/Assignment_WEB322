const express = require('express');
const router = express.Router();

// Home models
const productsCategory = require('../models/productsCategory');
const bestSeller = require('../models/bestSeller');

// Home Page 
router.get('/', (req, res) => {
    res.render('home', {
        title: 'Home',
        logo: "img/everythingStore.jpg",
        productsCategory: productsCategory.getAllProducts(),
        bestSeller: bestSeller.getAllProducts()
    });
});

module.exports = router;