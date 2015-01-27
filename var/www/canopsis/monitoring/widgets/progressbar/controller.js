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
    'app/lib/factories/widget',
    'app/controller/perfdata',
    'app/controller/serie',
    'canopsis/uibase/components/progressbar/component'
], 
function($, WidgetFactory) {

    var get = Ember.get,
    set = Ember.set;

    var widgetOptions = {};

    var widget = WidgetFactory('progressbar', {

        needs: ['serie', 'perfdata'],

        findItems: function() {
            var replace = false;
            var from = get(this, 'lastRefresh');
            var now = new Date().getTime();
            var to = now - get(this, 'config.time_window_offset');

            if(from === null) {
                replace = true;
                from = to - get(this, 'config.time_window') - get(this, 'config.time_window_offset');
            }

            console.log('refresh:', from, to, replace);

            console.group('Load metrics:');
            this.fetchMetrics(from, to, replace);
            console.groupEnd();
        },
        fetchMetrics: function(from, to, replace) {
            var perfdata = get(this, 'controllers.perfdata');
            var metrics = get(this, 'config.metrics');

            var vals = [];
            var cmpt = 0;
            var mlength = metrics.length;

            for(var m = 0; m < mlength; m++) {

                var metricId = metrics[m];            
                var total = 0;

                var me = this;
                perfdata.aggregate(metricId, from, to, "last", 0).then(function(result) {

                    var nmetric = result.total;
                    var metrics = result.data;

                    var unit = result.data[0].meta.unit;
                    set(me, 'unit', unit);

                    var metric = result.data[i];
                    var timestamp = metric.points[0][0];
                    var value = metric.points[0][1];
                    vals[cmpt] = value;
                    cmpt += 1;


                });
            }
        }
    }, widgetOptions);

    return widget;
});

