/*
# Copyright (c) 2015 "Capensis" [http://www.capensis.com]
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
    'ember',
    'ember-data',
    'app/lib/factories/widget',
    'app/controller/metric',
], function(Ember, DS, WidgetFactory) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    var widgetOptions = {};

    var CategoryChartViewMixin = Ember.Mixin.create({
        didInsertElement: function() {
            var ctrl = get(this, 'controller');

            console.log('category chart init');


            this._super.apply(this, arguments);


        },

        willDestroyElement: function() {

        },

        setDefaultChartOptions: function() {

        }
    });

    var widget = WidgetFactory('categorychart', {
        needs: ['metric'],

        viewMixins: [
            CategoryChartViewMixin
        ],

        init: function () {
            this.setConfiguration();
            this._super();
            var widgetController = this;
            setInterval(function () {
                var chart = get(widgetController, 'chartComponent');
                chart.send('update');
            }, 5000);
        },

        findItems : function () {

            /**
            Serie and metrics data fetch and chart series formating are triggered here
            The dataSerie array is there reset and updated to rerender the chart.
            **/

            set(this, 'dataSeries', []);

            //data interval selection
            var now = new Date().getTime();
            //fetch time window of 10 minutes hoping there are metrics since.
            var from = now - 600000;
            var to = now;

            var seriesMeta = get(this, 'series');

            if (!isNone(seriesMeta)) {
                get(this, 'controllers.metric').fetchSeriesFromSchemaValues(
                    this, get(this, 'widgetDataStore'), from, to, seriesMeta, this.onSeriesFetch
                );
            }
        },

        onSeriesFetch: function (caller, series) {
            /**
            Transform series information for widget text display facilities
            series are fetched from metric manager and are made of a list of metrics as
            [{meta: serieRecord, values: [[timestamp_0, value_0, [...]]]}, [...]]
            **/
            var length = series.length,
                chartSeries = [];

            for(var i=0; i<length; i++) {

                var values = get(series[i], 'values'),
                    serieName = get(series[i].meta, 'crecord_name').replace(/ /g,'_'),
                    value = 0;

                var valueLength = values.length;

                //choosing the value for the last point when any
                if (valueLength) {
                    value = values[valueLength - 1][1];
                } else {
                    serieName += ' ' + __('No data available');
                }

                chartSeries.push([serieName, value]);
            }

            caller.send('updateMetrics', 'series', chartSeries);
        },


        setConfiguration: function () {
            set(this, 'chartOptions', {
                userMaxValue: 120
            });
            console.log('set configuration', arguments);
        },

        actions: {
            updateSeries: function (type, series) {
                set(this, 'dataSeries', series);
                console.log(series);
                debugger;
            }
        }

    }, widgetOptions);


    return widget;
});
