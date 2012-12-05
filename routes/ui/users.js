var users = require('../api/users');

exports.show = function(req, res) {
  users.show(req, res, function() { 
    res.render('users/show');
  });
};
