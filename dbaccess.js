// DATABASE ACCESS FUNCTIONS

// module dependencies
var dbinfo = require('./dbinfo').dbinfo;
var db = require('mongojs').connect(dbinfo);
var setupdb = db.collection('setup');
var userdb = db.collection('user');
var postdb = db.collection('post');
var commentdb = db.collection('comment');
var bcrypt = require('bcrypt');


// first check if data exist, if so, consider the action as hacking
exports.initCheck = function(req, res) {
  setupdb.count(function(err, dbcheck) {
    if (dbcheck === 0) {
      setupdb.insert({
          _id: 1   
        , title: req.body.title
        , header: req.body.header
        , modified: new Date()
       }, function (err, post) {
         res.redirect('/login');
      });
    } else {
     req.flash('error', 'data exists');
     res.redirect('/');
    }
   });
};


// export blog settings middleware
exports.settings = function(req, res, next) { 
   setupdb.findOne({ _id: 1}, function(err, settings) {
      if (settings) {
      	req.settings = settings;
      	next();
     } else {
        res.render('initdb.jade', {
           title: 'Initial setup'
       });
      }
   });
};   


// no users? no problem!
exports.anyoneThere = function (req, res) {
  userdb.count(function(err, users) {
    if (users === 0) {
        res.render('adduser.jade', {
        title: 'Create a new user'
      , flash: req.flash()
      });
    } else {
      res.render('login.jade', {
        title: 'Login user'
      , flash: req.flash()
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
          if(req.body.password != req.body.passwordconf) {
            req.flash('error', 'Password mismatch!')
            res.redirect('back');
	   } else {
      	    var values = {
                  user: req.body.username
      		, pass: bcrypt.hashSync(req.body.password, 8)
      		};
      	    userdb.insert(values, function(err, post) {
        	req.flash('info', 'New user added!')
        	res.redirect('/login');
            });
	  }
       }
   });
};


// blog settings
exports.blogSettings = function(req, res) {
   setupdb.findOne({ _id: 1 }, function(err, settings) {
       res.render('settings.jade', {
            title: 'Blog Settings'
          , blogsettings: settings
         , user: req.session.user.user
          });
      });  
};


// save settings
exports.saveBlogSettings = function(req, res) {
  setupdb.update({ _id: 1 }, {
  $set: {  
    title: req.body.title
  , header: req.body.header
  , modified: new Date()
  }}, function(err, post) {
  req.flash('info', 'Settings saved!');
  res.redirect('/');
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
 		 }}, function(err, post) {
  	req.flash('info', 'Settings saved!');
 	res.redirect('/'); 
	});
    }
};


// logon with bcrypt hash check
exports.logon = function(req, res) {
   userdb.findOne({ user : req.body.username }, function(err, useraccount) {
      if (!err && useraccount) {
        var password = req.body.password;
        var passhash = useraccount.pass;
        bcrypt.compare(password, passhash, function(err, same) {
          if (!err && same) {
            req.session.user = useraccount;
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


// list all posts
exports.index = function(req, res) {
  var indexes = { subject: 1, body: 1, tags: 1, created: 1, author: 1 };
  postdb.find({ state: 'published'}, indexes, function(err, posts) {
    if (!err && posts) {
        res.render('index.jade', {
        title: req.settings.title
      , header: req.settings.header
      , blogPosts: posts
      , flash: req.flash()
      });
    }
  });
};


// list all by selected tag
exports.postsByTag = function(req, res) {
  postdb.find({ tags: req.params.tag }, function(err, foundposts) {
    if (!err) {
      res.render('found.jade', {
        title: req.settings.title + ' - Found these'
      , querytag: req.params.tag
      , foundPosts: foundposts
       });
    }
  });
};


// save a new post
exports.addNewPost = function(req, res) {
  var values = {
      subject: req.body.subject
    , body: req.body.body
    , tags: req.body.tags.split(',')
    , state: 'published'
    , created: new Date()
    , modified: new Date()
    , comments: []
    , author: {
        username: req.session.user.user
    }
  };
  postdb.insert(values, function(err, post) {
    req.flash('info', 'New post added');
    res.redirect('/posts/' + values._id);
  });
};


// save an edited post
exports.savePostEdit = function(req, res) {
  postdb.update({ _id: db.ObjectId(req.body.id) }, {
  $set: {
  subject: req.body.subject
  , body: req.body.body
  , tags: req.body.tags.split(',')
  , modified: new Date()
  }}, function(err, post) {
  res.redirect('/posts/' + req.body.id);
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


// add a comment
exports.addComment = function(req, res) {
  function getClientIp(req) {
  var ipAddress;
  // Amazon EC2 / Heroku workaround to get real client IP
  var forwardedIpsStr = req.header('x-forwarded-for'); 
  if (forwardedIpsStr) {
    // 'x-forwarded-for' header may return multiple IP addresses in
    // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
    // the first one
    var forwardedIps = forwardedIpsStr.split(',');
    ipAddress = forwardedIps[0];
  }
  if (!ipAddress) {
    // Ensure getting client IP address still works in
    // development environment
    ipAddress = req.connection.remoteAddress;
  }
  return ipAddress;
};
  var data = {
      _id: new db.bson.ObjectID.createPk()
    , postid: req.body.postid
    , name: req.body.name
    , email: req.body.email
    , body: req.body.body
    , created: new Date()
    , status: 0
    , from: new getClientIp()
  };
  commentdb.insert(data, function(err, post) {
      req.flash('info', 'Comment added for reviewing at a later time!')
      res.redirect('/posts/' + req.body.postid);
  });
};


// save an edited comment
exports.saveCommentEdit = function(req, res) {
  commentdb.update({ _id: db.ObjectId(req.body.id) }, {
  $set: {
     body: req.body.body
  }}, function(err, post) {
  req.flash('info', 'Comment edited!');
  res.redirect('/posts/' + req.body.postid);
  });
};


// publish a comment
exports.publishComment = function(req, res) {
  commentdb.update({ _id: db.ObjectId(req.params.coid) }, {
  $set: {
	status: 1
    }}, function(err, post) {
    req.flash('info', 'Comment published');
    res.redirect('back');
  });
};


// hide a comment
exports.hideComment = function(req, res) {
  commentdb.update({ _id: db.ObjectId(req.params.coid) }, {
  $set: {
	status: 0
    }}, function(err, post) {
    req.flash('info', 'Comment hidden from view');
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


// validating the post id to get a single post
exports.checkPostId = function(req, res, next, id) {
  if (id.length != 24) return next(new Error('The post id length is incorrect'));
  postdb.findOne({_id: db.ObjectId(id)}, function(err, post) {
    if (err) return next(new Error('Make sure you provided correct post id'));
    if (!post) return next(new Error('Post loading failed'));
    commentdb.find({postid: id, status: 1}, function(err, comments) {
    commentdb.find({postid: id, status: 0}, function(err, hiddenc) {
      req.post = post;
      post.hidden = hiddenc;
      post.comments = comments;
      next();
     });
    });
  });
};


// validating the comment id to get a single comment
exports.checkCId = function(req, res, next, id) {
  if (id.length != 24) return next(new Error('The comment id length is incorrect'));
  commentdb.findOne({_id: db.ObjectId(id)}, function(err, comment) {
    if (err) return next(new Error('Make sure you provided correct post id'));
    if (!comment) return next(new Error('Comment loading failed'));
    req.comment = comment;
    next();
  });
};

