//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//|************************************************************|//
//|                                                            |//
//|                   DATABASE ACCESS FUNCTIONS                |//
//|                                                            |//
//|____________________________________________________________|//
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//|************************************************************|//
//|                                                            |//
//|                         Contents:                          |//
//|                                                            |//
//|____________________________________________________________|//
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//|************************************************************|//
//|                                                            |//
//|                   1.MODULE DEPENDENCIES                    |//
//|                                                            |//
//|                   2.MIDDLEWAREZ                            |//
//|                                                            |//
//|                   3.PARAMETER CALLS                        |//
//|                                                            |//
//|                   4.LOGIN ACTIONS                          |//
//|                                                            |//
//|                   5.BLOGPOST ACTIONS                       |//
//|                                                            |//
//|                   6.COMMENT ACTIONS                        |//
//|                                                            |//
//|                   7.BLOG SETTINGS                          |//
//|                                                            |//
//|____________________________________________________________|//
//////////////////////////////////////////////////////////////////









//////////////////////////////////////////////////////////////////
//|************************************************************|//
//|                                                            |//
//|                 1.MODULE DEPENDENCIES                      |//
//|                                                            |//
//|____________________________________________________________|//
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//                                                              //
//                                                              //
//          These are the modules and db-connections            //
//                                                              //
//                                                              //
//////////////////////////////////////////////////////////////////



var dbinfo = require('./dbinfo').dbinfo;
var db = require('mongojs').connect(dbinfo);
var setupdb = db.collection('setup');
var userdb = db.collection('user');
var postdb = db.collection('post');
var commentdb = db.collection('comment');
var bcrypt = require('bcrypt');
























//////////////////////////////////////////////////////////////////
//|************************************************************|//
//|                                                            |//
//|                       2.MIDDLEWAREZ                        |//
//|                                                            |//
//|____________________________________________________________|//
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//                                                              //
//                                                              //
//                look for things that make us go               //
//                                                              //
//                                                              //
//////////////////////////////////////////////////////////////////



// logincheck middleware
exports.checkLogin = function(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.flash('error','Not logged in');
    res.redirect('/login');
  }
};



// blog settings middleware
exports.settings = function(req, res, next) { 
   setupdb.findOne({ _id: 1}, function(err, settings) {
      if (settings) {
        req.settings = settings;
        next();
      } else {
        res.render('initdb.jade', {
            title: 'Initial setup'
          , author: 'NodeBlog'
        });
      }
   });
};   



// Ipcheck middleware
exports.checkIP = function(req, res, next) {
  var ipAddress;
  var forwardedIpsStr = req.header('x-forwarded-for'); 
  if (forwardedIpsStr) {
    var forwardedIps = forwardedIpsStr.split(',');
    ipAddress = forwardedIps[0];
  }
  if (!ipAddress) {
    ipAddress = req.connection.remoteAddress;
  }
  req.ipaddress = ipAddress;
  next();
};

























//////////////////////////////////////////////////////////////////
//|************************************************************|//
//|                                                            |//
//|                    3.PARAMETER CALLS                       |//
//|                                                            |//
//|____________________________________________________________|//
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//                                                              //
//                                                              //
//              Url-parameter callback functions                //
//                                                              //
//                                                              //
//////////////////////////////////////////////////////////////////



// validating the post id to get a post and all linked comments
exports.checkPostId = function(req, res, next, id) {
  if (id.length != 24) {
    return next(
      res.render('404.jade', {
          status: 418
        , title: 'No coffee...'
        , author: 'NodeBlog'
      })
    );
  } else {
    postdb.findOne({_id: db.ObjectId(id)},
      function(err, post) {
        if (!err && post) {
          commentdb.find({postid: id},
            function(err, comments) {
              if (!comments) {
                req.post = post;
                next();
              } else if (!err && comments) {
                req.post = post;
                post.comments = comments;
                next();
              }
          });
        } else {
          return next(
            res.render('404.jade', {
                status: 501
              , title: 'Error'
              , author: 'NodeBlog'
            })
          );
        }
    });
  } 
};



// validating the comment id to get a comment
exports.checkCId = function(req, res, next, id) {
  if (id.length != 24) {
    return next(
      res.render('404.jade', {
          status: 404
        , title: 'No comments...'
        , author: 'NodeBlog'
      })
    );
  } else {
    commentdb.findOne({_id: db.ObjectId(id)},
      function(err, comment) {
        if (!err && comment) { 
          req.comment = comment;
          next();
        } else {
          return next(
            res.render('404.jade', {
                status: 404
              , title: 'No comments...'
              , author: 'NodeBlog'
            })
          );
        }
    });
  }
};



// list all by selected tag
exports.findTag = function(req, res, next, tag) {
  postdb.find({ tags: req.params.tag }).sort( { created : -1 },
   function(err, foundtags) {
      if (!err && foundtags) {
        req.postsbytag = foundtags;
        next();
      } else {
        return next(
          res.render('404.jade', {
              status: 404
            , title: 'No tag in sight...'
            , author: 'NodeBlog'
          })
        );
      }
  });
};



