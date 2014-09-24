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
    'app/lib/utils/forms',
    'app/controller/form',
    'app/lib/loaders/schemas',
], function($, Ember, Application, formUtils) {
    var get = Ember.get,
        set = Ember.set;

    var eventedController = Ember.Controller.extend(Ember.Evented, {

        _partials: {},

        /**
         * Override of willmergemixin to merge mixin's partials with base partials
         */
        willMergeMixin: function(Mixin) {
            this._super.apply(this, arguments);

            //TODO put this in arrayutils
            function union_arrays (x, y) {
                var obj = {};
                for (var i = x.length-1; i >= 0; -- i)
                    obj[x[i]] = x[i];
                for (var j = y.length-1; j >= 0; -- j)
                    obj[y[j]] = y[j];
                var res = [];
                for (var k in obj) {
                    if (obj.hasOwnProperty(k))  // <-- optional
                        res.push(obj[k]);
                }
                return res;
            }

            var me = this;

            if(Mixin.partials !== undefined) {
                Object.keys(Mixin.partials).forEach(function(key) {
                    console.log(key, Mixin.partials[key]);

                    var partialsKey = '_partials.' + key;

                    if(get(me, partialsKey) === undefined) {
                        set(me, partialsKey, Ember.A());
                    }

                    set(me, partialsKey, union_arrays(get(me, partialsKey), Mixin.partials[key]));
                });
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
            }
        },

        partials: {
            buttons: ["formbutton-cancel", "formbutton-submit"]
        },

        title: function() {
            console.warn("Property \"title\" must be defined on the concrete class.");

            return "<Untitled form>";
        }.property()
    });

    Application.FormController = controller;

    return controller;
});
