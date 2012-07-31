///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//|*************************************************************|//
//|                                                             |//
//|                     DATABASE INFORMATION                    |//
//|                                                             |//
//|_____________________________________________________________|//
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////



// ser your mongoDB database connection info here, the syntax is as follows: 
// username:password@databaseurl.tld:port/databasename
// if using localhost and default port, then you can just point to a db name
// note that the database doesn't even have to exist!
var dbinfo = 'username:password0mongodb.address.com:porthere/databasename';


// then just export this whole file as one module
module.exports.dbinfo = dbinfo;
