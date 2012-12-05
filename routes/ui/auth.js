var passport = require('passport')
  , User = require("../../models").User
;

exports.guest = passport.authenticate('guest', {
  successRedirect: '/auth/success',
  failureRedirect: '/auth/failure',
  failureFlash: true
});

exports.email = passport.authenticate('email', {
  successRedirect: '/auth/success',
  failureRedirect: '/auth/failure',
  failureFlash: true
});

exports.registerEmail = function(req, res) {
  User.registerEmail(req.body.name, req.body.email, req.body.password, req.body.passwordConfirm,
    function(err, user) {
      if(err) return res.send(500);
      exports.email(req, res);
    }
  );
};

exports.logout = function(req, res) {
  req.logout();
  res.send(200);
}

exports.success = function(req, res) {
  res.send('<script type="text/javascript">window.opener.App.authSuccess(); window.close();</script>')
};

exports.failure = function(req, res) {
  res.send('<script type="text/javascript">window.opener.App.authFailure(); window.close();</script>');
};
