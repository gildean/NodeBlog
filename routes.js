// ROUTES TO MAIN VIEWS


// logout
exports.logout = function(req, res) {
  req.session.destroy();
  res.redirect('/');
};


// list all
exports.posts = function(req, res) {
  res.redirect('/');
};


// about page
exports.about = function(req, res) {
  res.render('about.jade', {
    title: req.settings.title
  , aboutinfo: req.settings
  , flash: req.flash()
  , author: req.settings.author.nick
  });
};


// edit the about page
exports.editAbout = function(req, res) {
  res.render('editabout.jade', {
    title: 'Editing about'
  , aboutinfo: req.settings
  , flash: req.flash()
  , author: req.settings.author.nick
  }); 
};


// create a new post
exports.newPost = function(req, res) {
  res.render('add.jade', {
    title: req.settings.title + ' - New Post'
  , flash: req.flash()
  , author: req.settings.author.nick
  });
};


// edit a post
exports.editPost = function(req, res) {
   res.render('edit.jade', {
     title: req.settings.title + ' - Editing post:' + ' ' + req.post.subject
   , post: req.post
   , flash: req.flash()
   , author: req.settings.author.nick
   });
 };


// show one post
exports.showPost = function(req, res) {
    res.render('show.jade', {
     post: req.post
   , title: req.settings.title + ' - ' + req.post.subject
   , settings: req.settings
   , flash: req.flash()
   , author: req.settings.author.nick
   });
};

// show one comment
exports.showComment = function(req, res) {
    res.render('showcomment.jade', {
     post: req.comment
   , title: req.settings.title + ' - ' + req.comment.subject
   , settings: req.settings
   , flash: req.flash()
   , author: req.comment.name
   });
};


// edit a comment
exports.editComment = function(req, res) {
    res.render('editcomment.jade', {
    title: req.settings.title + ' - Editing comment from:' + ' ' + req.comment.name
  , comment: req.comment
  , flash: req.flash()
  , author: req.settings.author.nick
  });
};


// 404 Not Found
exports.notFound = function(req, res) {
  res.render('404.jade', {
    status: 404
  , title: '404 Not Found'
  , author: 'NodeBlog'
  });
};

