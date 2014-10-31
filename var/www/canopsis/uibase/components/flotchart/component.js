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
    'app/lib/wrappers/flotchart'
], function($, Ember, DOM) {

    var get = Ember.get,
        set = Ember.set;

    var component = Ember.Component.extend({
        tagName: 'div',
        classNames: 'flotchart',

        options: undefined,
        series: undefined,

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
            console.log('createChart');

            var me = this;
            var plotcontainer = this.$();
            var series = get(this, 'series');
            var options = get(this, 'options');

            for(var i = 0, l = series.length; i < l; i++) {
                series[i].index = i;
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

            set(this, 'chart', $.plot(plotcontainer, series, options));
        },

        refreshChart: function() {
            var chart = get(this, 'chart');
            var series = get(this, 'series');

            chart.setData(series);
            chart.setupGrid();
            chart.draw();
        }
    });

    Ember.Application.initializer({
        name: 'component-flotchart',
        initialize: function(container, application) {
            application.register('component:component-flotchart', component);
        }
    });

    return component;
});
