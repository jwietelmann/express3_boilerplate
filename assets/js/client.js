//= require bootstrap-manifest
//= require underscore
//= require backbone

window.Boiler = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  Mixins: {}
};

Boiler.Models.Base = Backbone.Model.extend({
  idAttribute: '_id',
  urlRoot: function() {
    return '/api/' + this.resource;
  }
});

Boiler.Collections.Base = Backbone.Collection.extend({});
Boiler.Views.Base = Backbone.View.extend({});
Boiler.Routers.Base = Backbone.Router.extend({});

Boiler.Models.User = Boiler.Models.Base.extend({});
Boiler.Models.Me = Boiler.Models.User.extend({
  url: function() { return '/api/me' }
});

window.App = {

  init: function() {
    var _this = this;

    $(function() {
      _this.docReady();
    });
  },

  docReady: function() {
    var _this = this;

    this.setupCurrentUser();

    $('#signOut').on('click', function(e) {
      _this.signOut();
    });
  },

  setSignedIn: function() {
    var name = this.user.get('name');
    $('#currentUser').text(name ? name : '_NAME_');
    $('body').removeClass('noUser').addClass('hasUser');
  },

  setSignedOut: function() {
    this.user.clear();
    $('body').removeClass('hasUser').addClass('noUser');
  },

  setupCurrentUser: function() {
    var _this = this;

    this.user = new Boiler.Models.Me();
    this.user.fetch({
      success: function(user) {
        _this[user.id ? 'setSignedIn' : 'setSignedOut']();
        $('body').removeClass('userNotFetched');
      }
    });
  },

  signInComplete: function() {
    this.setupCurrentUser();
    $('#signInModal').modal('hide');
  },

  signOut: function() {
    var _this = this;

    $.ajax({
      url: '/auth/signOut',
      success: function() {
        _this.setSignedOut();
      }
    });
  }

};

App.init(); // start the app
