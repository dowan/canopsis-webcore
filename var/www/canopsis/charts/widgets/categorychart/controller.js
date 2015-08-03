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

    var CategoryChartViewMixin = Ember.Mixin.create({});

    var widget = WidgetFactory('categorychart', {

        needs: ['metric'],

        viewMixins: [
            CategoryChartViewMixin
        ],

        init: function () {
            this._super();
            this.loadConfiguration();
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

        loadConfiguration: function () {
            /**
            Get options from chart configuration to send them to the chart display component
            **/

            //option list to fetch
            var optionProperties = [
                'display',
                'allow_user_display',
                'use_max_value',
                'max_value'
            ];

            var options = {};

            for(var i=0; i<optionProperties.length; i++) {
                options[optionProperties[i]] = get(this, optionProperties[i]);
            }

            //set chart display component with option values list
            console.log('category chart options', options);
            set(this, 'options', options);
        },

        onSeriesFetch: function (chartController, series) {
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
            console.log(chartSeries);
            var chart = get(chartController, 'chartComponent');
            set(chart, 'series', chartSeries);
        },


    }, widgetOptions);


    return widget;
});
