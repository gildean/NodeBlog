// MAIN server

// module dependencies.
var express = require('express')
  , moment = require('moment')
  , routes = require('./routes')
  , dbaccess = require('./dbaccess');
var server = module.exports = express.createServer();


// configuration
var config = require('./config').config(server, express);


// helpful helper is helpful
server.helpers({
  moment: moment
});

server.dynamicHelpers({
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
server.get('/login', dbaccess.anyoneThere);
server.get('/logout', dbaccess.settings, checkLogin, routes.logout);
server.get('/adduser', routes.addNewUser);
server.get('/loginpage', dbaccess.settings, routes.loginPage);


// post the user authentication
server.post('/login', dbaccess.logon);
server.post('/adduser', dbaccess.addNewUser);
server.post('/initialsetup', dbaccess.initCheck);

// routes for views
// gets
server.get('/', dbaccess.settings, dbaccess.index);
server.get('/posts', routes.posts);
server.get('/settings', checkLogin, dbaccess.blogSettings);
server.get('/posts/add', checkLogin, dbaccess.settings, routes.newPost);
server.get('/posts/:postid', dbaccess.settings, routes.showPost);
server.get('/posts/edit/:postid', checkLogin, dbaccess.settings, routes.editPost);
server.get('/posts/remove/:postid', checkLogin, dbaccess.settings, dbaccess.deletePost);
server.get('/posts/edit/comment/:coid', checkLogin, dbaccess.settings, routes.editComment);
server.get('/posts/publish/comment/:coid', checkLogin, dbaccess.settings, dbaccess.publishComment);
server.get('/posts/hide/comment/:coid', checkLogin, dbaccess.settings, dbaccess.hideComment);
server.get('/posts/remove/comment/:coid', checkLogin, dbaccess.settings, dbaccess.deleteComment);

// searchs
server.get('/posts/tags/:tag', dbaccess.settings, dbaccess.postsByTag);


// posts
server.post('/posts/add', checkLogin, dbaccess.addNewPost);
server.post('/posts/edit', checkLogin, dbaccess.savePostEdit);
server.post('/posts/comment', dbaccess.addComment);
server.post('/posts/edit/comment', checkLogin, dbaccess.saveCommentEdit);
server.post('/save/settings', checkLogin, dbaccess.settings, dbaccess.saveBlogSettings);
server.post('/save/usersettings', checkLogin, dbaccess.saveUserSettings);


// route for parameters
server.param('postid', dbaccess.checkPostId);
server.param('coid', dbaccess.checkCId);


// not found handling, this just grabs every other get and sends simply '404 not found'
server.get('*', dbaccess.settings, routes.notFound);


var PORT = process.env['server_port'] || 19968;
// Run, you fool!
server.listen( PORT, function(){
  console.log("server listening");
});

