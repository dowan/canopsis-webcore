  define([
  'ember',
  'app/mixins/validationfield'
], function(Ember, ValidationFieldMixin) {

    //TODO move this to components dir

    var component = Ember.TextArea.extend(ValidationFieldMixin, {});


    loader.register('component:component-validationtextarea', component);

    return component;
});
