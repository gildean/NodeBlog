//DATABASE ACCESS FUNCTIONS

// module dependencies
var db =  require('mongojs').connect('testblogdb', ['post', 'user']);
var bcrypt = require('bcrypt');


// no users? no problem!
exports.anyoneThere = function (req, res) {
  var noUsers = db.user.find({ user: { $exists : false } });
  if (noUsers) {
    res.render('adduser.jade', { 
      title: 'NodeBlog - Create a new user'
    , flash: req.flash()
    });
  } else {
    res.render('login.jade', {
     title: 'Login user'
   , flash: req.flash()
  });
  }
};

  
// check that the user doesn't already exist and then create it with a randomly salted password hash
exports.addNewUser = function(req, res) {
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
        req.flash('New user added!')
        res.redirect('/login');
      });
    }
};


// logon with bcrypt hash check
exports.logon = function(req, res) {
   db.user.findOne({ user : req.body.username }, function(err, useraccount) {
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
  db.post.find({ state: 'published'}, indexes, function(err, posts) {
    if (!err && posts) {
      res.render('index.jade', { 
        title: 'NodeBlog'
      , blogPosts: posts 
      , flash: req.flash()  
      });
    }
  });
};


// list all by cliecked tag
exports.postsByTag = function(req, res) {
  db.post.find({ tags: req.params.tag }, function(err, foundposts) {
    if (!err) {
      res.render('found.jade', { 
        title: 'NodeBlog - Found these'
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

  db.post.insert(values, function(err, post) {
    req.flash('info', 'New post added');
    res.redirect('/posts/' + values._id);
  });
};


// save an edited post
exports.savePostEdit = function(req, res) {
  db.post.update({ _id: db.ObjectId(req.body.id) }, {
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
  db.post.remove({ _id: db.ObjectId(req.params.postid) }, function(err, post) {
    req.flash('info', 'Post deleted');
    res.redirect('/');
  });
};


// add a comment
exports.addComment = function(req, res) {
  var data = {
      name: req.body.name
    , email: req.body.email
    , body: req.body.comment
    , created: new Date()
    , cid: new db.bson.ObjectID.createPk()
  };

  console.log(data);

  db.post.update({ _id: db.ObjectId(req.body.postid) }, {
    $push: { comments: data }}, { safe: true }, function(err, post) {
      req.flash('info', 'Comment added')
      res.redirect('/posts/' + req.body.postid);
  });
};


// edit a comment
exports.editComment = function(req, res) {
   var commentvalues = {  
      name: req.body.name
    , email: req.body.email
    , body: req.body.comment
    , created: req.body.ts
  };

  console.log(commentvalues);
db.post.find({'comment.cid': ObjectId(req.params.cid)}, function(err, comment) {
    if (!err) {
      res.render('editcomment.jade', { 
        title: 'NodeBlog - Found these'
      , comment: comment
      , flash: req.flash() 
    });
    }
  });
};


// save the edited comment
exports.saveEditComment = function(req, res) {
  var data = {
      name: req.body.name
    , email: req.body.email
    , body: req.body.comment
    , created: req.body.ts
  };

  console.log(data);

  db.post.update({ _id: db.ObjectId(req.body.id) }, {
    $set: { comments: data }}, { safe: true }, function(err, post) {
      res.redirect('/posts/' + req.body.id);
  });
};


// delete a comment
exports.deleteComment = function(req, res) {
  var data = {
      name: req.body.name
    , email: req.body.email
    , body: req.body.comment
    , created: req.body.ts
  };

  console.log(data);

  db.post.update({ _id: db.ObjectId(req.body.id) }, {
    $pull: { comments: data }}, function(err, post) {
      res.redirect('/posts/' + req.body.id);
  });
};


// validating the post id
exports.checkPostId = function(req, res, next, id) {
  if (id.length != 24) return next(new Error('The post id length is incorrect'));
  db.post.findOne({_id: db.ObjectId(id)}, function(err, post) {
    if (err) return next(new Error('Make sure you provided correct post id'));
    if (!post) return next(new Error('Post loading failed'));
    req.post = post;
    next();
  });
};