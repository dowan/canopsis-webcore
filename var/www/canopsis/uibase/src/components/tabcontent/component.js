/*
 * Copyright (c) 2015 "Capensis" [http://www.capensis.com]
 *
 * This file is part of Canopsis.
 *
 * Canopsis is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Canopsis is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Canopsis. If not, see <http://www.gnu.org/licenses/>.
 */


Ember.Application.initializer({
    name: 'component-tabcontent',
    initialize: function(container, application) {
        var get = Ember.get,
            set = Ember.set;

        /**
         * @component tabscontent
         */
        var component = Ember.Component.extend({
            tabContainer: Ember.computed.alias('parentView.parentView'),
            classNames: ['tab-pane'],
            attributeBindings: ['role'],
            'role': 'tab',

            init: function() {
                set(this, 'elementId', get(this, 'tabContainer.elementId') + '-' + get(this, 'ref'));
                if(get(this, 'active') && get(this, 'active') === true) {
                    get(this, 'classNames').pushObject('active');
                } else {
                    get(this, 'classNames').removeObject('active');
                }
                this._super();
            }
        });

        application.register('component:component-tabcontent', component);
    }
});
