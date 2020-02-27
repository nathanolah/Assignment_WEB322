// Nathan Olah
// #124723198
// Assignment 1
// Entry point file index.js

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();

// // Home data
// const productsCategory = require('./model/productsCategory');
// const bestSeller = require('./model/bestSeller');

// // Products data
// const products = require('./model/products');

// Handlebars engine
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.static('public'));

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

const generalController = require('./controllers/general');
const productsController = require('./controllers/products');

app.use('/', generalController);
app.use('/products', productsController);
app.use('/signup', generalController);
app.use('/login', generalController);

// //
// // Home Page 
// app.get('/', (req, res) => {
//     res.render('home', {
//         title: 'Home',
//         logo: "img/everythingStore.jpg",
//         productsCategory: productsCategory.getAllProducts(),
//         bestSeller: bestSeller.getAllProducts()
//     });
// });

// // Products Page 
// app.get('/products', (req, res) => {
//     res.render('products', {
//         title: 'Products',
//         logo: "img/everythingStore.jpg",
//         products: products.getAllProducts()
//     });
// });

// // Sign Up Page
// app.get('/signup', (req, res) => {
//     res.render('signup', { 
//         title: 'Sign Up',
//         logo: "img/everythingStore.jpg"
//     });
// });

// app.post('/signup', (req, res) => {
//     const errorMessage = [];
//     const { firstName, lastName, email, username, password } = req.body;

//     // Checks for errors
//     if (firstName == "" || lastName == "") {
//         errorMessage.push('You must enter your full name');
//     }
//     if (email == "") {
//         errorMessage.push('You must enter your email');
//     }
//     if (username == "") {
//         errorMessage.push('You must enter your username');
//     }
//     if (password == "") {
//         errorMessage.push('You must enter your password');
//     }


//     if (errorMessage.length > 0) {
//         res.render('signup', {
//             title: 'Sign Up',
//             logo: "img/everythingStore.jpg",
//             errors: errorMessage
//         });
//     }
//     else {
//         res.render('signup', {
//             title: 'Sign Up',
//             logo: "img/everythingStore.jpg",
//             successMessage: `Thank you ${ firstName } we've sent you a confirmation to ${ email }`
//         });
//     }
    
// });

// // Login Page
// app.get('/login', (req, res) => {
//     res.render('login', {
//         title: 'Login',
//         logo: "img/everythingStore.jpg"
//     });
// });

// app.post('/login', (req, res) => {
//     const errorMessage = [];
//     const { username, password } = req.body;

//     // Checks for errors
//     if (username == "") {
//         errorMessage.push('You must enter a username');
//     }
//     if (password == "") {
//         errorMessage.push('You must enter a password');
//     }
//     if (password.length > 1 && password.length < 6) {
//         errorMessage.push('Must be at least 6 characters long')
//     }

//     if (errorMessage.length > 0) {
//         res.render('login', {
//             title: 'Login',
//             logo: "img/everythingStore.jpg",
//             errors: errorMessage
//         });
//     }
//     else {
//         res.render('login', {
//             title: 'Login',
//             logo: "img/everythingStore.jpg",
//             successMessage: `Thank you for logging in ${ username }.`
//         });
//     }
// });

// Environment variable
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`Listening on port ${ PORT }`);
});