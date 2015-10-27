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

    var component = Ember.Component.extend({

        init: function() {
            this._super();
            Ember.setProperties(this, {
                'uuid': HashUtils.generateId('timeChart'),
                'parentController.chartComponent': this,
            });
        },

        willDestroyElement: function() {
            var chart = get(this, 'chart');
            if (!isNone(chart)) {
                chart.destroy();
            }
        },


        didInsertElement: function () {
            /**
            Tells the component is inserted into the dom
            **/
            set(this, 'domready', true);
        },

        computeSeries: function () {

            var series = get(this, 'series'),
                xs = {},
                columns = [],
                c3Series = [];


            for(var i=0, j=series.length; i<j; i++) {

                var id = get(series[i], 'meta.data_id');
                var serieName = this.computeSerieName(id),
                    timeName = 'x' + i,
                    points = series[i].points;

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


            var tickCount = 10,
                humanReadable = get(this, 'parentController.options.human_readable'),
                showLabels = get(this, 'parentController.options.show_labels'),
                zoomable = get(this, 'parentController.options.zoomable'),
                subchart = get(this, 'parentController.options.subchart');

            /*
            data.labels = {
                format: function (v, id, i, j) {
                    v = humanReadable ? ValuesUtils.humanize(v, '') : parseFloat(v).toFixed(2);
                    return showLabels ? id + ' : ' + v : '';
                }
            };
            */

            var options = {
                bindto: domElement,
                data: data,
                zoom: {
                   enabled: zoomable
                },
                subchart: {
                    show: subchart
                },
                axis: {
                    x: {
                        type: 'timeseries',
                        tick: {
                            format: '%Y-%m-%d',
                            fit: true,
                            count: tickCount
                        }
                    },
                    y: {
                        tick: {
                            format: function (v) {
                                return humanReadable ? ValuesUtils.humanize(v, '') : parseFloat(v).toFixed(2);
                            }
                        }
                    }
                }
            };

            var chart = c3.generate(options);

            set(this, 'chart', chart);

        },

        update: function () {
            /**
            Update the chart display with new values.
            Insert a new chart if it does not exists yet.
            **/
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
