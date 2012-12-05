
var mongoose = exports.mongoose = require('mongoose')
  , mongooseTypes = require('mongoose-types')
  , bcrypt = require('bcrypt')
  , Schema = mongoose.Schema
;
mongooseTypes.loadTypes(mongoose, "email");
var Email = Schema.Types.Email;

exports = module.exports = new Schema({

  name: { type: String },
  email: { type: Email },
  salt: { type: String },
  hash: { type: String }

});

exports.virtual('password')
  .get(function() {
    return this._password;
  })
  .set(function(password) {
    this._password = password;
    var salt = this.salt = bcrypt.genSaltSync(10);
    this.hash = bcrypt.hashSync(password, salt);
  })
;

exports.method('checkPassword', function(password, callback) {
  bcrypt.compare(password, this.hash, callback);
});

exports.static('authGuest', function(name, password, callback) {
  var user = new this({ name: name });
  user.save(function(err, user) {
    if(err) callback(err, false);
    callback(null, user);
  });
});

exports.static('registerEmail', function(name, email, password, passwordConfirm, callback) {
  if(password != passwordConfirm) return callback('PASSWORD_MISMATCH', false);
  var user = new this({ name: name, email: email, password: password });
  user.save(function(err, user) {
    if(err) callback(err, false);
    callback(null, user);
  });
});

exports.static('authEmail', function(email, password, callback) {
  this.findOne({ email: email }, function(err, user) {
    if(err) return callback(err);
    if(!user) return callback(null, false);

    user.checkPassword(password, function(err, isCorrect) {
      if(err) return callback(err);
      if(!isCorrect) return callback(null, false);
      return callback(null, user);
    });
  });
});

exports.static('authTwitter', function(token, tokenSecret, profile, callback) {
  this.findOne({ 'twitter.id': profile.id }).exec(function(err, user) {
    if(err) return callback(err);

    if(!user) user = new exports.model({ name: profile.displayName });
    user.twitter = profile;
    user.markModified('twitter');

    user.save(function(err, user) {
      if(err) return callback(err);

      return callback(null, user);
    });
  });
});

exports.static('authFacebook', function(accessToken, refreshToken, profile, callback) {
  this.findOne({ 'facebook.id': profile.id }).exec(function(err, user) {
    if(err) return callback(err);

    if(!user) user = new exports.model({ name: profile.displayName });
    user.facebook = profile;
    user.markModified('facebook');

    user.save(function(err, user) {
      if(err) return callback(err);

      return callback(null, user);
    });
  });
});
