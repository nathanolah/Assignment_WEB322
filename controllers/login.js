// Login Controller
const express = require('express');
const router = express.Router();

// User Model
const userModel = require('../models/User');

const bcrypt = require('bcryptjs');





// Login Routes
router.get('/', (req, res) => {
    res.render('login', {
        title: 'Login',
        logo: "img/everythingStore.jpg"
    });
});


router.post('/', (req, res) => {
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
            logo: "img/everythingStore.jpg",
            errors: errorMessage
        });
    }
    else {

        /*
       Here is whre we have to determine if the email and the password exists.
       If it does, create session, assign the user object(document) to session
       then redirect user
        */

        userModel.findOne({ email: req.body.email })
            .then((user) => {

                // if no matching email
                if (user == null) {
                    errorMessage.push(`Sorry your email does not exist`);

                    res.render('login', {
                        title: 'Login',
                        logo: "img/everythingStore.jpg",
                        errors: errorMessage
                    })

                }
                // Email found
                else {
                    bcrypt.compare(req.body.password, user.password)
                        .then((isMatched) => {

                            if (isMatched == true) {

                                // FIX THIS SESSION DOESNT WORK

                                req.session.user = user;

                                //res.render("userDashboard");


                                res.redirect('/user/profile'); // fix this with user controller


                            } 
                            else {
                                errorMessage.push('Incorrect password');

                                res.render('login', {
                                    title: 'Login',
                                    logo: "img/everythingStore.jpg",
                                    errors: errorMessage
                                })
                            }

                        })
                        .catch(err => console.log(`Error ${err}`));

                }

            })
            .catch((err) => console.log(`Error ${err}`));

    }
});


///

// I want the session to go into here and know the user data
router.get("/profile/",(req,res)=>{

    res.render("userDashboard");
    
});


// CREATE THIS LOGOUT BUTTON TO END THE SESSION
router.get("/logout",(req,res)=>{

    req.session.destroy();
    res.redirect("/login");

});

module.exports = router;