// MAIN server

// module dependencies.
var express = require('express')
  , moment = require('moment')
  , jade = require('jade')
  , routes = require('./routes')
  , ghm = require('ghm')
  , dbaccess = require('./dbaccess');
var app = module.exports = express.createServer();


// configuration
var config = require('./config').config(app, express);


// helpful helper is helpful
app.helpers({
  moment: moment,
  md : function(text){
   return ghm.parse(text);}
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
app.post('/initialsetup', dbaccess.initCheck);


// routes for views
// gets
app.get('/', dbaccess.settings, dbaccess.index);
app.get('/posts', routes.posts);
app.get('/about', dbaccess.settings, routes.about);
app.get('/kudos/:postid', dbaccess.addKudos);
app.get('/edit/about', checkLogin, dbaccess.settings, routes.editAbout);
app.get('/settings', checkLogin, dbaccess.blogSettings);
app.get('/add/post', checkLogin, dbaccess.settings, routes.newPost);
app.get('/edit/post/:postid', checkLogin, dbaccess.settings, routes.editPost);
app.get('/remove/post/:postid', checkLogin, dbaccess.settings, dbaccess.deletePost);
app.get('/edit/comment/:coid', checkLogin, dbaccess.settings, routes.editComment);
app.get('/publish/comment/:coid', checkLogin, dbaccess.settings, dbaccess.publishComment);
app.get('/hide/comment/:coid', checkLogin, dbaccess.settings, dbaccess.hideComment);
app.get('/remove/comment/:coid', checkLogin, dbaccess.settings, dbaccess.deleteComment);
app.get('/posts/:postid/*', dbaccess.settings, routes.showPost);
app.get('/posts/:postid', dbaccess.settings, routes.showPost);

// searchs
app.get('/search/tags/:tag', dbaccess.settings, dbaccess.postsByTag);


// posts
app.post('/save/about', checkLogin, dbaccess.saveAbout);
app.post('/save/post', checkLogin, dbaccess.addNewPost);
app.post('/edit/post', checkLogin, dbaccess.savePostEdit);
app.post('/save/comment', dbaccess.checkIP, dbaccess.addComment);
app.post('/edit/comment', checkLogin, dbaccess.saveCommentEdit);
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
