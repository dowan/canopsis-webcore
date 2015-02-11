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
    'app/mixins/pagination',
    'canopsis/uibase/components/progressbar/component'
], 
function($, WidgetFactory, CriticityLevelMixin) {

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

            console.group('Get mixin properties:');
            this.getMixinProperties();
            console.groupEnd();

            console.group('Load series:');
            this.fetchSeries(from, to, replace);
            console.groupEnd();

            console.group('Load metrics:');
            this.fetchMetrics(from, to, replace);
            console.groupEnd();

        },

        getMixinProperties: function(){
            // Colors - always set
            var background_color = Ember.get('mixinOptions.criticitylevels.background_color');
            set(this, "background_color", background_color);
            var warn_color = Ember.get('mixinOptions.criticitylevels.warn_color');
            set(this, "warn_color", warn_color);
            var critic_color = Ember.get('mixinOptions.criticitylevels.critic_color');
            set(this, "critic_color", critic_color);
            
            // Values - may not be set
            var warn_value = Ember.get('mixinOptions.criticitylevels.warn_value');
            set(this, "warn_value", warn_value);
            var crit_value = Ember.get('mixinOptions.criticitylevels.crit_value');
            set(this, "crit_value", crit_value);
            var unit_or_percent = Ember.get('mixinOptions.criticitylevels.unit_or_percent');
            set(this, "unit_or_percent", unit_or_percent);
        },

        fetchSeries: function(from, to, replace) {
            var ctrl = get(this, 'controller');
            var cserie = get(this, 'controllers.serie');
            var series = get(this, 'config.series');
            var store = get(this, 'widgetDataStore');

            var bars = [];
            var cmpt = 0;

            var me = this;
          
            var slength = series.length;
            for(var s = 0; s < slength; s++) {
                var serieId = series[s];
                var total = 0;
                var bar = {};
                store.find('serie', serieId).then(function(result) {
                    var serie = result.content;
                    cserie.fetch(serie, from, to).then(function(result) {   
                        var max = 100;
                        var min = 0;
                        var value = 50;
                        var unit = '';
                        set(bar, "max_value", max);
                        set(bar, "min_value", min);
                        set(bar, "value", value);
                        set(bar, "unit", unit);
                        set(me, "bar", bar);
                    });
                });
            }
        },

        fetchMetrics: function(from, to, replace) {
            var ctrl = get(this, 'controller');
            var perfdata = get(this, 'controllers.perfdata');
            var metrics = get(this, 'config.metrics');
            var store = get(this, 'widgetDataStore');

            var bars = [];
            var cmpt = 0;
            var mlength = metrics.length;

            var me = this;

            for(var m = 0; m < mlength; m++) {

                var metricId = metrics[m];            
                var total = 0;
                var bar = {};

                perfdata.aggregate(metricId, from, to, "last", 86400).then(function(result) {
                    var max = result.data[0].points[0][1];
                    set(bar, "max_value", max);
                });
                perfdata.aggregate(metricId, from, to, "min", 86400).then(function(result) {
                    var min = result.data[0].points[0][1];
                    set(bar, "min_value", min);
                });
                perfdata.aggregate(metricId, from, to, "last", 86400).then(function(result) {
                    var unit = result.data[0].meta.unit;
                    var metric = result.data[0];
                    var timestamp = metric.points[0][0];
                    var value = metric.points[0][1];
                    set(bar, "value", value);
                    set(bar, "unit", unit);
                    bars.pushObject(bar);
                    cmpt += 1;
                });
            }
            set(this, 'bars', bars);
        }
    }, widgetOptions);

    return widget;
});
