
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
  , User = models.User
  , mongoose = models.mongoose
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  //, FacebookStrategy = require('passport-facebook').Strategy
  //, TwitterStrategy = require('passport-twitter').Strategy
  , RedisStore = require('connect-redis')(express)
;

// set up passport authentication
passport.use(new LocalStrategy(
  {
    usernameField: 'email'
  },
  function(email, password, done) {
    process.nextTick(function() {
      User.authEmail(email, password, function(err, user) {
        return done(err, user);
      });
    });
  }
));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// connect the database
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
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


// API routes
app.get('/api/me', routes.api.me.show);
app.get('/api/users/:id', routes.api.users.show);

// UI routes
app.get('/', routes.ui.index.list);
app.post('/auth/register', routes.ui.auth.register);
app.post('/auth/email',
  passport.authenticate('local', { failureRedirect: '/auth/email', failureFlash: true }),
  function(req, res) {
    res.redirect('/auth/finish');
  }
);
app.get('/auth/finish', routes.ui.auth.finish);
app.get('/auth/signOut', routes.ui.auth.signOut);
app.get('/users/:id', routes.ui.users.show);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
