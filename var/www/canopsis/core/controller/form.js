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
    'app/lib/utils/forms',
    'app/lib/utils/debug'
], function($, Ember, formUtils, debugUtils) {

    var get = Ember.get,
        set = Ember.set;


    var eventedController = Ember.Controller.extend(Ember.Evented, {

        mergedProperties: ['partials'],

        _partials: {},

        refreshPartialsList: function() {
            console.log('refreshPartialsList', get(this, 'partials'));
            var partials = get(this, 'partials');
            set(this, '_partials', partials);
            var mixins = get(this, 'content.mixins');

            if(Ember.isArray(mixins)) {
                for (var i = 0, l = mixins.length; i < l; i++) {
                    partials = this.mergeMixinPartials(mixins[i], partials);
                }
            }

            console.log('set partials for ', this, ' --> ', partials);
            set(this, '_partials', partials);
        },


        mergeMixinPartials: function(Mixin, partials) {
            var me = this;

            console.log("mergeMixinPartials mixin:", Mixin);
            if(mixinsRegistry.getByName(Mixin.decamelize())) {
                var partialsToAdd = mixinsRegistry.getByName(Mixin.decamelize()).EmberClass.mixins[0].properties.partials;

                for (var k in partialsToAdd) {
                    if (partialsToAdd.hasOwnProperty(k)) {
                        var partialsArray = partialsToAdd[k];

                        var partialKey = '_partials.' + k;
                        set(this, partialKey, union_arrays(get(this, partialKey), partialsArray));
                    }
                }
                return partials;
            }
        }
    });
    /*
        Default is to display all fields of a given model if they are referenced into category list (in model)
        options: is an object that can hold a set dictionnary of values to override
            - filters: is a list of keys to filter the fields that can be displayed
            - override_labels is an object that helps translate fields to display in form
            - callback, witch is called once form sent
            - plain ajax contains information that will be used insted of ember data mechanism
    */
    var controller = eventedController.extend({
        needs: ['application'],

        init: function() {
            var formParent = get(this, 'formParent');
            set(this, 'previousForm', formParent);

            this._super.apply(this, arguments);
        },

        /*
         * Deferred to help manage form callbacks. You can implement :
         *  - done
         *  - always
         *  - fail
         *
         * with the form :
         * myForm.submit.done(function(){ [code here] })
         *
         * Caution: FormController#submit is NOT FormController#_actions#submit
         */
        submit: $.Deferred(),
        actions: {
            previousForm: function() {
                var previousForm = get(this, 'previousForm');

                console.log('previousForm', previousForm, this);
                formUtils.showInstance(previousForm);
            },

            show: function() {
                //reset submit defered
                this.submit = $.Deferred();
            },

            submit: function() {
                console.log("onsubmit", this.formParent);

                if (this.formParent !== undefined) {
                    this.formParent.send('submit', arguments);
                }
                else {
                    console.log("resolve modelform submit");
                    if ( this.confirmation ){
                        var record = this.formContext;
                        formUtils.showNew('confirmform', record , { title : " confirmation "  , newRecord : arguments[0]});
                    } else {
                        this.submit.resolve(this, arguments);
                        get(this, 'formwrapper').trigger("hide");
                    }
                }
            },

            abort: function() {
                if(this.formParent !== undefined) {
                    this.formParent.send('abort', arguments);
                } else {
                    console.log('rejecting submit promise');
                    this.submit.reject();
                }
            },

            inspectForm: function() {
                console.group('inspectForm');
                console.log('form:', this);

                debugUtils.inspectObject(get(this, 'categorized_attributes'));

                console.log('categorized_attributes available in $E');

                console.groupEnd();
            }
        },

        partials: {
            buttons: ["formbutton-cancel"],
            debugButtons: ['formbutton-inspectform']
        },

        title: function() {
            console.warn("Property \"title\" must be defined on the concrete class.");

            return "<Untitled form>";
        }.property()
    });

    loader.register('controller:form', controller);

    return controller;
});
