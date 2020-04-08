const express = require('express');
const path = require('path');

const router = express.Router();

// Products model
const productsModel = require('../models/products');

// GET PRODUCTS ROUTE TO DISPLAY ALL THE PRODUCTS IN THE DB

// Products Route
router.get('/', (req, res) => {
    // INSERTS ALL OF THE PRODUCTS IN THE COLLECTION
    productsModel.find()
        .then((products) => {

            const filteredProduct = products.map(product => {

                // insert image
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

// Search route
//router.get()

// MAKE THE PRODUCTS CRUD OPTIONS PROTECTED ROUTES

// Add products
router.get('/add', (req, res) => {
    res.render('Products/productAddForm', {
        title: 'Add Product',
        logo: "img/everythingStore.jpg"
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

    // check if fields have NOT been filled then do not change

    // ensure only certain photos can be uploaded 

    const product = {
        // _id: req.params.id,
        productName: req.body.productName,
        productPrice: req.body.productPrice,
        productDesc: req.body.productDesc,
        productCategory: req.body.productCategory,
        productQuantity: req.body.productQuantity,
        bestSeller: req.body.bestSeller
    }

   
    req.files.productPic.name = `prod_pic_${product._id}${path.parse(req.files.productPic.name).ext}`;

    console.log(req.files.productPic.name);

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




    // productsModel.updateOne({ _id: req.params.id }, product, {
    //     productPic: req.files.productPic.name})
    //     .then(() => {


    //         res.redirect('/products');
    //     })
    //     .catch(err => console.log(`Error happened when updating data from the database :${err}`));


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