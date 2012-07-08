// MAIN APP

// module dependencies.
var express = require('express')
  , moment = require('moment')
  , routes = require('./routes')
  , dbaccess = require('./dbaccess')
  , fs = require('fs')
  , http = require('./httpredirect');
var app = module.exports = express.createServer({
  key: fs.readFileSync('./key.key'),
  cert: fs.readFileSync('./cert.crt')
});


// configuration
var config = require('./config').config(app, express);

app.helpers({
  moment: moment
});

app.dynamicHelpers({
  user: function(req, res) {
    return req.session.user;
  }
});


// we have to check the users login-status
function checkLogin(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.flash('error','Not logged in');
    res.redirect('/login');
  }
};


// routes for login-logout
// gets
app.get('/login', dbaccess.anyoneThere);
app.get('/logout', checkLogin, routes.logout);


// post the user authentication
app.post('/login', dbaccess.logon);
app.post('/adduser', dbaccess.addNewUser);


// routes for views
// gets
app.get('/', dbaccess.index);
app.get('/posts', routes.posts);
app.get('/posts/add', checkLogin, routes.newPost);
app.get('/posts/:postid', routes.showPost);
app.get('/posts/edit/:postid', checkLogin, routes.editPost);
app.get('/posts/remove/:postid', checkLogin, dbaccess.deletePost);
app.get('/posts/edit/comment/:postid', checkLogin, routes.editComment);


//searchs
app.get('/posts/tags/:tag', dbaccess.postsByTag);


//posts
app.post('/posts/remove/comment/:postid', checkLogin, dbaccess.deleteComment);
app.post('/posts/add', checkLogin, dbaccess.addNewPost);
app.post('/posts/edit', dbaccess.savePostEdit);
app.post('/posts/comment', dbaccess.addComment);
app.post('/posts/edit/comment', checkLogin, dbaccess.saveEditComment);


// route for postid validation
app.param('postid', dbaccess.checkPostId);


// Start the app, you fool
app.listen(3004, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});