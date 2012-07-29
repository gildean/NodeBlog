// DATABASE ACCESS FUNCTIONS

// module dependencies
var dbinfo = require('./dbinfo').dbinfo;
var db = require('mongojs').connect(dbinfo);
var setupdb = db.collection('setup');
var userdb = db.collection('user');
var postdb = db.collection('post');
var commentdb = db.collection('comment');
var bcrypt = require('bcrypt');



// add kudos atomic operation
exports.addKudos = function (req, res, id) {
  postdb.update({_id: req.post._id},{$inc:{kudos:1}}, function(err) {
    if (err) {
        console.log(new Error(err));
    } else {
        console.log('success' + ' ' + req.post._id);
        res.send(204);
        res.end;
    }
  });
};


// first check if data exist, if so, consider the action as hacking
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
       }, function (err, post) {
         res.redirect('/login');
      });
    } else {
     req.flash('error', 'data exists, stop hacking');
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
      	};
      	userdb.insert(values, function(err, post) {
           req.flash('info', 'New user added!')
           res.redirect('/login');
        });
	    }
    }
  });
};


// edit blog settings
exports.blogSettings = function(req, res) {
   setupdb.findOne({ _id: 1 }, function(err, settings) {
       res.render('settings.jade', {
          title: 'Blog Settings'
        , blogsettings: settings
        , user: req.session.user.user
        , author: 'NodeBlog'
        , flash: req.flash()
       });
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
    }, function(err, post) {
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
  }, function(err, post) {
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
        }
      }, function(err, post) {
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


// list all by selected tag
exports.postsByTag = function(req, res) {
  postdb.find({ tags: req.params.tag }).sort( { created : -1 }, function(err, foundposts) {
    if (!err && foundposts) {
      res.render('index.jade', {
          title: 'Search results for tag:' + ' ' + req.params.tag 
        , header:  'Descenging order by date'
        , blogPosts: foundposts
        , flash: req.flash()
        , author: req.settings.author.nick
      });
    } else {
      res.render('404.jade', {
          title: 'No mangos found'
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
    , state: 'published'
    , created: new Date()
    , modified: new Date()
    , author: {
         username: req.session.user.user
       , poster: req.settings.author.nick    
     }
  };
  postdb.insert(values, function(err, post) {
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
    }, function(err, post) {
  res.redirect('/posts/' + req.body.id + '/' + 'Post-Saved-Succesfully');
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
  var data = {
        _id: new db.bson.ObjectID.createPk()
      , postid: req.body.postid
      , website: req.body.site
      , name: req.body.name
      , email: req.body.email
      , body: req.body.body
      , created: new Date()
      , status: 0
      , from: req.ipaddress
  };
  commentdb.insert(data, function(err, post) {
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
    }, function(err, post) {
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
    }, function(err, post) {
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
    }, function(err, post) {
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
  if (id.length != 24) {
    return next(
      res.render('404.jade', {
          title: 'Incorrect post id'
        , author: 'NodeBlog'
      }));
  } else {
    postdb.findOne({_id: db.ObjectId(id)}, function(err, post) {
      if (err) {
        return next(
          res.render('404.jade', {
              title: 'Error occurred'
            , author: 'NodeBlog'
          }));
      }
      if (!post) { 
        return next(
          res.render('404.jade', {
              title: 'Sorry, no post found'
            , author: 'NodeBlog'
          }));
      } else {  
        commentdb.find({postid: id, status: 1}, function(err, comments) {
          if (err) {
            return next(
              res.render('404.jade', {
                title: 'Error occurred'
                , author: 'NodeBlog' 
            }));
          } else {
            commentdb.find({postid: id, status: 0}, function(err, hiddenc) {
              if (err) {
                return next(
                  res.render('404.jade',{
                      title: 'Error occurred'
                    , author: 'NodeBlog'
                }));
              } 
              req.post = post;
              post.hidden = hiddenc;
              post.comments = comments;
              next();
            });
          }
        });
      }
    });
  }
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
