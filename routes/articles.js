const express = require('express');
const router = express.Router();
let Article = require('../models/article');
let User = require('../models/user');

// Add route
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('add_article', {title: 'Add Articles'});
});

// Add Submit POST route
router.post('/add', (req, res) => {
    req.checkBody('title', 'Title is required').notEmpty();
    // req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();

    // Retrieve validation errors if there is any
    req.getValidationResult().then((result) => {
        if (!result.isEmpty()) {
            let errors = result.array();
            res.render('add_article', {
                title: 'Add Article',
                errors: errors
            });
        } else {
            let article = new Article();
            article.title = req.body.title;
            article.author = req.user._id;
            article.body = req.body.body;
            article.save((err) => {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    req.flash('success', 'New article added');
                    res.redirect('/');
                }
            });
        }
    });
});

// Get edit article
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        if (article.author != req.user._id) {
            req.flash('danger', 'Not authorized');
            res.redirect('/');
        }

        if (err)
            console.log(err);
        else {
            res.render('edit_article', {
                title: 'Edit article',
                article: article
            });
        }
    });
});

// Update Submit POST route
router.post('/edit/:id', (req, res) => {
    let article = {};
    article.title = req.body.title;
    article.body = req.body.body;

    let query = {
        _id: req.params.id
    }

    Article.update(query, article, (err) => {
        if (err) {
            console.log(err);
        } else {
            req.flash('info', 'Article updated');
            res.redirect('/');
        }
    });
});

router.delete('/:id', (req, res) => {
    if (!req.user._id) {
        res.status(500).send();
    }

    let query = {
        _id: req.params.id
    }

    Article.findById(req.params.id, (err, article) => {
        if (article.author !== req.user._id) {
            res.status(500).send();
        } else {
            Article.remove(query, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    req.flash('danger', 'Article deleted');
                    res.send('Success');
                }
            });
        }
    });
});

// Get single article
router.get('/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        User.findById(article.author, (err, user) => {
            if (err) {
                console.log(err);
            } else {
                res.render('article', {
                    article: article,
                    author: user.name
                });
            }
        })
    });
});

// Access Control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'You are not logged in');
        res.redirect('/users/login');
    }
}

module.exports = router;
