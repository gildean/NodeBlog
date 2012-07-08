var express = require('express');
var http = express.createServer();

// set up a route to redirect http to https


http.get('*',function(req,res){  
	var str = req.header('host');
	str = str.replace( /:3005/g, ":3004" );
    res.redirect('https://' + str )
})

// proxy up
http.listen(3005);

module.exports.http = http;