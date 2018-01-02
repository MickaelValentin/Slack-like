var express = require('express');
var router = express.Router();
var isAuth = require('../tools/auth-tools').isAuth;
var mongoose = require('mongoose');
var Message = mongoose.model('Message');
var Channel = mongoose.model('Channel');
var User = mongoose.model('User');


//Show the login page (main page)
router.get('/', function(req, res, next) {
    res.render('auth/login');
  });

  //List channel message
router.get('/permalink/:permalink', isAuth, function(req, res, next) {
  Channel.findOne({'permalink': req.params.permalink}, function  (err, channel){
    Message.find({'channel': channel}).sort({'date' : -1}).populate('user').exec(function(err, items)
    {
      req.session.channel = channel;
      res.render('channel/view', { messages: items, user_id: req.user._id });
    });
  });
});

//Show view create channel
router.get('/create', isAuth, function(req, res){
    res.render('channel/create');
});

//Show profile of an user
router.get('/profil/:id', isAuth, function(req, res){
  User.findById({id:req.params.id}, function(err, item) {
    res.render('profil', { username: req.user.username, email: req.user.email });
  });
});

router.post('/profil/:id', isAuth, function(req, res){
  User.findOneAndUpdate({id:req.params.id}, function(err, item){
    var user = new User();

    user.username = req.body.username;
    user.email = req.body.email;
    user.save();
    });
});


//Create Channel
router.post('/create', isAuth, function(req, res) {
    var channel = req.body;
    channel.date = new Date();

    var pl = req.body.name
        .toLowerCase()
        .replace(/[^a-zA-Z ]/g, "")
        .replace(/\s+/g, '-');

    channel.permalink = pl;

    channel.user = req.user;

    Channel.create(channel, function(err, item) {
        res.redirect("/list");
    });
});

//List Channels
router.get('/list', function(req, res) {
    Channel.find({}, function(err, items){
        res.render('channel/list', { channels : items });
    });
});

router.get('/id/:id', function(req, res) {
    Post.findById(req.params.id, function(err, item){
        console.log(item);
        res.render('channel/view', { blog: item });
    })
});

//Create message
router.post('/new', isAuth, function(req, res) {
    var message = req.body;
    message.date = new Date();
    message.user = req.user;
    message.channel=req.session.channel;
    
    Message.create(message, function(err, item){
    req.app.get('socketio').emit('new-message', message);
    res.redirect("/list");
    });
});

//Delete a message
router.get('/delete/:id', isAuth, function(req, res){
  Message.findById(req.params.id, function(err, item) {
    if(item.user.toString() == req.user._id.toString())
      Message.findByIdAndRemove(req.params.id, function(err, item) {
        if(err)
          return res.send("Error");
          res.redirect('/list');
      });
    else
      res.redirect('/list');
  });
});

//Delete a channel
router.get('/deletechannel/:id', isAuth, function(req, res){
    Channel.findById(req.params.id, function(err, item) {
      if(item.user.toString() == req.user._id.toString())
        Channel.findByIdAndRemove(req.params.id, function(err, item) {
          if(err)
            return res.send("Error");
          
            res.redirect('/list');
        });
      else
        res.redirect('/list');
    });
  });

module.exports = router;
