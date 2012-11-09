var passport = require('passport')
  , User = require("../../models").User
;

exports.email = passport.authenticate('local', {
  successRedirect: '/auth/finish',
  failureRedirect: '/auth/email',
  failureFlash: true 
});

exports.register = function(req, res) {
  User.registerEmail(req.body.name, req.body.email, req.body.password, req.body.passwordConfirm,
    function(err, user) {
      if(err) return res.send(500);
      exports.email(req, res);
    }
  );
};

exports.signOut = function(req, res) {
  req.logout();
  res.send(200);
}

exports.finish = function(req, res) {
  res.send('<script type="text/javascript">window.opener.App.signInComplete(); window.close();</script>')
};
