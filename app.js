//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//|************************************************************|//
//|                                                            |//
//|                      MAIN APPLICATION                      |//
//|                                                            |//
//|____________________________________________________________|//
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//|************************************************************|//
//|                                                            |//
//|                   1.MODULE DEPENDENCIES                    |//
//|                                                            |//
//|                   2.GET ACTIONS                            |//
//|                                                            |//
//|                   3.POST ACTIONS                           |//
//|                                                            |//
//|                   4.RUN                                    |//
//|                                                            |//
//|____________________________________________________________|//
//////////////////////////////////////////////////////////////////













//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//|                                                            |//
//|                   1.MODULE DEPENCIES                       |//
//|                                                            |//
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////



var express = require('express')
  , moment = require('moment')
  , jade = require('jade')
  , ghm = require('ghm')
  , routes = require('./routes')
  , dbaccess = require('./dbaccess')
  , app = module.exports = express.createServer();



// express server configuration
var config = require('./config').config(app, express, moment, ghm);



//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////













//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//|                                                            |//
//|                     2.GET ACTIONS                          |//
//|                                                            |//
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////



// routes for login-logout
app.get('/login', dbaccess.anyoneThere);
app.get('/logout', dbaccess.checkLogin, dbaccess.checkIP, dbaccess.logout);



// add some kudos
app.get('/kudos/:postid', dbaccess.addKudos);
app.get('/kudos/:coid', dbaccess.addKudos);



//index page and searchs
app.get('/', dbaccess.settings, dbaccess.index, routes.listAll);
app.get('/posts', dbaccess.settings, dbaccess.index, routes.listAll);
app.get('/search/tags/:tag', dbaccess.settings, routes.postsByTag);



// aboutpage and settingspage
app.get('/about', dbaccess.settings, routes.about);
app.get('/edit/about', dbaccess.checkLogin, dbaccess.settings, routes.editAbout);
app.get('/settings', dbaccess.checkLogin, dbaccess.settings, routes.blogSettings);



// actions for posts
app.get('/add/post', dbaccess.checkLogin, dbaccess.settings, routes.newPost);
app.get('/edit/post/:postid', dbaccess.checkLogin, dbaccess.settings, routes.editPost);
app.get('/publish/post/:postid', dbaccess.checkLogin, dbaccess.publishPost);
app.get('/hide/post/:postid', dbaccess.checkLogin, dbaccess.hidePost);
app.get('/remove/post/:postid', dbaccess.checkLogin, dbaccess.deletePost);



// actions for comments
app.get('/edit/comment/:coid', dbaccess.checkLogin, dbaccess.settings, routes.editComment);
app.get('/publish/comment/:coid', dbaccess.checkLogin, dbaccess.publishComment);
app.get('/hide/comment/:coid', dbaccess.checkLogin, dbaccess.hideComment);
app.get('/remove/comment/:coid', dbaccess.checkLogin, dbaccess.deleteComment);



// get single post with any url
app.get('/posts/:postid/*', dbaccess.settings, routes.showPost);
app.get('/posts/:postid?', dbaccess.settings, routes.showPost);



// get single comment with any url
app.get('/comments/:coid/*', dbaccess.settings, routes.showComment);
app.get('/comments/:coid?', dbaccess.settings, routes.showComment);



// not found handling, this just grabs every other get and sends simply '404 not found'
app.get('*', dbaccess.settings, routes.notFound);



//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////













//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//|                                                            |//
//|                    3.POST ACTIONS                          |//
//|                                                            |//
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////



// post the user authentication
app.post('/login', dbaccess.logon);
app.post('/adduser', dbaccess.checkIP, dbaccess.addNewUser);
app.post('/initialsetup', dbaccess.initCheck);



// save posts and comments
app.post('/save/post', dbaccess.checkLogin, dbaccess.settings, dbaccess.addNewPost);
app.post('/edit/post', dbaccess.checkLogin, dbaccess.savePostEdit);
app.post('/save/comment', dbaccess.checkIP, dbaccess.addComment);
app.post('/edit/comment', dbaccess.checkLogin, dbaccess.saveCommentEdit);



// save settings
app.post('/save/about', dbaccess.checkLogin, dbaccess.saveAbout);
app.post('/save/settings', dbaccess.checkLogin, dbaccess.saveBlogSettings);
app.post('/save/usersettings', dbaccess.checkLogin, dbaccess.checkIP, dbaccess.saveUserSettings);



// route for parameters
app.param('postid', dbaccess.checkPostId);
app.param('coid', dbaccess.checkCId);
app.param('tag', dbaccess.findTag);



//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////













//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//|                                                            |//
//|                          4.RUN                             |//
//|                                                            |//
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////



var PORT = 3030;
// Run, you fool!
app.listen(PORT, function(){
  console.log("server listening");
});



//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
