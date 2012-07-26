// CONFIG
exports.config = function(app, express){
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine','jade');
  app.set('view options',{ pretty: true });
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'SHVd8uh8fhsdf8fvch7uwhksduhsdFhsyuvnwfh8hnsuher8vvdsvSHudcvsswef32q54sd' }));
  app.use(express.static(__dirname+'/public')); 
  app.use(app.router);
});
};