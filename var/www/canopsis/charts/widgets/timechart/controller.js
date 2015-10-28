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
    name: 'TimechartWidget',
    after: ['WidgetFactory'],

    initialize: function(container, application) {

        var WidgetFactory = container.lookupFactory('factory:widget');


        var get = Ember.get,
            set = Ember.set,
            isNone = Ember.isNone;

        var widgetOptions = {};

        var TimeChartViewMixin = Ember.Mixin.create({});

        /**
         * Widget for timechart, manage data fetch and preparation
         * a c3js component will display fetched data
         * @class TimechartWidget
         **/

        var Widget = WidgetFactory('timechart', {

            needs: ['metric'],

            viewMixins: [
                TimeChartViewMixin
            ],

            /**
             * Widget initialization
             **/

            init: function () {
                this._super();
                this.loadConfiguration();
                this.initSeries();
            },

            /**
             * Data fetch initialization
             **/

            initSeries: function () {
                Ember.setProperties(this, {
                    'seriesReady': false,
                    'metricsReady': false,
                    'tmpSeries': []
                });
            },

            /**
             * Serie and metrics data fetch and chart series formating are triggered here
             * The dataSerie array is there reset and updated to rerender the chart.
             **/

            findItems : function () {

                this.initSeries();

                //data interval selection
                var now = new Date().getTime();
                //fetch time window of 10 minutes hoping there are metrics since.
                var from = now - get(this, ('timewindow')) * 1000;
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

            /**
             * Make widget configuration values available to the c3js component
             **/

            loadConfiguration: function () {

                //option list to fetch
                var optionProperties = [
                    'display',
                    'allow_user_display',
                    'max_value',
                    'show_legend',
                    'show_tooltip',
                    'show_labels',
                    'metric_template',
                    'human_readable',
                    'zoomable',
                    'subchart',
                    'stacked',
                    'tick_count',
                    'multi_axes',
                    'date_format',
                    'minor_threshold',
                    'major_threshold',
                    'critical_threshold',
                ];

                var options = {};

                for(var i=0; i<optionProperties.length; i++) {
                    options[optionProperties[i]] = get(this, optionProperties[i]);
                }

                //set widget option values list
                console.log('time chart options', options);
                set(this, 'options', options);
            },

            /**
             * Data management when api fetched metric data
             * @param {string} chartController keep execution context.
             * @param {string} pargs API data content to diplay
             * @param {integer} from start date since when gather metric data
             * @param {integer} to end date until when gather metric data
             **/

            onMetricFetch: function (chartController, pargs, from, to) {
                var series = [];
                for (var i=0, l=pargs.length; i<l; i++) {
                    series.push(pargs[i].data[0]);
                }
                chartController.update('metrics', series);
            },


            /**
             * Data management when api fetched series data
             * @param {string} chartController keep execution context.
             * @param {string} pargs API data content to diplay
             **/

            onSeriesFetch: function (chartController, pargs) {

                var series = [];

                for (var i=0, l=pargs.length; i<l; i++) {

                    series.push({
                        meta: {
                            name: pargs[i].meta.crecord_name
                        },
                        serie: pargs[i]
                    });

                }


                chartController.update('series', series);
            },

            /**
             * when all series ready, tell the chart to display
             * and reset temp statuses until next widget refresh
             * @param {string} type tell what kind of data is ready [serie|metric]
             * @param {array} series The normalized metric data fetched from the API
             **/

            update: function (type, series) {
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

        application.register('widget:timechart', Widget);
    }
});
