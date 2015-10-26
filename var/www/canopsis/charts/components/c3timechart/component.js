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

        expandedSeries: function () {

            var series = get(this, 'series');

            var timestampSet = {};
            var seriesNames = [];
            var i, j, name, k, l;
            var previousValue = {};

            for(i=0, j=series.length; i<j; i++) {

                var serie = series[i];
                name = this.computeSerieName(serie.id);
                seriesNames.push(name);

                for(k=0, l=serie.serie.length; k<l; k++) {
                    point = serie.serie[k];
                    if (timestampSet[point[0]] === undefined) {
                        timestampSet[point[0]] = {};
                    }
                    timestampSet[point[0]][name] = point[1];

                    //populate the first value of each series
                    if(previousValue[name] === undefined) {
                        previousValue[name] = point[1];
                    }
                }

            }


            var finalSeries = [];
            var timestamps = [];

            for (var key in timestampSet) {
                timestamps.push(key * 1000);
            }
            timestamps.sort();

            for (i=0, j=seriesNames.length; i<j; i++) {
                name = seriesNames[i];
                var finalSerie = [name];

                for (k=0, l=timestamps.length; k<l; k++) {

                    var timestamp = timestamps[k];
                    var value = timestampSet[timestamp][name];

                    if (value === undefined) {
                        value = previousValue[name];
                    } else {
                        previousValue[name] = value;
                    }

                    finalSerie.push(value);
                }
            }

            console.log(JSON.stringify(series));
        }.property (),

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
            console.log('Template context', templateContext, 'for metric', id);

            var template = get(this, 'parentController.options.metric_template');

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
            debugger;

            var series = get(this, 'expandedSeries');
            var domElement = '#' + get(this, 'uuid');

            var options = {
                bindto: domElement,
                data: {
                    x: 'x',
            //        xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
                    columns: [
                        ['x', 1445521373000, 1445522373000, 1445523373000],

                        ['data1', 30, 200,  400],
                        ['data2', 130, 340, 200]
                    ]
                },
                axis: {
                    x: {
                        type: 'timeseries',
                        tick: {
                            format: '%Y-%m-%d'
                        }
                    }
                }
            };

            /*
            var options = {
                bindto: domElement,
                groups: seriesNames,
                tooltip: {show: tooltip},
                legend: {show: showLegend},
                data: {
                    x: 'x',
                    columns: c3series,
                    type: chartType,
                    groups: [seriesNames],
                    labels: {
                        format: function (v, id, i, j) {
                            v = humanReadable ? ValuesUtils.humanize(v, '') : parseFloat(v).toFixed(2);
                            return showLabels ? id + ' : ' + v : '';
                        }
                    },
                    empty: {
                        label: {
                            text: __('No Data')
                        }
                    }
                },
                //color: colors,
                gauge: gauge,
                donut: donut,
                pie: pie,
                axis: { //for bar mode
                  rotated:rotated,
                  x: {
                    show: showAxes
                  },
                  y: {
                    tick: {
                        format: function (v) {
                            return humanReadable ? ValuesUtils.humanize(v, '') : parseFloat(v).toFixed(2);
                        }
                    },
                    show: showAxes
                  }
                },
            };
            */

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
