/* USER ROUTES */

const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/auth');

// User Model
const userModel = require('../models/User');

const bcrypt = require('bcryptjs');

// Sign Up Routes
router.get('/signup', (req, res) => {
    res.render('signup', {
        title: 'Sign Up',
        logo: "../img/everythingStore.jpg"
    });
});

// Sign up post method
router.post('/signup', (req, res) => {
    const errorMessage = [];
    const { firstName, lastName, email, username, password, cpassword } = req.body;

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
    if (password == "" || cpassword == "") {
        errorMessage.push('You must enter a password');
    }
    if (password.length < 6 || password.length > 12 && cpassword.length < 6 || cpassword.length > 12) {
        errorMessage.push('Password must 6 to 12 characters long');
    }
    if (!password.match(/^(?=.*\d)(?=.*[a-z]).{6,12}$/) && !cpassword.match(/^(?=.*\d)(?=.*[a-z]).{6,12}$/)) {
        errorMessage.push('Password must contain letters and numbers');
    }
    if (password != cpassword)
        errorMessage.push('Passwords do not match');

    if (errorMessage.length > 0) {
        res.render('signup', {
            title: 'Sign Up',
            logo: "../img/everythingStore.jpg",
            // Keeps values in the form
            errors: errorMessage,
            firstName: firstName,
            lastName: lastName,
            email: email,
            username: username,
            password: password,
            cpassword: cpassword
        });

    }
    else {

        // Checks for an existing email
        userModel.findOne({ email: req.body.email })
            .then(user => {
                if (user != null) {
                    errorMessage.push('Email already exists');
                    res.render('signup', {
                        title: 'Sign Up',
                        logo: "../img/everythingStore.jpg",
                        // Keeps values in the form
                        errors: errorMessage,
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        username: username,
                        password: password,
                        cpassword: cpassword
                    });

                }
                else {
                    /* Inserts into Database */

                    // Create new user object
                    const newUser = {
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        password: password
                    }

                    const signup = new userModel(newUser);
                    signup.save() // Insert document into collection
                        .then((user) => {

                            // Create session
                            req.session.user = user;
                            res.redirect(`/user/confirm/${user._id}`);

                            /**** Confirmation Email ****/
                            // using Twilio SendGrid's v3 Node.js Library
                            // https://github.com/sendgrid/sendgrid-nodejs
                            const sgMail = require('@sendgrid/mail');
                            sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
                            const msg = {
                                to: `${email}`,
                                from: `noreply@everythingstore.com`,
                                subject: 'Everything Store Confirmation',
                                html:
                                    `<h3>Thank you ${firstName} ${lastName} for signing up with the Everything Store.<h3> <br>
                                    <a href="https://everythingstoreweb322.herokuapp.com/user/profile/${user._id}">${firstName}'s Profile</a> 
                                `,
                            };
                            // Sends email
                            sgMail.send(msg)
                                .then(() => {
                                    console.log(`Email has been sent`)
                                })
                                .catch(err => { console.log(`${err}`) });


                            console.log(`inserted into database`);

                        })
                        .catch(err => console.log(`DB Error has occured ${err}`));

                }


            })
            .then(err => console.log(`${err}`));

    }

});

// Login Routes
router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login',
        logo: "../img/everythingStore.jpg"
    });
});

// Login post method
router.post('/login', (req, res) => {
    const errorMessage = [];
    const { password, email } = req.body;

    // Checks for empty fields
    if (email == "") {
        errorMessage.push('You must enter an email');
    }
    if (password == "") {
        errorMessage.push('You must enter a password');
    }

    if (errorMessage.length > 0) {
        res.render('login', {
            title: 'Login',
            logo: "../img/everythingStore.jpg",
            errors: errorMessage
        });
    }
    else {
        
        userModel.findOne({ email: req.body.email })
            .then((user) => {

                // If no matching email found
                if (user == null) {
                    errorMessage.push(`Sorry, your email does not exist`);

                    res.render('login', {
                        title: 'Login',
                        logo: "../img/everythingStore.jpg",
                        errors: errorMessage
                    })

                }
                // Email found
                else {
                    // Compare password with encrypted password
                    bcrypt.compare(req.body.password, user.password)
                        .then((isMatched) => {

                            if (isMatched == true) {
                                // Create the session
                                req.session.user = user;
                                res.redirect(`/user/profile/${user._id}`);

                            }
                            else {
                                errorMessage.push('Sorry, your email and/or password is incorrect');
                                res.render('login', {
                                    title: 'Login',
                                    logo: "../img/everythingStore.jpg",
                                    errors: errorMessage
                                });
                            }

                        })
                        .catch(err => console.log(`Error ${err}`));

                }

            })
            .catch((err) => console.log(`Error ${err}`));

    }
});

// Confirmation Route
router.get("/confirm/:id", isLoggedIn, (req, res) => {

    res.render("confirmDashboard", {
        title: 'Sign Up',
        logo: "../../img/everythingStore.jpg"

    });
})

// Profile Route 
router.get("/profile/:id", isLoggedIn, (req, res) => {

    userModel.findById(req.params.id)
        .then((user) => {
            if (user.inventoryClerk == true) {
                // Inventory Clerk Dashboard
                res.render("clerkDashboard", {
                    title: 'Profile',
                    logo: "../../img/everythingStore.jpg"
                })
            }
            else {
                // User Dashboard
                res.render("userDashboard", {
                    title: `Profile`,
                    logo: "../../img/everythingStore.jpg"
                });
            }

        })
        .catch(err => console.log(`Error ${err}`));

});

// End session
router.get("/logout", (req, res) => {

    req.session.destroy();
    res.redirect("/user/login");

});


module.exports = router;