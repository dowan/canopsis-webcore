/*
# Copyright (c) 2015 "Capensis" [http://www.capensis.com]
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


    var ObjectProperty = Ember.Object.extend({
        /**
         * One way binding to propagate the value change into the dict. This is not a two way binding
         */
        valueChanged: function () {
            console.log('changed', get(this, 'objecteditor.value.' + get(this, 'field')));
            set(this, 'objecteditor.value.' + get(this, 'field'), get(this, 'value'));
        }.observes('value')
    });

    var component = Ember.Component.extend({
        propertiesArray: function () {
            var properties = get(this, 'properties'),
                value = get(this, 'value');
                resultArray = Ember.A(),
                objecteditor = this;

            if(isNone(value)) {
                value = {};
            }

            var keys = Ember.keys(properties);

            for (var i = 0; i < keys.length; i++) {
                var currentKey = keys[i];
                var currentProperty = properties[currentKey];

                currentProperty.options = currentProperty;

                resultArray.pushObject(ObjectProperty.create({
                    value : value[currentKey],
                    field : currentKey,
                    model : currentProperty,
                    objecteditor: objecteditor
                }));
            }

            return resultArray;

        }.property('properties')
    });


    Ember.Application.initializer({
        name:"component-objecteditor",
        initialize: function(container, application) {
            application.register('component:component-objecteditor', component);
        }
    });

    return component;
});
