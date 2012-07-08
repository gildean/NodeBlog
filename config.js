//CONFIG
exports.config = function(app, express){
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { pretty: true });
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'sessioncookie' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

  app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

  });

  app.configure('production', function(){
    app.use(express.errorHandler());

  });

};