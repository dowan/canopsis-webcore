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
    name: 'component-tabheader',
    initialize: function(container, application) {
        var get = Ember.get;

        /**
         * @component tabheader
         */
        var component = Ember.Component.extend({
            tagName: 'li',
            attributeBindings: ['data-toggle', 'role', 'href'],
            'data-toggle': 'tab',
            'role': 'tab',

            href: function() {
                var id = get(this, 'tabContainer.elementId');
                return '#' + id + '-' + get(this, 'ref');
            }.property('tabContainer', 'ref'),


            tabContainer: Ember.computed.alias('parentView.parentView')
        });

        application.register('component:component-tabheader', component);
    }
});
