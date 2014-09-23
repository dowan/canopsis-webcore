  define([
  'ember',
  'app/application',
  'app/mixins/validationfield'
], function(Ember, Application, ValidationFieldMixin) {

    var view = Ember.TextArea.extend(ValidationFieldMixin, {});

    Application.ComponentValidationtextareaComponent = view;

    return view;
});
