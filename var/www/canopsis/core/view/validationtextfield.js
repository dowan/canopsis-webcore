  define([
  'ember',
  'app/application',
  'app/mixins/validationfield'
], function(Ember, Application, ValidationFieldMixin) {

    var view = Ember.TextField.extend(ValidationFieldMixin, {});

    Application.ComponentValidationtextfieldComponent = view;

    return view;
});
