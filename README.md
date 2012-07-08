NodeBlog
========

A blog engine made with node.js and mongodb database

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

Make sure that mongodb is running, then install dependencies with 
``` 
npm install
```
Then start the server with
``` 
node app
```
When trying to log in, if no users are detected, a new one is then created (this means the app is vulnerable before a user is created).

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