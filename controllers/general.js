const express = require('express');
const router = express.Router();

// Products Model
const productsModel = require('../models/products');

const userModel = require('../models/User');
const Order = require('../models/Order');

// Cart model
const Cart = require('../models/Cart');

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

// Shopping Cart Routes
router.get('/shoppingCart/:id', (req, res) => {
    if (!req.session.cart) {
        return res.render('User/shoppingCart', {
            title: `Shopping Cart`,
            logo: `../../img/everythingStore.jpg`,
            products: null
        });
    }

    const cart = new Cart(req.session.cart);
    res.render('User/shoppingCart', {
        title: `Shopping Cart`,
        logo: `../../img/everythingStore.jpg`,
        products: cart.generateArray(),
        totalPrice: cart.totalPrice,

    });

});

// Checkout
router.get('/checkout/:id', (req, res) => {
    userModel.findById(req.params.id)
        .then((user) => {

            const cart = new Cart(req.session.cart ? req.session.cart : {});
            var products = cart.generateArray();
            var totalPrice = cart.totalPrice;

            req.session.cart = null;

            // Save order
            const order = new Order({
                user: user._id,
                cart: cart,
                name: `${user.firstName} ${user.lastName}`
            })
            order.save((err, result) => {
                if (err) {
                    console.log(err);
                }

                console.log('saved order');
            })

            let emailBody;
            for (let i in products) {
                if (products[i].products != undefined) {
                    emailBody += `
                    <h1>${products[i].products.productCategory}</h1>
                    <h1>${products[i].products.productName}</h1>
                    <p>${products[i].products.productDesc}</p>
                    <p>Quantity: ${products[i].products.productQuantity}</p>
                    <h1>$${products[i].products.productPrice}</h1>

                    <br>
                    `;
                }
            }

            // using Twilio SendGrid's v3 Node.js Library
            // https://github.com/sendgrid/sendgrid-nodejs
            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
            const msg = {
                to: `${user.email}`,
                from: `noreply@everythingstore.com`,
                subject: 'Everything Store Purchase Confirmation',
                html:
                    `<h3>Thank you ${user.firstName} ${user.lastName} for your purchase.<h3> <br>
                    
                    ${emailBody}
                
                    <h1>Total Price $${totalPrice}</h1>

                    `,

            };
            // Sends email
            sgMail.send(msg)
                .then(() => {
                    res.redirect('/products');
                    console.log(`Email has been sent`)
                })
                .catch(err => { console.log(`${err}`) });

        })
        .catch(err => console.log(err));
});

// Add to cart
router.get('/addToCart/:id', (req, res) => {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {}); // Check if cart exists

    productsModel.findById(productId, (error, product) => {
        if (error)
            console.log(`Error adding to cart: ${error}`);

        cart.add(product, product.id, product.productPrice)
        req.session.cart = cart;
        res.redirect("/products")
    });

});

// Remove product from cart
router.get("/remove/:id", (req, res) => {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.removeProduct(productId);
    req.session.cart = cart;
    res.redirect(`/shoppingcart/${productId}`);

});


module.exports = router;