// add kudos atomic operation
exports.addKudos = function (req, res) {
  postdb.update({_id: req.post._id},{$inc:{kudos:1}},
    function(err) {
      if (!err) {res.send(204);}
      else {res.send(501);}
  });
};


























//////////////////////////////////////////////////////////////////
//|************************************************************|//
//|                                                            |//
//|                     4.LOGIN ACTIONS                        |//
//|                                                            |//
//|____________________________________________________________|//
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//                                                              //
//                                                              //
//     Login/logout user, if none found create a new one        //
//                                                              //
//                                                              //
//////////////////////////////////////////////////////////////////



// no users? no problem!
exports.anyoneThere = function (req, res) {
  userdb.count(function(err, users) {
    if (users === 0) {
      res.render('adduser.jade', {
          title: 'Create a new user'
        , flash: req.flash()
        , author: 'NodeBlog'
      });
    } else {
      res.render('login.jade', {
          title: 'Login'
        , flash: req.flash()
        , author: 'NodeBlog'
      });
    }
  });
};


  
// check that the user doesn't already exist and then create it with a randomly salted password hash
exports.addNewUser = function(req, res) {
  userdb.count(function(err, usercheck) {
    if (usercheck > 0) {
      console.log('user found, not creating a new one');
      req.flash('error', 'A user already exists');
      res.redirect('/');
    } else {
      if (req.body.password != req.body.passwordconf) {
        req.flash('error', 'Password mismatch!')
        res.redirect('back');
      } else {
        var values = {
            user: req.body.username
          , pass: bcrypt.hashSync(req.body.password, 8)
          , lastlogin: {
              time: new Date()
            , from: req.ipaddress
        }
      	};
      	userdb.insert(values, function() {
           req.flash('info', 'New user added!')
           res.redirect('/login');
        });
	    }
    }
  });
};



// logon with bcrypt hash check
exports.logon = function(req, res) {
  userdb.findOne({ user : req.body.username },
    function(err, useraccount) {
      if (!err && useraccount) {
        var password = req.body.password;
        var passhash = useraccount.pass;
        bcrypt.compare(password, passhash, function(err, same) {
          if (!err && same) {
            req.session.user = useraccount;
            req.flash('info', 'Last login at' + ' ' + useraccount.lastlogin.time + ' ' + 'from' + ' ' + useraccount.lastlogin.from);
            res.redirect('/');
          } else {
            req.flash('error', 'Incorrect login, try again');
            res.redirect('back');
          }
        });
      } else {
          req.flash('error', 'Incorrect login, try again');
          res.redirect('back');
      }
  });
};



// logout and log ip and time
exports.logout = function(req, res) {
  userdb.update({ user: req.session.user.user }, {
    $set: {
      lastlogin: {
          time: new Date()
        , from: req.ipaddress 
      } 
    }
  }, 
  function() {
    req.session.destroy();
    res.redirect('/');
  });
};


























//////////////////////////////////////////////////////////////////
//|************************************************************|//
//|                                                            |//
//|                    5.BLOGPOST ACTIONS                      |//
//|                                                            |//
//|____________________________________________________________|//
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//                                                              //
//                                                              //
//        Add, save, publish, hide and delete blogposts         //
//                                                              //
//                                                              //
//////////////////////////////////////////////////////////////////



// list all posts
exports.index = function(req, res) {
  postdb.find().sort( { created : -1 }, function(err, posts) {
    if (!err) {
        res.render('index.jade', {
          title: req.settings.title
        , header: req.settings.header
        , blogPosts: posts
        , flash: req.flash()
        , author: req.settings.author.nick
      });
    }
  });
};



// save a new post
exports.addNewPost = function(req, res) {
  var values = {
      subject: req.body.subject
    , subtitle: req.body.subtitle
    , body: req.body.body
    , kudos: 0
    , tags: req.body.tags.split(',')
    , status: 0
    , created: new Date()
    , modified: new Date()
    , author: {
         username: req.session.user.user
       , poster: req.settings.author.nick    
     }
  };
  postdb.insert(values, function() {
    req.flash('info', 'New post added');
    res.redirect('/posts/' + values._id + '/' + 'New-Post-Saved-Succesfully');
  });
};



// save an edited post
exports.savePostEdit = function(req, res) {
  postdb.update({ _id: db.ObjectId(req.body.id) }, {
    $set: {
        subject: req.body.subject
      , subtitle: req.body.subtitle
      , body: req.body.body
      , tags: req.body.tags.split(',')
      , modified: new Date()
      }
    }, function() {
        req.flash('info', 'Post saved succesfully');
        res.redirect('/posts/' + req.body.id + '/' + 'Post-Saved-Succesfully');
  });
};



// publish a blogpost
exports.publishPost = function(req, res) {
  postdb.update({ _id: db.ObjectId(req.params.postid) }, {
    $set: {
      status: 1
      }
    }, function() {
        req.flash('info', 'Post published');
        res.redirect('back');
  });
};



