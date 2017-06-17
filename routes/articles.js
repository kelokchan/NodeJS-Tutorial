const express = require('express');
const router = express.Router();
const Article = require('../models/article');

// Add route
router.get('/add', (req, res) => {
    res.render('add_article', {
        title: 'Add Articles'
    });
});

// Add Submit POST route
router.post('/add', (req, res) => {
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();

    req.getValidationResult().then((result) => {
        console.log(result);
        if (!result.isEmpty()) {
            let errors = result.array();
            res.render('add_article', {
                title: 'Add Article',
                errors:errors
            });
        } else {
            let article = new Article();
            article.title = req.body.title;
            article.author = req.body.author;
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
router.get('/edit/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
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


// Update Submit PUT route
router.post('/edit/:id', (req, res) => {
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
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
    let query = {
        _id: req.params.id
    }
    Article.remove(query, (err) => {
        if (err) {
            console.log(err);
        } else {
            req.flash('danger', 'Article deleted');
            res.send('Success');
        }
    })
});

// Get single article
router.get('/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        if (err)
        console.log(err);
        else {
            res.render('article', {
                article: article
            });
        }
    });
});

module.exports = router;
