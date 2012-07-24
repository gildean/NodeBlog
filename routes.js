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
    title: 'About' + ' ' + req.settings.title
  , aboutinfo: req.settings.about
  , flash: req.flash()
  });
};


// edit the about page
exports.editAbout = function(req, res) {
  res.render('editabout.jade', {
    title: 'Editing about'
  , aboutinfo: req.settings.about
  , flash: req.flash()
  }); 
};


// create a new post
exports.newPost = function(req, res) {
  res.render('add.jade', {
    title: req.settings.title + ' - New Post'
  , flash: req.flash()
  });
};


// edit a post
exports.editPost = function(req, res) {
   res.render('edit.jade', {
     title: req.settings.title + ' - Edit post:' + ' ' + req.post.subject
   , post: req.post
   , flash: req.flash()
   });
 };


// show one post
exports.showPost = function(req, res) {
    res.render('show.jade', {
     title: req.settings.title + ' - ' + req.post.subject
   , post: req.post
   , flash: req.flash()
   });
};


// edit a comment
exports.editComment = function(req, res) {
    res.render('editcomment.jade', {
    title: req.settings.title + ' - Editing comment from:' + ' ' + req.comment.name
  , comment: req.comment
  , flash: req.flash()
  });
};


// 404 Not Found
exports.notFound = function(req, res) {
  res.render('404.jade', {
    status: 404
  , title: '404 Not Found'
  });
};

