const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

let User = require('../models/user');

// Register form
router.get('/register', (req, res) => {
    res.render('register');
});

// Register POST route
router.post('/register', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is invalid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Password do not match').equals(req.body.password);

    // Retrieve validation errors if there is any
    req.getValidationResult().then((result) => {
        if (!result.isEmpty()) {
            let errors = result.array();
            res.render('register', {errors: errors});
        } else {
            let newUser = new User({name: name, email: email, username: username, password: password});
            // Generate a salt that concatenate with the hash
            bcrypt.genSalt(10, (err, salt) => {
                // Hash the password typed
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) {
                        console.log(err);
                    } else {
                        newUser.password = hash;
                        newUser.save((err) => {
                            if (err) {
                                console.log(err);
                            } else {
                                req.flash('success', 'You are now registered and can now log in');
                                res.redirect('/users/login');
                            }
                        });
                    }
                });
            });
        }
    });
});

// Login form
router.get('/login', (req, res) => {
    res.render('login');
});

// Login POST route
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: 'login',
        failureFlash: true
    })(req, res, next);
});

// Logout route
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;
