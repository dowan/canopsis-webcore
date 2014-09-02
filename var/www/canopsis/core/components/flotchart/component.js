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
    'app/lib/wrappers/flotchart'
], function($, Ember, Application, hashUtils) {
    Application.ComponentFlotchartComponent = Ember.Component.extend({
        tagName: 'div',
        classNames: 'flotchart',

        options: undefined,
        series: undefined,

        onDataUpdate: function() {
            if(this.chart !== undefined) {
                this.send('renderChart');
            }
        }.observes('series'),

        init: function() {
            this._super(arguments);
        },

        didInsertElement: function() {
            console.group('createChart');

            var plotcontainer = this.$();

            var series = this.get('series');
            var options = this.get('options');
            console.log('container:', plotcontainer);
            console.log('series:', series);
            console.log('options:', options);

            this.chart = $.plot(plotcontainer, series, options);

            this.send('renderChart');

            console.groupEnd();
        },

        actions: {
            renderChart: function() {
                console.log('Render chart');
                this.chart.setupGrid();
                this.chart.draw();
            }
        }
    });

    return Application.ComponentFlotchartComponent;
});