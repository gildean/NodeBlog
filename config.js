// CONFIG
exports.config = function(server, express){
server.configure(function(){
  server.set('views', __dirname + '/views');
  server.set('view engine', 'jade');
  server.set('view options', { pretty: true });
  server.use(express.logger());
  server.use(express.bodyParser());
  server.use(express.methodOverride());
  server.use(express.cookieParser());
  server.use(express.session({ secret: 'HJF839hrfsdjufFhj48w3hfsvfhushrfSVHydrg3547fa83yzcvwe' }));
  server.use(express.static(__dirname + '/public'));
  server.use(server.router);
});


