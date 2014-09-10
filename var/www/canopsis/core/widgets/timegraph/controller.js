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

    var widgetOptions = {};

    var widget = WidgetFactory('timegraph', {
        chartOptions: undefined,
        dataSeries: [],

        timenav: false,

        init: function() {
            this._super(arguments);

            var now = +new Date();

            var config = this.get('config');

            this.set('timenav', config.get('timenav'));

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
                    min: now - (config.get('time_window_offset') + config.get('time_window')) * 1000,
                    max: now - config.get('time_window') * 1000
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
                    legend: config.get('legend')
                },

                series: {
                    shadowSize: 0,
                    stack: config.get('stacked'),
                    lines: {
                        show: config.get('lines'),
                        fill: config.get('areas'),
                        lineWidth: config.get('line_width')
                    },
                    points: {
                        show: config.get('points'),
                        symbol: config.get('point_shape')
                    },
                    bars: {
                        show: config.get('bars'),
                        lineWidth: config.get('bar_width')
                    }
                },

                tooltip: config.get('tooltip')
            });
        }
    }, widgetOptions);

    return widget;
});