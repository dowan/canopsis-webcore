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
    'app/lib/mixinsregistry',
    'app/lib/utils/forms'
], function(Ember, mixinsRegistry, formsUtils) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;


    var component = Ember.Component.extend({

        selectionPreparedCount: 0,

        init: function() {
            this._super.apply(this, arguments);

            set(this, 'selectionPrepared', Ember.A());

            var content = get(this, 'content');

            for (var i = 0, l = content.length; i < l; i++) {
                var currentName = content[i];
                //DEPRECATE handle progressive deprecation of mixins as strings
                if(typeof currentName === 'string') {
                    Ember.deprecate('Defining mixins as strings is deprecated. The new format is : \'{ name: "mixinName" }\'. This is required by the mixin options system.');
                } else {
                    currentName = currentName.name;
                }
                currentName = currentName.camelize();

                get(this, 'selectionPrepared').pushObject(mixinsRegistry.getByName(currentName));
            }
        },

        /*
         * Compute a structure with classified item each time the 'items' property changed
         */
        classifiedItems: mixinsRegistry,
        selectionUnprepared: Ember.computed.alias('content'),

        recomputeSelection: function() {
            var selection = get(this, 'selectionPrepared');
            var resBuffer = Ember.A();
            for (var i = 0, l = selection.length; i < l; i++) {
                var currentItem = selection[i];
                resBuffer.pushObject({
                    name: get(currentItem, 'name')
                });
            }

            set(this, 'content', resBuffer);
        },

        actions: {
            selectItem: function() {
                this.recomputeSelection();
            },
            unselectItem: function(){
                this.recomputeSelection();
            },
            configureMixin: function(){
                console.log('configureMixin action', arguments, this);
                console.log('Show new form with context:', get(this, 'form.formContext'));
                var oldContext = get(this, 'form.formContext');
                console.log('oldContext', oldContext);
                var recordWizard = formsUtils.showNew('mixinform', {}, { previousForm: oldContext });
            }
        }
    });


    Ember.Application.initializer({
        name:"component-mixinselector",
        initialize: function(container, application) {
            application.register('component:component-mixinselector', component);
        }
    });

    return component;
});
