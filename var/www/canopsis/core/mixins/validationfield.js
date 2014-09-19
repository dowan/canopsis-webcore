/*
# Copyright (c) 2014 "Capensis" [http://www.capensis.com]
#
# This file is part of Canopsis.
#
# Canopsis is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Canopsis is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with Canopsis. If not, see <http://www.gnu.org/licenses/>.
*/
define([
    'jquery',
    'ember',
    'app/application',
    'app/lib/formsmanager'
], function($, Ember, Application, formsmanager) {

    /**
     * Use Component-> validators -> validate (Ember.validators["validate"]) for validation
     */
    Application.ValidationFieldMixin = Ember.Mixin.create({
        attr : "",

        willDestroyElement:function(){
            //TODO : find a better place
           // var formController  =  formsmanager.formwrapper.form;
           // formController.set('validationFields' , Ember.A() );
        },

        init: function(){
            var form  =  formsmanager.formwrapper.form;
            this.set('form' , form );

            var attributes = this.attr || this.content;
            this.set("attr" , attributes );

            var model = attributes.model;

            if (Ember.isNone(this.get('value')) && !Ember.isNone(this.get('attr.model.options.defaultValue'))) {
                this.set('value', this.get('attr.model.options.defaultValue'));
            }

            var type =  model.options.input_type || model.type;
            type = (type === 'string')? 'text' : type;
            // this.type = type;
            this._super();
        },

        registerFieldWithController: function() {
            var formController  =  formsmanager.formwrapper.form;
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
            var formController  = formsmanager.formwrapper.form;
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
