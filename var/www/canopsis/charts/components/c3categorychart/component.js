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
            set(this, 'uuid', hash.generateId('chartGauge'));
            set(this, 'leftValueLabel', __('Left until max'));
            this.refreshChart();
        },

        maxValue: function () {

            /**
            User max value may be defined
            if it is defined, it must be greater than series values sum
            **/

            var userMaxValue = get(this, 'options.userMaxValue'),
                seriesSum = get(this, 'seriesSum');

            if (!isNone(userMaxValue) && userMaxValue > seriesSum) {
                return userMaxValue;
            } else {
                return seriesSum;
            }
        }.property(),

        processSeriesByType: function (series) {
            //adapt data for correct display
            var chartType = get(this, 'chartType');

            if (chartType === 'gauge') {}
            return series;
        },

        seriesSum: function () {
            var sum = 0,
                series = get(this, 'series');
            for (var i=0; i<series.length; i++) {
                sum += series[i][1];
            }
            return sum;
        }.property('series@each'),

        refreshChart: function () {

            /**
            Generate chart required values to be displayed
            **/

            var restValue = get(this, 'maxValue') - get(this, 'seriesSum'),
                seriesNames = [],
                series = $.extend(true, [], get(this, 'series'));//base series data deep copied
            //Compute difference between max value and series values sum
            if (restValue > 0) {
                var leftValueLabel = get(this, 'leftValueLabel');
                series.push([leftValueLabel, restValue]);
            }

            //Sort series for clean display
            series.sort(function(a, b) {
                return b[1] - a[1];
            });

            series = this.processSeriesByType(series);

            for (var i=0; i<series.length; i++) {
                seriesNames.push(series[i][0]);
            }

            Ember.setProperties(this, {
                'c3series': series,
                'seriesNames': seriesNames
            });
        },


        didInsertElement: function () {
            this.generateChart();
        },

        generateChart: function () {
            var domElement = '#' + get(this, 'uuid'),
                leftValueLabel = get(this, 'leftValueLabel'),
                seriesSum = get(this, 'seriesSum').toFixed(2),
                seriesNames = get(this, 'seriesNames');

            console.log('seriesNames', seriesNames);

            var chart = c3.generate({
                bindto: domElement,
                groups: seriesNames,
                data: {
                    columns: get(this, 'c3series'),
                    type: 'bar',
                    groups: [seriesNames],
                    labels: {
                        format: function (v, id, i, j) {
                            return id + ' : ' + parseFloat(v).toFixed(2);
                        }
                    },
                    empty: {
                        label: {
                            text: "No Data"
                        }
                    }
                },
                color: {
                    serie1: '#FF0000',
                    serie2: '#F97600',
                    leftValueLabel: '#EEEEEE',
                },
                gauge: { //for gauge mode
                    max: get(this, 'maxValue'),
                    label:{
                        format: function(value, ratio){
                            return seriesSum;
                        }
                    },
                },
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

        actions: {
            transform: function (type) {

                if (type === 'progressbar') {
                    //bar mode is the progressbar display
                    //transform does not work from any type to bar
                    //chart is recomputed
                    set(this, 'chartType', 'bar');
                    get(this, 'chart').destroy();
                    this.refreshChart();
                    this.generateChart();
                } else {
                    //Otherwise, chart is juste destroyed
                    set(this, 'chartType', type);
                    this.refreshChart();
                    get(this, 'chart').transform(type);
                }

            }
        }

    });

    loader.register('component:component-c3categorychart', component);

    return component;
});
