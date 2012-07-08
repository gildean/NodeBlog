//SETTING UP A USER FOR THE BLOG

// module dependecies

var express = require('express');
var app = module.exports = express.createServer();
var db =  require('mongojs').connect('testblogdb', ['user']);
var bcrypt = require('bcrypt');


// configs
var config = require('./config').config(app, express);

app.dynamicHelpers({
  user: function(req, res) {
    return req.session.user;
  }
});

// get a view for adding a new user

app.get('/', function(req, res) {
  res.render('adduser.jade', { 
    title: 'NodeBlog - Create a new user'
  , flash: req.flash()
  });
});


// check that the user doesn't already exist and then create it with a randomly salted password hash

app.post('/adduser', function(req, res) {
  var usercheck = db.user.find({'user': req.body.username}).count();
  if (usercheck > 0) {
      console.log('user found, not creating a new one with the same name');
      req.flash('error', 'User already exists');
    	res.redirect('back');
    } else {
      var values = {
        user: req.body.username
      , pass: bcrypt.hashSync(req.body.password, 8)
      };
  		db.user.insert(values, function(err, post) {
    		res.redirect('/done');
		});
  	}

});

app.get('/done', function(req, res) {
  res.render('done.jade', { 
    title: 'User setup done'
  , flash: req.flash()
  });
});


// let it rip

app.listen(3006, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});