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
    'app/lib/utils/hash',
    'canopsis/charts/lib/utils/basechart',
    'canopsis/charts/lib/externals/c3/c3',
    'link!canopsis/charts/lib/externals/c3/c3.css',
], function(hash, BaseChart) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone,
        __ = Ember.String.loc;

    var component = BaseChart.extend({

        init: function() {
            this._super();
            Ember.setProperties(this, {
                'uuid': hash.generateId('categoryChart'),
                'parentController.chartComponent': this,
            });
        },

        willDestroyElement: function() {
            var chart = get(this, 'chart');
            if (!isNone(chart)) {
                chart.destroy();
            }
        },


        maxValue: function () {

            /**
            User max value may be defined
            if it is defined, it must be greater than series values sum
            max value is used only if configuration allowed it
            **/

            var maxValue = get(this, 'parentController.options.max_value'),
                useMaxValue = get(this, 'parentController.options.use_max_value'),
                seriesSum = get(this, 'seriesSum');

            if (useMaxValue && !isNone(maxValue) && maxValue > seriesSum) {
                return maxValue;
            } else {
                return seriesSum;
            }

        }.property('parentController.options.max_value'),

        seriesSum: function () {

            /**
            Compute all series values sum
            **/

            var sum = 0,
                series = get(this, 'seriesWithComputedNames');
            for (var i=0; i<series.length; i++) {
                sum += series[i][1];
            }
            return sum;

        }.property('series'),

        seriesNames: function () {
            /**
            Get the list of each distinct serie name.
            **/

            var seriesNames = [];
            var series = get(this, 'c3series');
            var length = series.length;
            for (var i=0; i<length; i++) {
                seriesNames.push(series[i][0]);
            }
            return seriesNames;

        }.property('series'),



        seriesWithComputedNames: function () {

            /**
            Generate a new array for series with metric names computed from user template.
            **/

            var context = ['type', 'connector','connector_name', 'component','resource', 'metric'],
                seriesWithMeta = $.extend(true, [], get(this, 'series')),
                namedSeries = [],
                i,
                j;

            console.log('seriesWithMeta', seriesWithMeta);

            var length = seriesWithMeta.length;

            for (i=0; i<length; i++) {
                var serie = seriesWithMeta[i].serie,
                    id = seriesWithMeta[i].id;

                console.log('meta serie', id, serie);

                var seriesInfo = id.split('/'),
                    templateContext = {};
                var lengthSeriesInfo = seriesInfo.length;

                //Build template context
                for (j=0; j<lengthSeriesInfo; j++) {
                    //+1 is for preceding /
                    templateContext[context[j]] = seriesInfo[j + 1];
                }
                console.log('Template context', templateContext, 'for metric', id);

                var template = get(this, 'parentController.options.metric_template');

                try {
                    serie[0] = Handlebars.compile(template)(templateContext);
                } catch (err) {
                    console.log('could not proceed template feed', err);
                }


                namedSeries.push(serie);

            }

            return namedSeries;

        }.property(),

        c3series: function () {

            /**
            Generate chart required values to be displayed
            **/
            console.log('chart series is now', get(this, 'series'));

            var restValue = get(this, 'maxValue') - get(this, 'seriesSum'),
                series = get(this, 'seriesWithComputedNames');
                //base series data deep copied

            //Compute difference between max value and series values sum
            if (restValue > 0) {
                var leftValueLabel = get(this, 'parentController.options.text_left_space');
                series.push([leftValueLabel, restValue]);
            }

            //Sort series for clean display
            series.sort(function(a, b) {
                return b[1] - a[1];
            });

            return series;

        }.property('series'),

        colors: function () {

            /**
            Compute the color dict for nice chart display from options
            **/

            var seriesNames = get(this, 'seriesNames');

            var colors = {
                leftValueLabel: '#EEEEEE',
            };

            for (var i=0; i<seriesNames.length; i++) {
                colors[seriesNames[i]] = ['#FF0000', '#F97600'][i];
            }
            return colors;

        }.property('seriesNames'),


        didInsertElement: function () {
            /**
            Tells the component is inserted into the dom
            **/
            set(this, 'domready', true);
        },

        generateChart: function () {

            /**
            Uses series and chart options to insert a C3js chart element in the dom
            **/

            if(isNone(get(this, 'domready'))) {
                console.log('Dom is not ready for category chart, cannot draw');
                return;
            }

            if(isNone(get(this, 'parentController.options'))) {
                console.log('Chart options are not ready cannot draw');
                return;
            }


            var domElement = '#' + get(this, 'uuid'),
                seriesSum = get(this, 'seriesSum'),
                seriesNames = get(this, 'seriesNames'),
                c3series = get(this, 'c3series'),
                colors = get(this, 'colors'),
                maxValue = get(this, 'maxValue'),
                leftValueLabel = get(this, 'parentController.options.text_left_space'),
                chartType = get(this, 'parentController.options.display'),
                showLegend = get(this, 'parentController.options.show_legend'),
                tooltip = get(this, 'parentController.options.show_tooltip'),
                showLabels = get(this, 'parentController.options.show_labels'),
                stacked = get(this, 'parentController.options.stacked'),
                rotated = false,
                showAxes = true,
                isBarChart = true;

            var gauge = {
                    label:{
                        format: function(value, ratio){
                            return  showLabels ? seriesSum.toFixed(2): '';
                        }
                    }
                },
                label = {show : showLabels};

            var donut = {
                label: label,
                title: (showLabels && seriesSum) ? seriesSum.toFixed(2): ''
            };

            console.log('seriesNames', seriesNames);
            console.log('c3series', c3series);

            if (chartType == 'progressbar') {
                //cheating alias becrause progress bar does not exists in c3 js yet
                isBarChart = false;
                chartType = 'bar';
                rotated = true;
                showAxes = false;
                showLabels = false;
            }

            //max value may be equal to 0 when series did not fetch points.
            if (maxValue > 0) {
                //define the max value of the chart and wether or not a delta serie is created
                gauge.max = maxValue;
                if (maxValue > seriesSum && $.inArray(leftValueLabel, seriesNames) === -1) {
                    seriesNames.push(leftValueLabel);
                }
            }

            var options = {
                bindto: domElement,
                groups: seriesNames,
                tooltip: {show: tooltip},
                legend: {show: showLegend},
                data: {
                    columns: c3series,
                    type: chartType,
                    groups: [seriesNames],
                    labels: {
                        format: function (v, id, i, j) {
                            return showLabels ? id + ' : ' + parseFloat(v).toFixed(2) : '';
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
                pie: {label : label},
                axis: { //for bar mode
                  rotated:rotated,
                  x: {
                    show: showAxes
                  },
                  y: {
                    show: showAxes
                  }
                },
            };

            if (chartType === 'bar' && !stacked) {
                //no more stacked view bor bar charts
                delete options.groups;
                delete options.data.groups;
            }

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

    loader.register('component:component-c3categorychart', component);

    return component;
});
