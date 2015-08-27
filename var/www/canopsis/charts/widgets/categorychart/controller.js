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

Ember.Application.initializer({
    name: 'CategorychartWidget',
    after: ['WidgetFactory'],

    initialize: function(container, application) {

        var WidgetFactory = container.lookupFactory('factory:widget');


        var get = Ember.get,
            set = Ember.set,
            isNone = Ember.isNone;

        var widgetOptions = {};

        var CategoryChartViewMixin = Ember.Mixin.create({});

        var Widget = WidgetFactory('categorychart', {

            needs: ['metric'],

            viewMixins: [
                CategoryChartViewMixin
            ],

            init: function () {
                this._super();
                this.loadConfiguration();
                this.initSeries();
            },

            initSeries: function () {
                Ember.setProperties(this, {
                    'seriesReady': false,
                    'metricsReady': false,
                    'tmpSeries': []
                });
            },

            findItems : function () {

                /**
                Serie and metrics data fetch and chart series formating are triggered here
                The dataSerie array is there reset and updated to rerender the chart.
                **/
                this.initSeries();

                //data interval selection
                var now = new Date().getTime();
                //fetch time window of 10 minutes hoping there are metrics since.
                var from = now - 600000;
                var to = now;

                var store = get(this, 'widgetDataStore');

                var metricsMeta = get(this, 'metrics');
                console.log('metricsMeta', metricsMeta);
                if (!isNone(metricsMeta)) {
                    get(this, 'controllers.metric').fetchMetricsFromIds(
                        this, from, to, metricsMeta, this.onMetricFetch
                    );
                }


                var seriesMeta = get(this, 'series');
                console.log('seriesMeta', seriesMeta);
                if (!isNone(seriesMeta)) {
                    get(this, 'controllers.metric').fetchSeriesFromSchemaValues(
                        this, store, from, to, seriesMeta, this.onSeriesFetch
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
                    'max_value',
                    'show_legend',
                    'show_tooltip',
                    'show_labels',
                    'metric_template',
                    'stacked',
                    'text_left_space',
                    'human_readable',
                ];

                var options = {};

                for(var i=0; i<optionProperties.length; i++) {
                    options[optionProperties[i]] = get(this, optionProperties[i]);
                }

                //set chart display component with option values list
                console.log('category chart options', options);
                set(this, 'options', options);
            },

            onMetricFetch: function (chartController, pargs, from, to) {

                var length = pargs.length,
                    chartSeries = [];

                for(var i=0; i<length; i++) {

                    var metric = pargs[i].data[0];
                    var serieId = metric.meta.data_id,
                        pointsLength = metric.points.length,
                        serieValue = 0;

                    if (pointsLength) {
                        serieValue = metric.points[pointsLength - 1][1];
                    }

                    var serieSplit = serieId.split('/');
                    var serieName = serieSplit[serieSplit.length - 1];

                    chartSeries.push({
                        id: serieId,
                        serie: [serieName, serieValue]
                    });

                }

                chartController.update('metrics', chartSeries);
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

                    var metrics = series[i].meta.metrics,
                        contextId = serieName;
                    if (metrics.length) {
                        contextId = series[i].meta.metrics[0];
                    }

                    chartSeries.push({
                        id: contextId,
                        serie: [serieName, value]
                    });
                }

                chartController.update('series', chartSeries);
            },

            update: function (type, series) {
                /**
                when all series ready, tell the chart to display
                and reset temp statuses until next widget refresh
                **/
                //set metric type ready
                set(this, type + 'Ready', true);

                //update temp series until all sources are ready
                var chartSeries = get(this, 'tmpSeries');

                chartSeries = chartSeries.concat(series);

                set(this, 'tmpSeries', chartSeries);

                if(get(this, 'seriesReady') && get(this, 'metricsReady')) {
                    var chart = get(this, 'chartComponent');
                    set(chart, 'series', chartSeries);
                }
            }


        }, widgetOptions);

        application.register('factory:widget', Widget);
    }
});
