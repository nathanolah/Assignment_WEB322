const express = require('express');
const router = express.Router();

// Home models
const productsCategory = require('../model/productsCategory');
const bestSeller = require('../model/bestSeller');

// Home Page 
router.get('/', (req, res) => {
    res.render('home', {
        title: 'Home',
        logo: "img/everythingStore.jpg",
        productsCategory: productsCategory.getAllProducts(),
        bestSeller: bestSeller.getAllProducts()
    });
});

// Sign Up Page
router.get('/signup', (req, res) => {
    res.render('signup', { 
        title: 'Sign Up',
        logo: "img/everythingStore.jpg"
    });
});

router.post('/signup', (req, res) => {
    const errorMessage = [];
    const { firstName, lastName, email, username, password } = req.body;

    // Checks for errors
    if (firstName == "" || lastName == "") {
        errorMessage.push('You must enter your full name');
    }
    if (email == "") {
        errorMessage.push('You must enter an email');
    }
    if (username == "") {
        errorMessage.push('You must enter a username');
    }
    if (password == "") {
        errorMessage.push('You must enter a password');
    }
    if (password.length < 6 || password.length > 12) {
        errorMessage.push('Password must 6 to 12 characters long');
    }
    if (!password.match(/^(?=.*\d)(?=.*[a-z]).{6,12}$/)) { 
        errorMessage.push('Password must contain letters and numbers');
    }

    if (errorMessage.length > 0) {
        res.render('signup', {
            title: 'Sign Up',
            logo: "img/everythingStore.jpg",
            errors: errorMessage,
            firstName: firstName,
            lastName: lastName,
            email: email,
            username: username,
            password: password

        });
    }
    else { 
        // using Twilio SendGrid's v3 Node.js Library
        // https://github.com/sendgrid/sendgrid-nodejs
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
        const msg = {
        to: `${ email }`,
        from: `noreply@everythingstore.com`,
        subject: 'Everything Store Confirmation',
        html: // TO DO : add more to email
        `Thank you ${ firstName } ${ lastName } for signed up with the Everything Store. <br> 
         Vistor's Email Address ${ email } <br>
        `,
        };
        sgMail.send(msg)
        .then(()=> {
            res.render('dashboard', { 
                title: 'Sign Up',
                logo: "img/everythingStore.jpg",
                name: `${ firstName }`,
                email: `${ email }`
            });

        })
        .catch(err=>{
            console.log(`${err}`);
        });
        
    }
    
});

// Login Page
router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login',
        logo: "img/everythingStore.jpg"
    });
});

router.post('/login', (req, res) => {
    const errorMessage = [];
    const { username, password } = req.body;

    // Checks for errors
    if (username == "") {
        errorMessage.push('You must enter a username');
    }
    if (password == "") {
        errorMessage.push('You must enter a password');
    }

    if (errorMessage.length > 0) {
        res.render('login', {
            title: 'Login',
            logo: "img/everythingStore.jpg",
            errors: errorMessage
        });
    }
    else {
        res.render('login', {
            title: 'Login',
            logo: "img/everythingStore.jpg",
            successMessage: `Thank you for logging in ${ username }.`
        });
    }
});

module.exports = router;