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
    name: 'component-dropdownbutton',
    initialize: function(container, application) {

        var set = Ember.set;

        /**
         * Global component for dropdownbutton
         *
         * @class Dropdownbutton
         * @static
         */
        var component = Ember.Component.extend({
            classNames: ['dropdown'],
            opened: false,

            actions: {
                hideContent: function() {
                    set(this, 'opened', false);
                }
            },

            didInsertElement: function() {
                var component = this;
                this.$().parents('td').css('overflow-x', 'visible').css('overflow-y', 'visible');
                this.$().mouseleave(function () {
                    set(component, 'opened', false);
                });
            }
        });

        application.register('component:component-dropdownbutton', component);
    }
});
