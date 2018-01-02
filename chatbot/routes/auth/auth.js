var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../../passport/local_login')(passport);
require('../../passport/local_signup')(passport);
require('../../passport/twitter')(passport);
require('../../passport/facebook')(passport);
require('../../passport/google')(passport);

//Show the local login page
router.get('/login', function(req, res) {
  res.render('auth/login');
});

//Connection with twitter
router.get('/twitter', passport.authenticate('twitter', {
    scope : ['public_profile', 'email']
}));

router.get('/twitter/callback', passport.authenticate('twitter', {
    successRedirect : '/list',
    failureRedirect : '/auth/login'
}));

//Connection with Facebook
router.get('/facebook', passport.authenticate('facebook', {
    scope : ['public_profile', 'email']
}));

router.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect : '/list',
    failureRedirect : '/auth/login'
}));

//Connection with google
router.get('/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', {
    successRedirect : '/list',
    failureRedirect : '/auth/login'
}));

//Logout
router.get('/logout', function(req, res) {
    req.session.destroy(function () {
        res.clearCookie('connect.sid', {path: '/'});
        res.redirect('/auth/login');
    });
});

//Local login
router.post('/login', passport.authenticate('login', {
    successRedirect : '/list',
    failureRedirect :'/auth/login'
}));

//Show the local signup page
router.get('/signup', function(req, res){
    res.render('auth/signup');
});

//Local signup
router.post('/signup', passport.authenticate('signup', {
    successRedirect : '/list',
    failureRedirect :'/auth/signup'
}));

module.exports = router;
