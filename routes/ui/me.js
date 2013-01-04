var me = require('../api/me');

exports.show = function(req, res) {
  me.show(req, res, function() {
    res.render('me/index', { title: "Profile", user: req.user });
  });
};

exports.update = function(req, res) {
  me.update(req, res, function() {
    res.redirect('/me');
  });
};
