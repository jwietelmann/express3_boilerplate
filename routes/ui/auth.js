exports.finish = function(req, res) {
  res.send('<script type="text/javascript">window.parent.App.signInComplete(); window.close();</script>')
};
