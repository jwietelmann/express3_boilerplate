//= require jquery
//= require bootstrapManifest
//= require underscore
//= require backbone
//= require baseClasses
//= require_tree ./models

(function(App) {

  _.extend(App, {

    init: function() {
      var _this = this;

      $(function() {
        _this.docReady();
      });
    },

    docReady: function() {
      var _this = this;

      this.setupCurrentUser();

      $('#signOutButton').on('click', function(e) {
        e.preventDefault();
        _this.signOut();
      });
    },

    setSignedIn: function() {
      $('#currentUser').text(this.user.get('name'));
      $('body').removeClass('noUser').addClass('hasUser');
    },

    setSignedOut: function() {
      this.user.clear();
      $('body').removeClass('hasUser').addClass('noUser');
    },

    setupCurrentUser: function() {
      var _this = this;

      this.user = new App.Models.Me();
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

  });

  App.init();

})(window.App);
