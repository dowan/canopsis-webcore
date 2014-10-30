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
    'jquery',
    'ember',
    'app/lib/wrappers/flotchart'
], function($, Ember) {

    var get = Ember.get,
        set = Ember.set;

    var component = Ember.Component.extend({
        tagName: 'div',
        classNames: 'flotchart',

        options: undefined,
        series: undefined,

        onDataUpdate: function() {
            var chart = get(this, 'chart');

            if(chart !== undefined) {
                this.send('renderChart');
            }
        }.observes('series.@each'),

        onOptionsUpdate: function() {
            var chart = get(this, 'chart');

            if(chart !== undefined) {
                chart.destroy();

                set(this, 'chart', undefined);
                this.send('renderChart');
            }
        }.observes('options'),

        didInsertElement: function() {
            this.send('renderChart');
        },

        actions: {
            renderChart: function() {
                var chart = get(this, 'chart');

                if(chart !== undefined) {
                    console.log('Render chart');
                    chart.setData(get(this, 'series'));
                    chart.setupGrid();
                    chart.draw();
                }
                else {
                    this.createChart();
                }
            }
        },

        createChart: function() {
            console.log('createChart');

            var plotcontainer = this.$();
            var series = get(this, 'series');
            var options = get(this, 'options');

            if(options && options.legend && options.legend.show && options.legend.labelFormatter === undefined) {
                options.legend.labelFormatter = function(label, serie) {
                    return label;
                };
            }

            set(this, 'chart', $.plot(plotcontainer, series, options));
        }
    });

    Ember.Application.initializer({
        name: 'component-flotchart',
        initialize: function(container, application) {
            application.register('component:component-flotchart', component);
        }
    });

    return component;
});
