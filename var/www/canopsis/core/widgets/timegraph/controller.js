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
    'app/application',
    'app/lib/factories/widget',
    'app/components/flotchart/component'
], function($, Ember, Application, WidgetFactory) {
    var get = Ember.get,
        set = Ember.set;

    var widgetOptions = {};

    var widget = WidgetFactory('timegraph', {
        chartOptions: undefined,
        dataSeries: [],

        timenav: false,

        init: function() {
            this._super(arguments);

            var now = +new Date();

            var config = get(this, 'config');

            set(this, 'timenav', get(config, 'timenav'));

            if(this.chartOptions === undefined) {
                this.chartOptions = {};
            }

            $.extend(this.chartOptions, {
                zoom: {
                    interactive: false
                },

                selection: {
                    mode: 'x'
                },

                crosshair: {
                    mode: 'x'
                },

                grid: {
                    hoverable: true,
                    clickable: true
                },

                xaxis: {
                    min: now - (get(config, 'time_window_offset') + get(config, 'time_window')) * 1000,
                    max: now - get(config, 'time_window') * 1000
                },

                yaxis: {
                },

                xaxes: [{
                    position: 'bottom',
                    mode: 'time',
                    timezone: 'browser'
                }],

                yaxes: [],

                legend: {
                    hideable: true,
                    legend: get(config, 'legend')
                },

                series: {
                    shadowSize: 0,
                    stack: get(config, 'stacked'),
                    lines: {
                        show: get(config, 'lines'),
                        fill: get(config, 'areas'),
                        lineWidth: get(config, 'line_width')
                    },
                    points: {
                        show: get(config, 'points'),
                        symbol: get(config, 'point_shape')
                    },
                    bars: {
                        show: get(config, 'bars'),
                        lineWidth: get(config, 'bar_width')
                    }
                },

                tooltip: get(config, 'tooltip')
            });
        }
    }, widgetOptions);

    return widget;
});
