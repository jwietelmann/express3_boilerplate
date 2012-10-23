
var mongoose = exports.mongoose = require('mongoose')
  , mongooseTypes = require('mongoose-types')
  , bcrypt = require('bcrypt')
  , Schema = mongoose.Schema
  , mongooseAuth = exports.mongooseAuth = require('mongoose-3x-auth')
  , UserSchema
  , User
;
mongooseTypes.loadTypes(mongoose, "email");
var Email = Schema.Types.Email;

UserSchema = new Schema({

  name: { type: String },
  email: { type: Email },
  salt: { type: String },
  hash: { type: String }

});

UserSchema.virtual('password')
  .get(function() {
    return this._password;
  })
  .set(function(password) {
    this._password = password;
    var salt = this.salt = bcrypt.genSaltSync(10);
    this.hash = bcrypt.hashSync(password, salt);
  })
;

UserSchema.method('checkPassword', function(password, callback) {
  bcrypt.compare(password, this.hash, callback);
});

UserSchema.static('registerEmail', function(email, password, passwordConfirm, callback) {
  if(password != passwordConfirm) return callback('PASSWORD_MISMATCH', false);
  var user = new this({ email: email, password: password });
  user.save(function(err, user) {
    if(err) callback(err, false);
    callback(null, user);
  });
});

UserSchema.static('authEmail', function(email, password, callback) {
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

 User = module.exports = mongoose.model('User', UserSchema);
