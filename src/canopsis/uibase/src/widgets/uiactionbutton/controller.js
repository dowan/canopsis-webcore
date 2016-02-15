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
    name: 'UiactionbuttonWidget',
    after: 'WidgetFactory',
    initialize: function(container, application) {
        var WidgetFactory = container.lookupFactory('factory:widget');

        /**
         * @widget Uiactionbutton
         */
        var widget = WidgetFactory('uiactionbutton',{
            tagName: 'span',
            actions: {
                /**
                 * @method actions_do
                 * @argument action
                 * @argument {array} params
                 */
                do: function(action, params) {
                    if(params === undefined || params === null){
                        params = [];
                    }

                    this.send(action, params);
                }
            }
        });

        application.register('widget:uiactionbutton', widget);
    }
});
