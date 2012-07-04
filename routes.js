//ROUTES

// module depencies
var db =  require('mongojs').connect('testblogdb', ['post', 'user']);
var crypto = require('crypto');
var salt = 'somesalt123'; 


// login
exports.login = function(req, res) {
  res.render('login.jade', {
    title: 'Login user'
  });
};


// logout
exports.logout = function(req, res) {
  req.session.destroy();
  res.redirect('/');
};


// logon
exports.logon = function(req, res) {
  var userauth = {
      user: req.body.username
    , pass: crypto.createHash('sha256').update(req.body.password + salt).digest('hex')
  };

  db.user.findOne(userauth, function(err, user) {
    if (!err && user) {
      req.session.user = user;
      res.redirect('/');
    } else {
      res.redirect('/login');
    }
    
  });
};


// list all
exports.posts = function(req, res) {
  res.redirect('/');
};

exports.index = function(req, res) {
  var indexes = { subject: 1, body: 1, tags: 1, created: 1, author: 1 };
  db.post.find({ state: 'published'}, indexes, function(err, posts) {
    if (!err && posts) {
      res.render('index.jade', { title: 'NodeBlog', blogPosts: posts });
    }
  });
};


// view by the tags
exports.postsByTag = function(req, res) {
  db.post.find({ tags: req.params.tag }, function(err, foundposts) {
    if (!err) {
      res.render('found.jade', { title: 'NodeBlog - Found these', querytag: req.params.tag, foundPosts: foundposts });
    }
  });
};


// create a new post
exports.newPost = function(req, res) {
  res.render('add.jade', { title: 'NodeBlog - New Post '});
};


// save the new post
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
    console.log(err, post);
    res.redirect('/posts/' + values._id);
  });
};


// edit a post
exports.editPost = function(req, res) {
   res.render('edit.jade', { title: 'NodeBlog - Edit post', post: req.post } );
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
db.post.find({'comment.cid': ObjectId(req.body.cid)}, function(err, comment) {
  
    if (!err) {
      res.render('editcomment.jade', { title: 'NodeBlog - Found these', comment: comment });
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


// show one post
exports.showPost = function(req, res) {
    res.render('show.jade', {
      title: 'NodeBlog - ' + req.post.subject,
      post: req.post
  });
};