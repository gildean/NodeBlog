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


// create a new post
exports.newPost = function(req, res) {
  res.render('add.jade', { 
    title: 'NodeBlog - New Post'
  , flash: req.flash() 
  });
};


// edit a post
exports.editPost = function(req, res) {
   res.render('edit.jade', { 
     title: 'NodeBlog - Edit post'
   , post: req.post
   , flash: req.flash()
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


// edit a comment
exports.editComment = function(req, res) {
    res.render('editcomment.jade', { 
    title: 'NodeBlog - Found these'
  , comment: req.comment
  , flash: req.flash()
  });
};


// 404 Not Found
exports.notFound = function(req, res) {
  res.render('404.jade', {
    title: '404 Not Found'  
  });
};