// Nathan Olah
// #124723198
// Assignment 2
// Entry point file index.js

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

// Load the environment file
require('dotenv').config({path:"./config/keys.env"});

const app = express();

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

// Environment variable
const PORT = process.env.PORT; 
app.listen(PORT, () => {
    console.log(`Listening on port ${ PORT }`);
});