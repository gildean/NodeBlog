// REDIRECT HTTP TO HTTPS

// module depencies
var express = require('express');
var http = express.createServer();


// set up a route to redirect http to https
// the port argument replacing can be removed if default http and https ports are used
// this is just for the demo, so the ports are just replaced instead
http.get('*',function(req,res){  
	var str = req.header('host');
	str = str.replace( /:3005/g, ":3004" ); // remove or edit this line if default ports or port forwarding is used
    res.redirect('https://' + str + req.url )
});


// proxy up
http.listen(3005); // change the http-port here, or forward your ports 


// export this thingamajig as a module
module.exports.http = http;
