// MAIN server

// module dependencies.
var express = require('express')
  , moment = require('moment')
  , jade = require('jade')
  , routes = require('./routes')
  , dbaccess = require('./dbaccess');
var app = module.exports = express.createServer();


// configuration
var config = require('./config').config(app, express);


// helpful helper is helpful
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
app.get('/loginpage', dbaccess.settings, routes.loginPage);


// post the user authentication
app.post('/login', dbaccess.logon);
app.post('/adduser', dbaccess.addNewUser);
app.post('/initialsetup', dbaccess.initCheck);


// routes for views
// gets
app.get('/', dbaccess.settings, dbaccess.index);
app.get('/posts', routes.posts);
app.get('/about', dbaccess.settings, routes.about);
app.get('/edit/about', checkLogin, dbaccess.settings, routes.editAbout);
app.get('/settings', checkLogin, dbaccess.blogSettings);
app.get('/posts/add', checkLogin, dbaccess.settings, routes.newPost);
app.get('/posts/:postid', dbaccess.settings, routes.showPost);
app.get('/posts/edit/:postid', checkLogin, dbaccess.settings, routes.editPost);
app.get('/posts/remove/:postid', checkLogin, dbaccess.settings, dbaccess.deletePost);
app.get('/posts/edit/comment/:coid', checkLogin, dbaccess.settings, routes.editComment);
app.get('/posts/publish/comment/:coid', checkLogin, dbaccess.settings, dbaccess.publishComment);
app.get('/posts/hide/comment/:coid', checkLogin, dbaccess.settings, dbaccess.hideComment);
app.get('/posts/remove/comment/:coid', checkLogin, dbaccess.settings, dbaccess.deleteComment);


// searchs
app.get('/posts/tags/:tag', dbaccess.settings, dbaccess.postsByTag);


// posts
app.post('/save/about', checkLogin, dbaccess.saveAbout);
app.post('/posts/add', checkLogin, dbaccess.addNewPost);
app.post('/posts/edit', checkLogin, dbaccess.savePostEdit);
app.post('/posts/comment', dbaccess.checkIP, dbaccess.addComment);
app.post('/posts/edit/comment', checkLogin, dbaccess.saveCommentEdit);
app.post('/save/settings', checkLogin, dbaccess.settings, dbaccess.saveBlogSettings);
app.post('/save/usersettings', checkLogin, dbaccess.saveUserSettings);


// route for parameters
app.param('postid', dbaccess.checkPostId);
app.param('coid', dbaccess.checkCId);


// not found handling, this just grabs every other get and sends simply '404 not found'
app.get('*', dbaccess.settings, routes.notFound);


// for nodester
var PORT = process.env['app_port'] || 19968;
// Run, you fool!
app.listen( PORT, function(){
  console.log("server listening");
});
