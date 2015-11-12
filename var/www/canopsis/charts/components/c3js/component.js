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
    name: 'c3jsComponent',
    initialize: function(container, application) {
        var get = Ember.get,
            set = Ember.set,
            isNone = Ember.isNone;

        var component = Ember.Component.extend({
            render: function() {
                var series = get(this, 'series'),
                    chart = get(this, 'chart'),
                    element = this.$();

                if (!isNone(chart)) {
                    chart.destroy();
                }

                set(series, 'bindto', element);
                chart = c3.generate(series);

                set(this, 'chart', chart);
            }.observes('series'),

            willDestroyElement: function() {
                var chart = get(this, 'chart');

                if (!isNone (chart)) {
                    chart.destroy();
                }
            }
        });

        application.register('component:component-c3js', component);
    }
});
