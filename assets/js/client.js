//= require bootstrap-manifest
//= require underscore
//= require backbone

window.App = {

  init: function() {
    var _this = this;

    $(function() {
      _this.docReady();
    });
  },

  docReady: function() {
    var _this = this;

    
  },

  signIn: function() {

    
  },

  signInComplete: function() {

    $('body').removeClass('noUser').addClass('hasUser');
  }

};

App.init(); // start the app
