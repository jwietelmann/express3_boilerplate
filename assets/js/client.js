//= require jquery
//= require jquery.validate
//= require bootstrapManifest
//= require underscore
//= require backbone
//= require baseClasses
//= require_tree ./models

// bootstrap hack to stop dropdowns from disappearing on mobile
$('body').on('touchstart.dropdown', '.dropdown-menu', function (e) { e.stopPropagation(); });

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

      $('#logoutButton').on('click', function(e) {
        e.preventDefault();
        _this.logout();
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

    authSuccess: function() {
      this.setupCurrentUser();
      $('#signInModal').modal('hide');
    },

    authFailure: function() {
      alert('TODO: Implement App.authFailure()');
    },

    logout: function() {
      var _this = this;

      $.ajax({
        url: '/auth/logout',
        success: function() {
          _this.setSignedOut();
        }
      });
    }

  });

  App.init();

})(window.App);
