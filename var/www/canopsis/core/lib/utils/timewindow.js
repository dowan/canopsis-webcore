/**
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
    name: 'TimeWindowUtils',
    after: ['UtilityClass'],
    initialize: function(container, application) {
        var Utility = container.lookupFactory('class:utility');

        var get = Ember.get,
            isNone = Ember.isNone;

        var timewindow = Utility.create({
            default_timewindow: 86400,
            default_timewindow_offset: 0,

            getFromTo: function(time_window, time_window_offset) {
                var now = new Date().getTime();

                if (isNone(time_window)) {
                    time_window = get(this, 'default_timewindow');
                }

                if (isNone(time_window_offset)) {
                    time_window_offset = get(this, 'default_timewindow_offset');
                }

                time_window *= 1000;
                time_window_offset *= 1000;
                var from = now - time_window_offset - time_window,
                    to = now - time_window_offset;

                return [from, to];
            }
        });

        application.register('utility:timewindow', timewindow);
    }
});
