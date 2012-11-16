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

  App.Collections.Base = Backbone.Collection.extend({

    // This method is like 'reset' but fires the correct remove/change/add events
    // NOTE: The `models` param should be an array of vanilla objects
    noisyReset: function(models) {
      if(!models) return;

      var oldModelIds = this.pluck('id');
      var newModelIds = _.pluck(models, '_id');

      // remove all the stuff that was in the collection but not in the new set of models
      // this will trigger 'remove' on each removed model
      var modelsToRemove = _.difference(oldModelIds, newModelIds);
      this.remove(modelsToRemove);

      // now we'll add and change...
      for(var i = 0; i < models.length; i++) {
        var modelAttributes = models[i];

        var existingModel = this.get(modelAttributes[this.model.prototype.idAttribute]);
        // if the model is already present, update it
        // this will trigger 'change' if there are differences
        if(existingModel) {
          existingModel.set(modelAttributes);
        }
        // otherwise this is a new model, add it
        // this will trigger 'add' for each new model
        else {
          this.add(modelAttributes);
        }
      }
    }
  });

  App.Views.Base = Backbone.View.extend({

    template: null,

    render: function() {
      var viewParams = this.model.toJSON();
      this.$el.html(jade.templates[this.template + '.jade'](viewParams));
      this.delegateEvents();
      return this;
    }
  });
  
  App.Routers.Base = Backbone.Router.extend({});

})(window.App = {});
