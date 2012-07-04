//SETTING UP A USER FOR THE BLOG

// module dependecies

var express = require('express');
var app = module.exports = express.createServer();
var db =  require('mongojs').connect('testblogdb', ['user']);
var crypto = require('crypto');


// configs
var config = require('./config').config(app, express);

app.dynamicHelpers({
  user: function(req, res) {
    return req.session.user;
  }
});

// get a view for adding a new user

app.get('/', function(req, res) {
  res.render('adduser.jade', { title: 'Create a new user'});
});


// check that the user doesn't already exist and then create it with a salted password hash

app.post('/adduser', function(req, res) {
  var values = {
      user: req.body.username
    , pass: crypto.createHash('sha256').update(req.body.password + req.body.salt).digest('hex')
    };
db.user.findOne(values, function(err, user) {
    if (err || user) {
    	res.redirect('back');
    } else {
  		db.user.insert(values, function(err, post) {
    		console.log(err, post);
    		res.redirect('/done');
		});
  	}
});
});

app.get('/done', function(req, res) {
  res.render('done.jade', { title: 'User setup done'});
});


// let it rip

app.listen(3006, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});