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
    'ember',
    'app/application',
    'app/lib/utils/forms',
    'app/lib/utils/slug'
], function(Ember, Application , formUtils , slugify) {

    /**
     * Implements Validation in form
     * You should define on the validationFields
     * @mixin
     */
    var mixin = Ember.Mixin.create({

        validationFields: function() {
            console.warn("Property \"validationFields\" must be defined on the concrete class.");

            return "<validationFields is null>";
        },

        changeTAB: function( name , active){
            var toFind = "#"+name+"_tab";
            if(active)
                $( toFind ).addClass("active");
            else
                $( toFind ).removeClass("active");


            var id = "#"+name;
            if(active)
                $( id ).addClass("active");
            else
                $( id ).removeClass("active");
        },

        set_tab: function(last_field_error){
            var categories = this.categories;

            for (var i = 0 ; i < categories.length ; i++){
                var current = categories[i];
                this.changeTAB( current.slug , false );
                current.set("isDefault", false);
            }
    outer:  for (var i = 0 ; i < categories.length ; i++){
                var current = categories[i];

                for (var j = 0 ; j < current.keys.length ; j++){
                    var key = current.keys[j];
                    var field = key.field;

                    if (field === last_field_error ){
                        this.changeTAB( current.slug , true );
                        current.set("isDefault", true);

                        break outer;
                    }
                }
            }
        },

        empty_validationFields: function() {
            this.set('validationFields' , Ember.A() );
        },

        validation: function() {
            console.log("Enter validation MIXIN");
            var validationFields = this.get("validationFields");
            var isValid = true;
            var error_array = [];
            var last_field_error ="";
            var form = this;

            if (validationFields) {
                for (var z = 0; z < validationFields.length; z++) {
                    console.log("validate on : ", validationFields[z]);
                    var current = validationFields[z].validate();

                    if (current.valid !== true) {
                        error_array.push(current);
                        console.log("Can't validate on attr ",validationFields[z]);
                        last_field_error = validationFields[z].attr.field || validationFields[z].attr.parent.attr.field;
                        isValid =  false ;

                        if (validationFields[z].removedFromDOM){
                            //var form = validationFields[z].get('form');
                            form.validateOnInsert = true;
                            formUtils.showInstance(form);
                            break;
                        }
                    }
                }
            }
            if( !isValid ){
                this.set_tab(last_field_error);
            }
            return isValid;
        }
    });

    Application.ValidationMixin = mixin;
    return mixin;
});
