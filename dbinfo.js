///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//|*************************************************************|//
//|                                                             |//
//|                     DATABASE INFORMATION                    |//
//|                                                             |//
//|_____________________________________________________________|//
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////



// ser your mongoDB database with the following syntax: 
// username:password@databaseurl.tld:port/databasename
// if using localhost with defaults, then you can just use a db name
// note that the database doesn't even have to exist!
var dbinfo = 'username:password@databaseurl.tld:port/databasename';


// then just export this whole file as one module
module.exports.dbinfo = dbinfo;



//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
