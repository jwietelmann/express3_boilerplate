
(function(App) {

  App.Models.User = App.Models.Base.extend({

    resource: 'users'

  });

  // override for current user
  App.Models.Me = App.Models.User.extend({

    url: function() { return '/api/me' }
    
  });

})(window.App);
