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

})

// FIX THIS
router.get('/checkout/:id', (req, res) => {
    //const cart = req.session.cart;
    const cart = new Cart(req.session.cart ? req.session.cart : {});

    console.log(cart.length);
    console.log(JSON.stringify(cart));
    console.log('ok');

    // for (let i in cart) {
    //     console.log(cart[]);
    // }

    cart = null;
    //req.session.cart = null;
    
    // res.render('User/confirmPurchase', {
    //     title: `Purchase`,
    //     logo: `../img/everythingstore.jpg`
    // });
    res.redirect('/products'); // redirect to email sent page
});

router.get('/checkout_/:id', (req, res) => {

    //const userId = req.params.id;
    //const cart = req.session.cart;
    const cart = new Cart(req.session.cart ? req.session.cart : {});
    
    
    // for (product in cart.products) {
        //     console.log(product.products);
        // }
        
    userModel.findById(req.params.id)
    .then((user) => {
        console.log(`${user.firstName} ${user.lastName} ${user.email}`)
        
        const order = new Order({
            user: user._id,
            cart: cart,
            name: `${user.firstName} ${user.lastName}`
        })
        order.save((err, result) => {

            console.log('saved order');
            req.session.cart = null;
            res.redirect('/products');
        })
        
        // using Twilio SendGrid's v3 Node.js Library
        // https://github.com/sendgrid/sendgrid-nodejs
                // const sgMail = require('@sendgrid/mail');
                // sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
                // const msg = {
                //     to: `${user.email}`,
                //     from: `noreply@everythingstore.com`,
                //     subject: 'Everything Store Purchase Confirmation',
                //     html:
                //         `<h3>Thank you ${user.firstName} ${user.lastName} for signing up with the Everything Store.<h3> <br> 
                //                             `,

                    
                        
                // };
            
                // // Sends email
                // sgMail.send(msg)
                //     .then(() => {
                //         // REDIRECT TO CONFIRMATION PAGE OF PURCHASE EMAIL
                //         //CONTINUE


            
                //         console.log(`Email has been sent`)
                //     })
                //     .catch(err => { console.log(`${err}`) });

        })
        .catch(err=>console.log(err));


    // clear the cart
    // for (product in cart.products) {
    //     //console.log(product);
    //     cart.removeProduct(product);
    // }

    //console.log(cart.products);

    // send email of checkout
    res.redirect('/products');


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