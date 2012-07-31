//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//|************************************************************|//
//|                                                            |//
//|                  EXPRESS SERVER CONFIG                     |//
//|                                                            |//
//|____________________________________________________________|//
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////


// let's just export this whole thing as one function
// note that we offer all the reuirements from the main app
exports.config = function(app, express, moment, ghm){
  

  // helpful helper is helpful (these can be used when rendering the views etc.)
  app.helpers({
    moment: moment,
    md: function(text){
      return ghm.parse(text);}
  });
  
  app.dynamicHelpers({
    user: function(req, res) {
      return req.session.user;
    }
  });
  

  // express main configuration
  app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine','jade');
    app.set('view options',{ pretty: true });
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'nosecrets'}));
    app.use(express.static(__dirname+'/public')); 
    app.use(app.router);
  });

};