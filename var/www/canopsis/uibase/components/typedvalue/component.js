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
    'app/lib/utils/types'
], function(Ember, typesUtils) {

    var get = Ember.get,
        set = Ember.set;


    var component = Ember.Component.extend({

        init: function () {
            this._super();
            set(this, 'selectedValueType','String');
            set(this, 'valuesTypes',[
                'String',
                'Number',
                'Boolean',
                //'Array',
            ]);

            var startValue;
            var startContent;

            console.log('Init content for typed value is', get(this, 'content'));

            if (Ember.isNone(get(this, 'content'))) {

                startValue = '';
                startContent = '';

            } else {

                startContent = startValue = get(this, 'content');
                //Intialize type value from content type
                var valueType = (typeof startValue).capitalize();
/* TODO complete or change array management

                //User translation... tranform array data to match typed array system
                if (valueType === 'Object') {

                    valueType = 'Array';
                    var newStartValue = [];

                    //Making an object list instead a string list (required for ember template)
                    for(var i=0; i<startValue.length; i++) {
                        newStartValue.push({
                            value: startValue[i]
                        });
                    }
                    //When new object array ready, just replace
                    startValue = newStartValue;
                }
*/
                set(this, 'selectedValueType', valueType);
            }

            set(this, 'content', startContent);
            set(this, 'value', startValue);

        },



        updateContent: function () {
            console.log('get content from typed value:', get(this, 'value'));

            //Transform value to right typed value depending on wished type
            var value = typesUtils.castValue(
                get(this, 'value'),
                get(this, 'selectedValueType')
            );

            /*
            //Transform typedvalue object array to simple string array.
            var userArray = [];
            if(typeof value === 'object') {
                console.log('we have an array type, let convert typed value to simple string array');
                for (var i=0; i<value.length; i++) {
                    console.log('Array value is', value[i].value);
                    userArray.push(value[i].value);
                }
                console.log('computed array is', userArray);
                value = userArray;
            }
            */
            set(this, 'content', value);

            //contentType value is for debug purpose
            set(this, 'contentType', typeof value);


        }.observes('value'),

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
                set(this, 'value', ['']);
            }

            console.log('updated content type with value', get(this, 'value'));

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

        actions : {

            switchContentValue: function () {
                set(this, 'value', !get(this, 'value'));
                console.log('switched boolean value', get(this, 'value'));
            },

            addListElement:function (){
                get(this, 'value').pushObject('');
            },

            removeItem: function (listElement) {
                get(this, 'value').removeObject(listElement);
            },

        }

    });

    Ember.Application.initializer({
        name:"component-typedvalue",
        initialize: function(container, application) {
            application.register('component:component-typedvalue', component);
        }
    });

    return component;
});
