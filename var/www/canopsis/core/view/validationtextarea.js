  define([
  'jquery',
  'ember',
  'app/application',
  'app/mixins/validationfield'
], function($, Ember, Application) {
    Application.ValidationTextArea = Ember.TextArea.extend(Application.ValidationFieldMixin,{
    });

    void ($);
});
