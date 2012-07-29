NodeBlog
========

A blog engine made with node.js and mongodb database

View live demo here [Too Many Mangos][Too Many Mangos]

NodeBlog is built on:
---------------------
* [Node.js][NodeJS]
* [mongoDB][MongoDB]
* [express][express]
* [mongojs][mongojs]
* [node.bcrypt.js][bcrypt]
* [jade][jade]
* [Moment.js][moment]

How to use:
-----------

Make sure that mongodb is running somewhere and set your database-info in `dbinfo.js` (if mongo is running on localhost, you don't need to).

Install dependencies:
``` 
npm install
```
You need to copy a cert public key `cert.crt` and a private key `key.key` as files to the root of the app-folder, or change that in `app.js`.

You can then start the server with:
``` 
node app
```
When trying to log in, if no users are detected, a initial setup is presented.

You can change these settings when logged in.

Credits:
--------
All whom contributed to any part being used.

License:
--------
Unless stated elsewhere, file headers or otherwise, the license as stated in the LICENSE file.

[NodeJS]: http://nodejs.org
[MongoDB]: http://www.mongodb.org
[express]: http://expressjs.com/
[mongojs]: https://github.com/gett/mongojs
[bcrypt]: https://github.com/ncb000gt/node.bcrypt.js
[jade]: http://jade-lang.com
[moment]: http://momentjs.com/
[Too Many Mangos]: http://toomanymangos.nodester.com
