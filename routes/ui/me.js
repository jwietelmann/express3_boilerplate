

exports.index = function(req, res) {
  res.render('me/index', { title: "Profile", user: req.user });
};

exports.update = function(req, res) {
  var user = req.user;
  user.email = req.body.email;
  user.email = req.body.email;
  user.save(function(err, user) {
    res.redirect('/me');
  });
};
