  define([
  'jquery',
  'ember',
  'app/application',
  'app/mixins/validationfield'
], function($, Ember, Application ) {
    Application.ValidationTextField = Ember.TextField.extend(Application.ValidationFieldMixin,{
    });

    void ($);
});
