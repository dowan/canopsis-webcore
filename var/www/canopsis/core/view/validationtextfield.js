  define([
  'ember',
  'app/mixins/validationfield'
], function(Ember, ValidationFieldMixin) {


    //TODO move this to components dir

    var component = Ember.TextField.extend(ValidationFieldMixin, {});


    loader.register('component:component-validationtextfield', component);

    return component;
});
