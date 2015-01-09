/*
# Copyright (c) 2014 "Capensis" [http://www.capensis.com]
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
    'jquery',
    'ember',
    'app/lib/utils/dom',
    'app/lib/utils/values',
    'app/lib/wrappers/flotchart'
], function($, Ember, DOM, values) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    var component = Ember.Component.extend({
        tagName: 'div',
        classNames: 'flotchart',

        init: function() {
            set(this, 'options', undefined);
            set(this, 'series', undefined);
            set(this, 'human', false);

            this._super.apply(this, arguments);
        },

        onDataUpdate: function() {
            this.send('renderChart');
        }.observes('series.@each'),

        onOptionsUpdate: function() {
            this.send('renderChart');
        }.observes('options'),

        didInsertElement: function() {
            this.send('renderChart');
        },

        actions: {
            renderChart: function() {
                var chart = get(this, 'chart');

                if(chart !== undefined) {
                    console.log('Destroy chart');
                    chart.destroy();
                }

                this.createChart();
            },

            toggleSerie: function(config) {
                var label = config[0];
                var serieIndex = config[1];

                var series = get(this, 'series');
                var serie = series[serieIndex];

                console.log('Toggling serie:', label, serieIndex, serie);

                if(serie.config.lines && serie.lines) {
                    serie.lines.show = !serie.lines.show;
                }

                if(serie.config.bars && serie.bars) {
                    serie.bars.show = !serie.bars.show;
                }

                if(serie.config.points && serie.points) {
                    serie.points.show = !serie.points.show;
                }

                serie.hidden = !serie.hidden;

                if(serie.hidden) {
                    serie.color = '#CCCCCC';
                }
                else {
                    serie.color = serie.config.color;
                }

                // refresh chart
                set(this, 'series', series);
                this.refreshChart();
            }
        },

        createChart: function() {
            console.group('createChart:');

            var me = this;
            var plotcontainer = this.$();
            var series = get(this, 'series');
            var options = get(this, 'options');

            var seriesByAxis = {
                x: {},
                y: {}
            };

            for(var i = 0, l = series.length; i < l; i++) {
                var serie = series[i];

                serie.index = i;

                if(seriesByAxis.x[serie.xaxis] === undefined) {
                    seriesByAxis.x[serie.xaxis] = [];
                }

                seriesByAxis.x[serie.xaxis].push(serie);

                if(seriesByAxis.y[serie.yaxis] === undefined) {
                    seriesByAxis.y[serie.yaxis] = [];
                }

                seriesByAxis.y[serie.yaxis].push(serie);
            }

            var axis,
                n_xaxes = Object.keys(seriesByAxis.x).length,
                n_yaxes = Object.keys(seriesByAxis.y).length;

            for(axis = 0 ; axis < n_xaxes ; axis++) {
                var key = axis + 1;

                if (options.xaxes[axis] === undefined) {
                    options.xaxes[axis] = {
                        show: true,
                        reserveSpace: true,
                        position: (axis % 2 == 0 ? 'bottom' : 'top'),
                        color: seriesByAxis.x[key][0].color,
                        font: {
                            color: seriesByAxis.x[key][0].color
                        }
                    };
                }
            }

            for(axis = 0 ; axis < n_yaxes ; axis++) {
                var key = axis + 1;

                if (options.yaxes[axis] === undefined) {
                    var me = this;

                    options.yaxes[axis] = {
                        show: true,
                        reserveSpace: true,
                        position: (axis % 2 == 0 ? 'left' : 'right'),
                        color: seriesByAxis.y[key][0].color,
                        font: {
                            color: seriesByAxis.y[key][0].color
                        }
                    };
                }

                options.yaxes[axis].tickFormatter = function(val, axis) {
                    if(get(me, 'human') === true) {
                        var unit = seriesByAxis.y[key][0].unit;
                        val = values.humanize(val, unit);
                    }

                    return val;
                };
            }

            if(options && options.legend && options.legend.show && options.legend.labelFormatter === undefined) {
                options.legend.labelFormatter = function(label, serie) {
                    console.log('Format label for serie:', label, serie);

                    var style = undefined;

                    if(serie.hidden) {
                        style = 'font-style: italic;';
                    }

                    var clickableLabel = $('<span/>', {
                        style: style,
                        onclick: [
                            'Ember.View.views["', me.elementId, '"].send("toggleSerie", [',
                                '"', label, '",',
                                serie.index,
                            ']);'
                        ].join(''),
                        text: label
                    });

                    var tmpContainer = $('<div/>');
                    tmpContainer.append(clickableLabel);

                    return tmpContainer.html();
                };
            }

            console.log('series:', series);
            console.log('options:', options);

            set(this, 'chart', $.plot(plotcontainer, series, options));

            console.groupEnd();
        },

        refreshChart: function() {
            var chart = get(this, 'chart');
            var series = get(this, 'series');

            console.log('flotchart refresh series:', series);
            chart.setData(series);
            chart.setupGrid();
            chart.draw();
        }
    });


    loader.register('component:component-flotchart', component);

    /* TODO: use this snippet instead of loader.register, but this is still buggy
    Ember.Application.initializer({
        name: 'component-flotchart',
        initialize: function(container, application) {
            application.register('component:component-flotchart', component);
        }
    });
    */

    return component;
});
