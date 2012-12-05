exports.show = function(req, res, next) {
  res.jsonData = req.user ? req.user : {};
  next();
};

exports.update = function(req, res, next) {
  var user = req.user;
  user.email = req.body.email;
  user.save(function(err, user) {
    if(err) return res.send(500);
    req.apiData = user;
    next();
  });
};
