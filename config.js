// CONFIG
exports.config = function(server, express){
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { pretty: true });
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'HJF839hrfsdjufFhj48w3hfsvfhushrfSVHydrg3547fa83yzcvwe' }));
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});
};