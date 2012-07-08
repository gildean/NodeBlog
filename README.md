NodeBlog
========

A blog engine made with node.js and express with mongodb database

NodeBlog is built on:
---------------------
* [Node.js][NodeJS]
* [MongoDB][MongoDB]
* [express][express]
* [mongojs][mongojs]
* [node.bcrypt.js][bcrypt]
* [jade][jade]
* [Moment.js][moment]

How to use:
-----------

Make sure that mongodb is running, then install depencies with 
``` 
npm install
```
Then run 
``` 
node app
```
When trying to log in, if no users are detected, a new one is then created (this means the app is vulnerable before a user is created).

Credits:
--------
All whom contributed to any part being used.

License:
--------
DWTFYW

[NodeJS]: http://nodejs.org
[MongoDB]: http://www.mongodb.org
[express]: http://expressjs.com/
[mongojs]: https://github.com/gett/mongojs
[bcrypt]: https://github.com/ncb000gt/node.bcrypt.js
[jade]: http://jade-lang.com
[moment]: http://momentjs.com/