//ROUTES TO MAIN VIEWS


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