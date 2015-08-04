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
    'app/lib/utils/hash',
    'canopsis/charts/lib/utils/basechart',
    'c3',
    'link!canopsis/charts/lib/externals/c3/c3.css',
], function(Ember, hash, BaseChart, c3) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone,
        __ = Ember.String.loc;

    var component = BaseChart.extend({

        init: function() {
            this._super();
            Ember.setProperties(this, {
                'uuid': hash.generateId('categoryChart'),
                'leftValueLabel': __('Left until max'),
                'parentController.chartComponent': this,
            });
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
                series = get(this, 'series');
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
            var series = get(this, 'series');
            var length = series.length;
            for (var i=0; i<length; i++) {
                seriesNames.push(series[i][0]);
            }
            return seriesNames;

        }.property('series'),

        c3series: function () {

            /**
            Generate chart required values to be displayed
            **/
            console.log('chart series is now', get(this, 'series'));

            var restValue = get(this, 'maxValue') - get(this, 'seriesSum'),
                series = $.extend(true, [], get(this, 'series'));
                //base series data deep copied

            //Compute difference between max value and series values sum
            if (restValue > 0) {
                var leftValueLabel = get(this, 'leftValueLabel');
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
                leftValueLabel = get(this, 'leftValueLabel'),
                seriesSum = get(this, 'seriesSum'),
                seriesNames = get(this, 'seriesNames'),
                c3series = get(this, 'c3series'),
                colors = get(this, 'colors'),
                maxValue = get(this, 'maxValue'),
                chartType = get(this, 'parentController.options.display');
                gauge = {
                    label:{
                        format: function(value, ratio){
                            return seriesSum.toFixed(2);
                        }
                    }
                };

            console.log('seriesNames', seriesNames);
            console.log('c3series', c3series);

            if (chartType == 'progressbar') {
                //cheating alias becrause progress bar does not exists in c3 js yet
                chartType = 'bar';
            }

            //max value may be equal to 0 when series did not fetch points.
            if (maxValue > 0) {
                //define the max value of the chart and wether or not a delta serie is created
                gauge.max = maxValue;
                if (maxValue > seriesSum && $.inArray(leftValueLabel, seriesNames) === -1) {
                    seriesNames.push(leftValueLabel);
                }
            }

            var chart = c3.generate({
                bindto: domElement,
                groups: seriesNames,
                data: {
                    columns: c3series,
                    type: chartType,
                    groups: [seriesNames],
                    labels: {
                        format: function (v, id, i, j) {
                            return id + ' : ' + parseFloat(v).toFixed(2);
                        }
                    },
                    empty: {
                        label: {
                            text: __('No Data')
                        }
                    }
                },
                color: colors,
                gauge: gauge,
                axis: { //for bar mode
                  rotated:true,
                  x: {
                    show: false
                  },
                  y: {
                    show: false
                  }
                },
            });

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
