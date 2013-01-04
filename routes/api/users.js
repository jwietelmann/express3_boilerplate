exports.show = function(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    if(err) return res.send(500);
    res.jsonData = user;
  });
};
