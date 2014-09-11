  define([
  'jquery',
  'ember',
  'app/application'
], function($, Ember, Application) {

    /**
     * Use Component-> validators -> validate (Ember.validators["validate"]) for validation
     */
    Application.ValidationFieldMixin = Ember.Mixin.create({
        attr : "",

        willDestroyElement:function(){
            //TODO : find a better place
           // var formController  =  Canopsis.formwrapperController.form;
           // formController.set('validationFields' , Ember.A() );
        },

        init: function(){
            var form  =  Canopsis.formwrapperController.form;
            this.set('form' , form );

            var attributes = this.attr || this.content;
            this.set("attr" , attributes );

            var model = attributes.model;

            if (Ember.isNone(this.get('value')) && !Ember.isNone(this.get('attr.model.options.defaultValue'))) {
                this.set('value', this.get('attr.model.options.defaultValue'));
            }

            var type =  model.options['input_type'] || model.type;
            type = (type === 'string')? 'text' : type;
            // this.type = type;
            this._super();
        },

        registerFieldWithController: function() {
            var formController  =  Canopsis.formwrapperController.form;
            if ( formController ){
                var validationFields = formController.get('validationFields');
                if (validationFields){
                    validationFields.pushObject(this);
                }
            }
            if (formController.validateOnInsert){
                this.validate();
            }
        }.on('didInsertElement'),

        focusOut: function() {
            this.validate();
        },

        validate : function() {
            var formController  = Canopsis.formwrapperController.form;
            var FCValidation    = formController.get('validation');
            if ( FCValidation  !== undefined ) {
                var attr = this.get('attr') ;
                var valideStruct =  Ember.validators.validate(attr);
                console.log('valideStruct',valideStruct);

                if (!this.removedFromDOM){
                    var selector =  this.$();
                    selector.closest('div').next('.help-block').remove();

                    if (!valideStruct.valid) {
                        selector.closest('div').addClass('has-error').after('<span class="help-block">'+ valideStruct.error + '</span>');
                    } else {
                        selector.closest('div').removeClass('has-error');
                    }
                }
            return valideStruct;
            }
        }
    });
});
