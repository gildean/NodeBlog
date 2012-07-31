NodeBlog
========

A blog engine made with node.js and mongodb database

Main use of this app is to introduce newcomers to nodejs and to show how to build a versatile app very easily.

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
* [ghm][ghm]
* [kudos][kudos]

Features:
---------
* post / edit / publish / hide / view blogposts
* the same with comments
* use github flavored markdown for comments (optionally for blogposts too)
* give kudos to blogposts
* search with tags
* beautiful html5 sematics
* spam protection with jquery
* seo friendly urls, titles, descriptions etc.


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
[ghm]: https://github.com/thomblake/github-flavored-markdown
[kudos]: https://github.com/masukomi/kudos
[Too Many Mangos]: http://toomanymangos.nodester.com
