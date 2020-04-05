// Sign up Controller
const express = require('express');
const router = express.Router();

// User Model
const userModel = require('../models/User');




// Sign Up Routes
router.get('/', (req, res) => {
    res.render('signup', {
        title: 'Sign Up',
        logo: "img/everythingStore.jpg"
    });
});

// Sign up post method
router.post('/', (req, res) => {
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
            logo: "img/everythingStore.jpg",
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
            email: email, // TO DO : add error message if email is not unique
            password: password
        }

        const signup = new userModel(newUser);
        signup.save() // Insert document into collection
            .then(() => {


                // vvvvv CONTINUE THIS AFTER YOU MAKE THE LOGIN
                // validate unique email
                //redirect to a dashboard page or create a session??

                res.render('confirmDashboard', {
                    title: 'Sign Up',
                    logo: "img/everythingStore.jpg",
                    name: `${firstName}`,
                    email: `${email}`
                });

                //////////////////////////////////////////


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
                    `,
                };
                // Sends email
                sgMail.send(msg)
                    .then(() => { console.log(`Email has been sent`) })
                    .catch(err => { console.log(`${err}`) });



                console.log(`inserted into database`);

            })
            .catch(err => console.log(`DB Error has occured ${err}`));

    }

});

module.exports = router;