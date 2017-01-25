# gulp-ejs-mail
Streamlined HTML email development using [ejs][ejs] and [Gulp][gulp].

A complete rewrite of my [fmail-dev](https://github.com/johnteske/fmail-dev) project, using [ejs][ejs] for better control-flow and ease of importing data.

### Requirements
* [Node.js](https://nodejs.org/)
* [Gulp][gulp]

### Set up
```
git clone https://github.com/johnteske/gulp-ejs-mail.git
cd gulp-ejs-mail
npm install
```

### Basic development commands

#### Create a new project
`gulp new --library core --project newsletter`

#### Build project
- Development: `gulp build --project newsletter`
- Distribution/testing: `gulp build --project newsletter --dist`

#### Watch project
`gulp --project newsletter`

#### Clean `build/` directory
`gulp clean`

[gulp]: http://gulpjs.com/
[ejs]: https://github.com/mde/ejs
