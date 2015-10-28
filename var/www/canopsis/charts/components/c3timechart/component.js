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
    name:"component-c3timechart",
    after: ['HashUtils', 'ValuesUtils'],
    initialize: function(container, application) {

    var HashUtils = container.lookupFactory('utility:hash');
    var ValuesUtils = container.lookupFactory('utility:values');


    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone,
        __ = Ember.String.loc;

    /**
     * Use c3js to display time chart from data managed by the timechart widget
     * @class C3jsTimechart
     **/

    var component = Ember.Component.extend({

        /**
         * Component initialization
         **/
        init: function() {
            this._super();
            Ember.setProperties(this, {
                'uuid': HashUtils.generateId('timeChart'),
                'parentController.chartComponent': this,
            });
        },

        /**
         * Manage component destruction
         **/
        willDestroyElement: function() {
            var chart = get(this, 'chart');
            if (!isNone(chart)) {
                chart.destroy();
            }
        },


        /**
         * Tells the component is inserted into the dom
         **/

        didInsertElement: function () {
            set(this, 'domready', true);
        },

        /**
         * Transform and prepare data from the widget to the c3 format
         **/

        computeSeries: function () {

            var series = get(this, 'series'),
                xs = {},
                columns = [],
                c3Series = [],
                uniq = 1;

            for(var i=0, j=series.length; i<j; i++) {

                var id = get(series[i], 'meta.data_id');
                var serieName = this.computeSerieName(id),
                    timeName = 'x' + i,
                    points = series[i].points;

                if (xs[serieName] !== undefined) {
                    serieName += ' ('+ uniq++ + ')';
                }

                var dataSerie = [serieName],
                    timeSerie = [timeName];

                xs[serieName] = timeName;

                for(var k=0, l=points.length; k<l; k++) {
                    timeSerie.pushObject(points[k][0] * 1000);
                    dataSerie.pushObject(points[k][1]);
                }

                c3Series.push(timeSerie);
                c3Series.push(dataSerie);
            }

            return {
                xs: xs,
                columns: c3Series
            };

        }.property ('series'),

        /**
         * Manage series names for displayed metrics
         * @param {string} serieId the serie context identifier
         **/

        computeSerieName: function (serieId) {

            /**
            TODO Merge with the one of the category chart
            **/

            var context = ['type', 'connector','connector_name', 'component','resource', 'metric'];
            var seriesInfo = serieId.split('/'),
                templateContext = {};

            //Build template context
            for (i=0, j=seriesInfo.length; i<j; i++) {
                //+1 is for preceding /
                templateContext[context[i]] = seriesInfo[i + 1];
            }
            console.log('Template context', templateContext, 'for metric', serieId);

            var template = get(this, 'parentController.options.metric_template') || '{{metric}}';

            try {
                return Handlebars.compile(template)(templateContext);
            } catch (err) {
                console.log('could not proceed template feed', err);
            }

            return serieId;

        },

        /**
         * Create a chart with widget values depending on widget configuration
         **/

        generateChart: function () {

            /**
            Uses series and chart options to insert a C3js chart element in the dom
            **/

            if(isNone(get(this, 'domready'))) {
                console.log('Dom is not ready for time chart, cannot draw');
                return;
            }

            if(isNone(get(this, 'parentController.options'))) {
                console.log('Chart options are not ready cannot draw');
                return;
            }

            var data = get(this, 'computeSeries');
            var domElement = '#' + get(this, 'uuid');




            var humanReadable = get(this, 'parentController.options.human_readable'),
                zoomable = get(this, 'parentController.options.zoomable'),
                subchart = get(this, 'parentController.options.subchart'),
                stacked = get(this, 'parentController.options.stacked'),
                tickCount = get(this, 'parentController.options.tick_count'),
                multiAxes = get(this, 'parentController.options.multi_axes'),
                dateFormat = get(this, 'parentController.options.date_format'),
                display = get(this, 'parentController.options.display'),
                seriesNames = Object.keys(data.xs);


            data.type = display;

            if (stacked) {
                data.groups = [seriesNames];
            }

            var tick = {
                format: function (v) {
                    return humanReadable ? ValuesUtils.humanize(v, '') : parseFloat(v).toFixed(2);
                }
            };

            var options = {
                bindto: domElement,
                data: data,
                zoom: {
                   enabled: zoomable
                },
                subchart: {
                    show: subchart
                },
                bar: {
                    width: {
                        ratio: 0.1
                    }
                },
                axis: {
                    x: {
                        type: 'timeseries',
                        tick: {
                            format: dateFormat,
                            fit: true,
                            count: tickCount
                        }
                    },
                    y: {
                        tick: tick,
                        show: true
                    },
                    y2: {
                        tick: tick,
                        show: multiAxes
                    }
                }
            };


            if (multiAxes) {
                // depends on c3js options
                // works only for ordered series 1 and 2
                options.data.axes = {};
                options.data.axes[seriesNames[0]] = 'y';
                options.data.axes[seriesNames[1]] = 'y2';
            }

            console.log('chart options', options);

            var chart = c3.generate(options);

            set(this, 'chart', chart);

        },

        /**
         * Manage new incomming data when metrics are fetched from the backend,
         * Create a new c3js chart if not already done in the component
         **/

        update: function () {

            var chart = get(this, 'chart');

            if (isNone(chart)) {
                this.generateChart();
            } else {
                /*
                console.log('refreshing c3 chart with series', get(this, 'c3series'));

                var previousSeriesNames = get(this, 'seriesNames');

                if (previousSeriesNames.length) {
                    chart.unload({
                        ids: previousSeriesNames
                    });
                }

                chart.load({
                    columns: get(this, 'c3series'),
                    groups: [get(this, 'seriesNames')]
                });
                */
            }


        }.observes('series', 'ready', 'parentController.options'),

        actions: {

            /**
             * Change the chart display style on the fly
             **/

            transform: function (type) {
                get(this, 'chart').destroy();
                set(this, 'parentController.options.display', type);
                this.generateChart();
            }

        }

    });

    application.register('component:component-c3timechart', component);

    }
});
