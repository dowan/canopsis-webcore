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
    'ember-data',
    'app/application',
    'app/lib/factories/widget',
    'app/components/flotchart/component',
    'app/controller/serie'
], function($, Ember, DS, Application, WidgetFactory) {
    var get = Ember.get,
        set = Ember.set;

    var widgetOptions = {};

    var widget = WidgetFactory('timegraph', {
        needs: ['serie'],
        chartOptions: undefined,
        dataSeries: [],

        timenav: false,

        init: function() {
            this._super();

            var me = this;
            var now = +new Date();
            var config = get(this, 'config');
            var store = DS.Store.create({
                container: get(this, 'container')
            });

            set(this, 'widgetDataStore', store);

            console.group('timegraph init');

            var stylizedseries = get(config, 'series');

            var serieIds = [];
            for(var i = 0, l = stylizedseries.length; i < l; i++) {
                serieIds.push(stylizedseries[i].serie);
            }

            console.log('Fetch series:', serieIds);
            serieIds = JSON.stringify(serieIds);

            store.findQuery('serie', {ids: serieIds}).then(function(result) {
                var series = [];
                set(me, 'series', series);

                for(var i, l = result.meta.total; i < l; i++) {
                    var serie = result.content[i];
                    series.pushObject(serie);
                }
            });

            set(this, 'timenav', get(config, 'timenav'));

            chartOptions = get(this, 'chartOptions') || {};

            $.extend(chartOptions, {
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

                tooltip: get(config, 'tooltip')
            });

            console.log('Configure chart:', chartOptions);
            set(this, 'chartOptions', chartOptions);

            console.groupEnd();
        }
    }, widgetOptions);

    return widget;
});
