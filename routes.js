//ROUTES

// module depencies
var db =  require('mongojs').connect('testblogdb', ['post', 'user']);
var bcrypt = require('bcrypt');


// login
exports.login = function(req, res) {
  res.render('login.jade', {
     title: 'Login user'
   , flash: req.flash()
  });
};


// logout
exports.logout = function(req, res) {
  req.session.destroy();
  res.redirect('/');
};


// logon
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


// list all
exports.posts = function(req, res) {
  res.redirect('/');
};

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
  res.render('add.jade', { 
    title: 'NodeBlog - New Post'
  , flash: req.flash() 
  });
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
    req.flash('info', 'New post added');
    res.redirect('/posts/' + values._id);
  });
};


// edit a post
exports.editPost = function(req, res) {
   res.render('edit.jade', { 
      title: 'NodeBlog - Edit post'
    , post: req.post
    , flash: req.flash()
     } );
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


// show one post
exports.showPost = function(req, res) {
    res.render('show.jade', {
      title: 'NodeBlog - ' + req.post.subject
    , post: req.post
    , flash: req.flash()  
  });
};