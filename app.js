
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , jadeBrowser = require('jade-browser')
  , socketIo = require('socket.io')
  , models = require('./models')
  , mongoose = models.mongoose
  , mongooseAuth = models.mongooseAuth
  , RedisStore = require('connect-redis')(express)
;


mongoose.connect('mongodb://localhost/boilerplate');

// create app, server, and web sockets
var app = express()
  , server = http.createServer(app)
  , io = socketIo.listen(server)
;

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  // export jade templates to reuse on client side
  app.use(jadeBrowser('/js/templates.js', ['*.jade', '*/*.jade'], { root: __dirname + '/views' }));

  // use the connect assets middleware for Snockets sugar
  app.use(require('connect-assets')());

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session({ store: new RedisStore() }));

  // mongoose-auth docs say not to add app.router to your middleware chain explicitly
  //app.use(app.router);
  app.use(mongooseAuth.middleware());
  
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


// API routes
app.get('/api/users/:id', routes.api.users.show);

// UI routes
app.get('/', routes.ui.index.list);
app.get('/auth/finish', routes.ui.auth.finish);
app.get('/users/:id', routes.ui.users.show);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
