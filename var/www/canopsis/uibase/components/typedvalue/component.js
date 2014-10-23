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
    'app/lib/utils/types'
], function(Ember, Application, typesUtils) {

    var get = Ember.get,
        set = Ember.set;


    var component = Ember.Component.extend({


        'selectedValueType': 'String',
        'valuesTypes': [
            'String',
            'Number',
            'Boolean',
            'Array',
        ],

        init: function () {

            console.log('initialized typed value component', this);

        },

        /*
        content: function () {
            console.log('get content from typed value:', get(this, 'content'));
            var value = typesUtils.castValue(get(this, 'content'), get(this, 'selectedValueType'));
            console.log('computed content from typed value:', value);
            return value;
        }.property(),
        */

        placeholder: function () {

            var text = 'Type a value';
            switch (get(this, 'selectedValueType')) {
                case 'Boolean':text = 'Use either "true" or "false"';break;
                case 'Number':text = 'Use an integer value or a decimal';break;
                case 'Array':text = 'Use comma separated values';break;
            }

            return __(text);

        }.property('selectedValueType'),

        updateContentType: function () {

            var type = get(this, 'selectedValueType');

            if (type === 'String') {
                set(this, 'value', '');
            }
            if (type === 'Number') {
                set(this, 'value', 0);
            }
            if (type === 'Boolean') {
                set(this, 'value', true);
            }
            if (type === 'Array') {
                set(this, 'value', []);
            }

            console.log('updated content type with value', get(this, 'content'));

        }.observes('selectedValueType'),


        useTextField: function () {
            return get(this, 'selectedValueType') === 'String' || get(this, 'selectedValueType') === 'Number';
        }.property('selectedValueType'),

        useBoolean: function () {
            return get(this, 'selectedValueType') === 'Boolean';
        }.property('selectedValueType'),

        useArray: function () {
            return get(this, 'selectedValueType') === 'Array';
        }.property('selectedValueType'),

        /*
        content: function () {
            console.log('updated content value', get(this, 'value'));
        }.observes('value'),
        */
        actions : {
            switchContentValue: function () {
                set(this, 'value', !get(this, 'content'));
                console.log('switched boolean value', get(this, 'value'));
            },

            addListElement:function (){
                get(this, 'content').pushObject('');
            }
        }

    });

    Application.ComponentTypedvalueComponent = component;

    return component;
});
