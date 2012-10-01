
var mongoose = exports.mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , mongooseAuth = exports.mongooseAuth = require('mongoose-3x-auth')
  , UserSchema
  , User
;

UserSchema = new Schema({});

UserSchema.plugin(mongooseAuth, {
  everymodule: {
    everyauth: {
      User: function() {
        return User;
      }
    }
  },
  password: {
    loginWith: 'email',
    everyauth: {
      getLoginPath: '/auth/login',
      postLoginPath: '/auth/login',
      loginView: 'auth/login',
      getRegisterPath: '/auth/register',
      postRegisterPath: '/auth/register',
      registerView: 'auth/register',
      loginSuccessRedirect: '/auth/finish',
      registerSuccessRedirect: '/auth/finish'
    }
  },
  facebook: {
    everyauth: {
      myHostname: 'http://localhost:3000',
      appId: 'myAppID',
      appSecret: 'myAppSecret',
      redirectPath: '/auth/finish'
    }
  } 
});

User = exports.User = mongoose.model('User', UserSchema);
