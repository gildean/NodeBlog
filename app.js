// MAIN APP

// module dependencies.
var express = require('express')
  , moment = require('moment')
  , routes = require('./routes');
var app = module.exports = express.createServer();


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
    res.redirect('/login');
  }
}


// routes for login-logout
// gets
app.get('/login', routes.login);
app.get('/logout', checkLogin, routes.logout);

// post the user authentication
app.post('/login', routes.logon);


// routes for views
// gets
app.get('/', routes.index);
app.get('/posts', routes.posts);
app.get('/posts/add', checkLogin, routes.newPost);
app.get('/posts/:postid', routes.showPost);
app.get('/posts/edit/:postid', checkLogin, routes.editPost);
app.get('/posts/remove/:postid', checkLogin, routes.deletePost);
app.get('/posts/edit/comment/:postid', checkLogin, routes.editComment);


//searchs
app.get('/posts/tags/:tag', routes.postsByTag);


//posts
app.post('/posts/remove/comment/:postid', checkLogin, routes.deleteComment);
app.post('/posts/add', checkLogin, routes.addNewPost);
app.post('/posts/edit', routes.savePostEdit);
app.post('/posts/comment', routes.addComment);
app.post('/posts/edit/comment', checkLogin, routes.saveEditComment);


// route for postid validation
app.param('postid', routes.checkPostId);


// Start the app, you fool
app.listen(3004, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});