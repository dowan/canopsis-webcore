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
    'app/application',
    'app/lib/utils/hash',
    'app/lib/wrappers/flotchart',
    'webcore-libs/flot-plugins/custom/jquery.flot.tooltip'
], function($, Ember, Application, hashUtils) {

    var get = Ember.get,
        set = Ember.set;

    enableSerie = function(seriesIdx, id, selector){
        var currentPlot = PLOTS[id];
        var disabledColor = "red";
        var enabledColor = "black";
        var currentSeries = currentPlot.getData();

        for (var i=0; i < currentSeries.length; i++){
            var serie = currentSeries[i];
            if (serie.label == seriesIdx){
                if (serie.points.used)
                    serie.points.show = !serie.points.show;
                if (serie.lines.used)
                    serie.lines.show = !serie.lines.show;
                if (serie.bars.used)
                    serie.bars.show = !serie.bars.show;
            }
        }
        selector.style.color = (selector.style.color == disabledColor)? enabledColor : disabledColor;
        currentPlot.setData(currentSeries);
        currentPlot.draw();
    };

    var component = Ember.Component.extend({
        tagName: 'div',
        classNames: 'flotchart',

        options: undefined,
        series: undefined,

        onDataUpdate: function() {
            if(this.chart !== undefined) {
                this.send('renderChart');
            }
        }.observes('series.@each'),

        onOptionsUpdate: function() {
            if(this.chart !== undefined) {
                this.chart.destroy();
                this.createChart();
            }
        }.observes('options'),

        didInsertElement: function() {
            this.createChart();
        },

        actions: {
            renderChart: function() {
                console.log('Render chart');
                this.chart.setData(get(this, 'series'));
                this.chart.setupGrid();
                this.chart.draw();
            }
        },

        createChart: function() {
            console.group('createChart');
            var plotcontainer = this.$();
            var series = get(this, 'series');
            var options = get(this, 'options');

            this.chart = $.plot(plotcontainer, series, options);

            var parentController = this.get("parentController");
            parentController.chart = this.chart;

            if (options && options.tooltip){
                this.$().UseTooltip();
            }
            this.send('renderChart');
            this.managePlots();
            console.groupEnd();
        },

        managePlots: function() {
            if (!window.PLOTS){
                PLOTS = [];
            }
            if (!this.chart.id){
                var plotLength = PLOTS.length;
                this.chart.id = plotLength;
                PLOTS[plotLength] = this.chart;
            }
        }
    });

    Application.ComponentFlotchartComponent = component;

    return component;
});