// hide a blogpost
exports.hidePost = function(req, res) {
  postdb.update({ _id: db.ObjectId(req.params.postid) }, {
    $set: {
      status: 0
      }
    }, function() {
        req.flash('info', 'Post hidden from public view');
        res.redirect('back');
  });
};




// delete a post
exports.deletePost = function(req, res) {
  postdb.remove({ _id: db.ObjectId(req.params.postid) }, function(err, post) {
    commentdb.remove({ postid: req.params.postid }, function(err, comments) {
      req.flash('info', 'Post deleted');
      res.redirect('/');
    });
  });
};


























//////////////////////////////////////////////////////////////////
//|************************************************************|//
//|                                                            |//
//|                    6.COMMENT ACTIONS                       |//
//|                                                            |//
//|____________________________________________________________|//
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//                                                              //
//                                                              //
//         Add, save, publish, hide and delete comments         //
//                                                              //
//                                                              //
//////////////////////////////////////////////////////////////////



// add a comment
exports.addComment = function(req, res) {
  var data = {
        _id: new db.bson.ObjectID.createPk()
      , postid: req.body.postid
      , postsubject: req.body.postsubject
      , website: req.body.site
      , subject: req.body.subject
      , name: req.body.name
      , email: req.body.email
      , body: req.body.body
      , created: new Date()
      , status: 0
      , from: req.ipaddress
  };
  commentdb.insert(data, function() {
      req.flash('info', 'Comment added for reviewing at a later time!')
      res.redirect('/posts/' + req.body.postid + '/' + 'Thanks-For-The-Comment');
  });
};



// save an edited comment
exports.saveCommentEdit = function(req, res) {
  commentdb.update({ _id: db.ObjectId(req.body.id) }, {
    $set: {
       body: req.body.body
      }
    }, function() {
        req.flash('info', 'Comment edited!');
        res.redirect('/posts/' + req.body.postid + '/' + 'Comment-edited-succesfully');
  });
};



// publish a comment
exports.publishComment = function(req, res) {
  commentdb.update({ _id: db.ObjectId(req.params.coid) }, {
    $set: {
      status: 1
      }
    }, function() {
        req.flash('info', 'Comment published');
        res.redirect('back');
  });
};



// hide a comment
exports.hideComment = function(req, res) {
  commentdb.update({ _id: db.ObjectId(req.params.coid) }, {
    $set: {
      status: 0
      }
    }, function() {
        req.flash('info', 'Comment hidden from public view');
        res.redirect('back');
  });
};



// delete a comment
exports.deleteComment = function(req, res) {
  commentdb.remove({ _id: db.ObjectId(req.params.coid) }, function(err, post) {
    req.flash('info', 'Comment deleted');
    res.redirect('back');
  });
};


























//////////////////////////////////////////////////////////////////
//|************************************************************|//
//|                                                            |//
//|                      7.BLOG SETTINGS                       |//
//|                                                            |//
//|____________________________________________________________|//
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//                                                              //
//                                                              //
//     Functions to save aboutpage, user- and blog settings     //
//                                                              //
//                                                              //
//////////////////////////////////////////////////////////////////



// this creates the blog settings for the first time
// first check if data exist, if so, stop, something is wrong
exports.initCheck = function(req, res) {
  setupdb.count(function(err, dbcheck) {
    if (dbcheck === 0) {
      setupdb.insert({
          _id: 1   
        , title: req.body.title
        , header: req.body.header
        , about: req.body.about
        , author: {
            name: req.body.author
          , nick: req.body.nick
          , what: req.body.what
          , where: req.body.where.split(',')
        } 
        , modified: new Date()
       }, function () {
         res.redirect('/login');
      });
    } else {
      req.flash('error', 'data exists, stop hacking');
      res.redirect('/');
    }
  });
};



// save blog settings
exports.saveBlogSettings = function(req, res) {
  setupdb.update({ _id: 1 }, {
    $set: {  
        title: req.body.title
      , header: req.body.header
      , modified: new Date()
      }
    }, function() {
        req.flash('info', 'Settings saved!');
        res.redirect('/');
  });
};



// save about page and author info
exports.saveAbout = function(req, res) {
  setupdb.update({ _id: 1 }, {
    $set: {
        modified: new Date()
      , about: req.body.about
      , author: {
          name: req.body.author
        , nick: req.body.nick
        , what: req.body.what
        , where: req.body.where.split(',')
        } 
      }
  }, function() {
      req.flash('info', 'Settings saved!');
      res.redirect('/about');
  });
};



// save usersettings
exports.saveUserSettings = function(req, res) {
  if(req.body.password != req.body.passwordconf) {
      req.flash('error', 'Password mismatch!')
      res.redirect('back');
  } else {
      userdb.update({ user: req.body.username }, {
        $set: {
            user: req.body.username
          , pass: bcrypt.hashSync(req.body.password, 8)
          , lastlogin: {
              time: new Date()
            , from: req.ipaddress
          }
        }
      }, function() {
          req.flash('info', 'Settings saved!');
          res.redirect('/'); 
    });
  }
};
