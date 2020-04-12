const express = require('express');
const path = require('path');

const router = express.Router();

// Products model
const productsModel = require('../models/products');

// Products Route
router.get('/', (req, res) => {
    // Inserts all products into the collection
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

            res.render('Products/products', {
                title: 'Products',
                logo: "img/everythingStore.jpg",
                products: filteredProduct
            });

        })

});

// Product Description Route
router.get('/productdesc/:id', (req, res) => {

    productsModel.findById(req.params.id)
        .then((product) => {

            const { _id, productPic, productName, productCategory, productDesc, productPrice, productQuantity, bestSeller } = product;

            res.render('Products/productDescPage', {
                title: `${productName} Description`,
                logo: "../../img/everythingStore.jpg",
                _id,
                productName,
                productCategory,
                productDesc,
                productPrice,
                productQuantity,
                bestSeller,
                productPic

            });

        })
        .catch(err => console.log(`Error ${err}`));

});

// Search route
router.post('/search', (req, res) => {

    if (req.body.searchProductCategory == 'All Categories') {
        res.redirect('/products');

    }
    else {

        productsModel.find({ productCategory: req.body.searchProductCategory })
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

                res.render('Products/products', {
                    title: 'Products',
                    logo: "../img/everythingStore.jpg",
                    products: filteredProduct

                })

            })
            .catch(err => console.log(`${err}`));
    }
})

// Add products
router.get('/add', (req, res) => {
    res.render('Products/productAddForm', {
        title: 'Add Product',
        logo: "../img/everythingStore.jpg"
    });

});

//
router.post('/add', (req, res) => {
    // Inserts into database

    // Create product object
    const newProduct = {

        productName: req.body.productName,
        productPrice: req.body.productPrice,
        productDesc: req.body.productDesc,
        productCategory: req.body.productCategory,
        productQuantity: req.body.productQuantity,
        bestSeller: req.body.bestSeller

    }

    const product = new productsModel(newProduct);
    product.save()
        .then((product) => {

            // TO DO : 
            // ensure only certain photos can be uploaded 


            req.files.productPic.name = `prod_pic_${product._id}${path.parse(req.files.productPic.name).ext}`;

            req.files.productPic.mv(`public/uploads/${req.files.productPic.name}`)
                .then(() => {
                    productsModel.updateOne({ _id: product._id }, {
                        productPic: req.files.productPic.name
                    })
                        .then(() => {
                            res.redirect('/products');
                        })
                        .catch(err => console.log(`${err}`));


                })
                .catch(err => console.log(`${err}`));

            console.log(`Product inserted into database`);
        })
        .catch(err => console.log(`${err}`));


});

// Update Products route
router.get('/edit/:id', (req, res) => {

    productsModel.findById(req.params.id)
        .then((product) => {
            const { _id, productName, productCategory, productDesc, productPrice, productQuantity, bestSeller } = product;

            res.render('Products/productEditForm', {
                title: `Edit Product`,
                logo: "../../img/everythingStore.jpg",
                _id,
                productName,
                productCategory,
                productDesc,
                productPrice,
                productQuantity,
                bestSeller

            })

        })
        .catch(err => console.log(`Error ${err}`));
})

// Update product document
router.put('/update/:id', (req, res) => {

    //  TO DO : ensure only certain photos can be uploaded 

    const product = {
        // _id: req.params.id,
        productName: req.body.productName,
        productPrice: req.body.productPrice,
        productDesc: req.body.productDesc,
        productCategory: req.body.productCategory,
        productQuantity: req.body.productQuantity,
        bestSeller: req.body.bestSeller,
        //productPic: req.body.productPic
    }

    // productsModel.updateOne({ _id: product._id }, product)
    //     .then(() => {
    //         res.redirect('/products');

    //     })
    //     .catch(err => console.log(`${err}`));

    /////////////////////////////////////////////////////////// FIX REUPLOAD PHOTO 

    req.files.productPic.name = `prod_pic_${product._id}${path.parse(req.files.productPic.name).ext}`;

    req.files.productPic.mv(`public/uploads/${req.files.productPic.name}`)
        .then(() => {

            productsModel.updateOne({ _id: product._id }, product, {
                productPic: req.files.productPic.name

            })
                .then(() => {
                    res.redirect('/products');

                })
                .catch(err => console.log(`${err}`));

        })
        .catch(err => console.log(`${err}`));

});

// Delete product
router.delete('/delete/:id', (req, res) => {
    productsModel.deleteOne({ _id: req.params.id })
        .then(() => {
            res.redirect('/products');
        })
        .catch(err => console.log(`Error happened when updating data from the database :${err}`));

})


module.exports = router;