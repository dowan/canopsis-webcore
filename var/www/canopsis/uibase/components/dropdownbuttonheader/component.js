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

Ember.Application.initializer({
    name:"component-dropdownbuttonheader",
    initialize: function(container, application) {
        var get = Ember.get,
            set = Ember.set;

        /**
         * Component that contains the title and optional other components
         * for dropdownbutton
         *
         * @class Dropdownbuttonheader
         * @static
         */
        var component = Ember.Component.extend({
            tagName: 'a',
            classNameBindings: ['classAttribute'],

            classAttribute: function() {
                var opened = get(this, 'parentView.opened'),
                    res = 'btn btn-secondary dropdown-toggle opening';

                if(opened) {
                    res += ' active';
                }

                return res;
            }.property('parentView.opened'),

            attributeBindings: ['aria-expanded'],
            'aria-expanded': 'true',

             /**
              * method calling toggle method on click
              * @method click
              */
            click: function(){
                this.toggle();
            },

            /**
             * Method to switch boolean value of opened attribute
             * @method toggle
             */
            toggle: function(){
                this.toggleProperty('parentView.opened');
            }
        });

        application.register('component:component-dropdownbuttonheader', component);
    }
});
