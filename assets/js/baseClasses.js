(function(App) {

  App.Models = {};
  App.Collections = {};
  App.Views = {};
  App.Routers = {};
  App.Mixins = {};

  App.Models.Base = Backbone.Model.extend({

    idAttribute: '_id',
    
    urlRoot: function() {
      return '/api/' + this.resource;
    }
  });

  App.Collections.Base = Backbone.Collection.extend({});
  App.Views.Base = Backbone.View.extend({});
  App.Routers.Base = Backbone.Router.extend({});

})(window.App = {});
