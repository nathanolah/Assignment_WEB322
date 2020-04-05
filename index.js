// Nathan Olah
// #124723198
// Assignment 3-5
// Entry point file index.js

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const session = require('express-session')

// Load the environment file
require('dotenv').config({ path: "./config/keys.env" });

const generalController = require('./controllers/general');
const productsController = require('./controllers/products');

//const signupController = require('./controllers/signup');
//const loginController = require('./controllers/login');

const userController = require('./controllers/user');

const app = express();

// Handlebars engine
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.static('public'));

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));


////////////////////////////////////
app.use(fileUpload());

app.use(session({ secret: `${process.env.SESSION_SECRET}`, resave: false, saveUninitialized: true }));  // WHAT IS THIS 

//custom middleware functions
app.use((req, res, next) => {

    //res.locals.user is a global handlebars variable. This means that ever single handlebars file can access 
    //that user variable
    res.locals.user = req.session.user;
    next();
});

//////////////////////////////////////

app.use('/', generalController);
app.use('/products', productsController);
//app.use('/signup', signupController);
//app.use('/login', loginController);
app.use('/user', userController);

// Promise operation asynchronous 
mongoose.connect(process.env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(`Connected to mongoDB`); // If promise is fulfilled
    })
    .catch(err => console.log(`Error ${err}`)); // If the promise is rejected


// Environment variable
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});