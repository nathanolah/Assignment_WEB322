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

// Add prodcuts post method
router.post('/add', (req, res) => {
    const errorMessage = [];
    const { productName, productCategory, productDesc, productPrice, productQuantity, bestSeller } = req.body;
    if (productName == "") {
        errorMessage.push('Product name must be filled');
    }
    if (productPrice == "") {
        errorMessage.push('Product price must be filled');
    }
    if (errorMessage.length > 0) {
        res.render('Products/productAddForm', {
            title: `Add Product`,
            logo: "../../img/everythingStore.jpg",
            errors: errorMessage,
            productName,
            productCategory,
            productDesc,
            productPrice,
            productQuantity,
            bestSeller
    
        });

    } 
    else {
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
    
        req.files.productPic.name = `prod_pic_${newProduct._id}${path.parse(req.files.productPic.name).ext}`;
        let str = req.files.productPic.name;
    
        // Check file extension
        const patt = /\.[0-9a-z]+$/i;
        let fileType = str.match(patt);
    
        if (fileType == '.jpg' || fileType == '.png' || fileType == '.gif') {
    
            const product = new productsModel(newProduct);
            product.save()
                .then((product) => {
        
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
    
        }
        else {
            errorMessage.push('Invalid file extension, must be .jpg, .gif, or .png');
    
            //const errorMessage = 'Invalid file extension, must be .jpg, .gif, or .png';
            const { _id, productName, productCategory, productDesc, productPrice, productQuantity, bestSeller } = newProduct;
        
            res.render('Products/productAddForm', {
                title: `Add Product`,
                logo: "../../img/everythingStore.jpg",
                errors: errorMessage,
                _id,
                productName,
                productCategory,
                productDesc,
                productPrice,
                productQuantity,
                bestSeller
        
            });
    
        }


    }
    

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

    const product = {
        _id: req.params.id,
        productName: req.body.productName,
        productPrice: req.body.productPrice,
        productDesc: req.body.productDesc,
        productCategory: req.body.productCategory,
        productQuantity: req.body.productQuantity,
        bestSeller: req.body.bestSeller,
    }

    req.files.productPic.name = `prod_pic_${product._id}${path.parse(req.files.productPic.name).ext}`;
    let str = req.files.productPic.name;

    // Check file extension
    const patt = /\.[0-9a-z]+$/i;
    let fileType = str.match(patt);

    if (fileType == '.jpg' || fileType == '.png' || fileType == '.gif') {
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
    }
    else {
        const errorMessage = 'Invalid file extension, must be .jpg, .gif, or .png';
        const { _id, productName, productCategory, productDesc, productPrice, productQuantity, bestSeller } = product;

        res.render('Products/productEditForm', {
            title: `Edit Product`,
            logo: "../../img/everythingStore.jpg",
            errors: errorMessage,
            _id,
            productName,
            productCategory,
            productDesc,
            productPrice,
            productQuantity,
            bestSeller,
        });

    }

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