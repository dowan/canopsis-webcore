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
function($, WidgetFactory, Perfdata, Serie, ProgressbarComponent) {

    var get = Ember.get,
    set = Ember.set,
    isNone = Ember.isNone;

    var widgetOptions = {};

    var widget = WidgetFactory('progressbar', {

        needs: ['serie', 'perfdata'],

        findItems: function() {

            set(this, "bars", []);
        
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
            //this.getProperties();
            console.groupEnd();

            console.group('Load series:');
            this.fetchSeries(from, to, replace);
            console.groupEnd();

            console.group('Load metrics:');
            this.fetchMetrics(from, to, replace);
            console.groupEnd();

            this.trigger('refresh');

        },

        getProperties: function(){
            // Label
            var show_value = get('config.show_value');
            set(this, "show_value", show_value);
            var label_align = get('config.label_align');
            set(this, "label_align", label_align);
            var label_display = get('config.label_display');
            set(this, "label_display", label_display);
            var label_width = get('config.label_width');
            set(this, "label_width", label_width);
            var label_unit = get('config.label_unit');
            set(this, "label_unit", label_unit); 

            // Colors - always set
            var standard_color = get('mixinOptions.criticitylevels.standard_color');
            set(this, "standard_color", standard_color);
            var warn_color = get('mixinOptions.criticitylevels.warn_color');
            set(this, "warn_color", warn_color);
            var critic_color = get('mixinOptions.criticitylevels.critic_color');
            set(this, "critic_color", critic_color);
            
            // Values - may not be set
            var display_as = get('config.display_as');
            set(this, "display_as", display_as);
            var warn_value = get('mixinOptions.criticitylevels.warn_value');
            set(this, "warn_value", warn_value);
            var crit_value = get('mixinOptions.criticitylevels.crit_value');
            set(this, "crit_value", crit_value);
            var unit_or_percent = get('mixinOptions.criticitylevels.unit_or_percent');
            set(this, "unit_or_percent", unit_or_percent);
    
            // Specifics
            var pb_thickness = get('config.pb_thickness');
            set(this, "pb_thickness", pb_thickness);
            var gg_width = get('config.gg_width');
            set(this, "gg_width", gg_width);
            var gg_thickness = get('config.gg_thickness');
            set(this, "gg_thickness", gg_thickness);
        },

        fetchSeries: function(from, to, replace) {
            var store = get(this, 'widgetDataStore');
            var series = get(this, 'config.series');

            var bars = get(this, "bars");
            var me = this;
          
            var slength = series.length;

            for(var s = 0; s < slength; s++) {

                var serieId = series[s];
                var bar = {};

                store.find('serie', serieId).then(function(result) {

                    var serie = result.content;

                    get(me, 'controllers.serie').fetch(serie, from, to).then(function(result) {
                        bar["label"] = result.data[0].crecord_name;
                        bar["unit"] = result.data[0].meta.unit;
                        slength = result.data.length;
                        if(slength > 0){
                            min = -1;
                            max = -1;
                            for(var i = 0; i < slength; i++) {
                                var points = result.data[i].points;
                                for(var j = 0; j < points.length; j++) {
                                    var val = points[j][1];
                                    if(min <0 || val < min){
                                        min = val;
                                    }
                                    if(max <0 || val > max){
                                        max = val;
                                    }
                                }
                            }
                            bar["value"] = result.data[result.data.length].points[result.data[i].points.length-1][1];
                            bar["min_value"] = min;
                            bar["max_value"] = max;
                        } else {
                            bar["value"] = 0;
                            bar["min_value"] = 0;
                            bar["max_value"] = 0;
                        }

                        bars.pushObject(bar);

                    });

                });
            }
            set(this, 'bars', bars);
        },

        fetchMetrics: function(from, to, replace) {
            var metrics = get(this, 'config.metrics');
            var store = get(this, 'widgetDataStore');


            var bars = get(this, "bars");
            var mlength = metrics.length;
            var me = this;

            for(var m = 0; m < mlength; m++) {

                var metricId = metrics[m];            

                bar = {
                    "id" : metricId,
                    "label" : this.getName(metricId),
                    "max_value" : 100,
                    "min_value" : 0,
                    "value" : 50,
                    "unit" : ""
                };

                get(this, "bars").pushObject(bar);

                this.getUnitAndValue(from, to, metricId);

            }
        },

        getName: function(name){
            return name.split("/").slice(-2).join(" ");
        },

        getMaxValue: function(from, to, metricId) {
            var perfdata = get(this, 'controllers.perfdata');
            var me = this;
            perfdata.aggregate(metricId, from, to, "max", 86400).then(function(rmax){
                var max = rmax.data[0].points[0][1];
                var bars = get(me, 'bars');
                var bar = bars.findBy('id', metricId);
                var index = bars.indexOf(bar);
                if( ! Ember.isEmpty(bar)) {
                    set(bar, 'max_value', max);
                }
                bars.replace(index, 0, bar);
                //me.trigger('refresh');
            });
        },

        getMinValue: function(from, to, metricId) {
            var perfdata = get(this, 'controllers.perfdata');
            var me = this;
            perfdata.aggregate(metricId, from, to, "min", 86400).then(function(rmin){
                var min = rmin.data[0].points[0][1];
                var bars = get(me, 'bars');
                var bar = bars.findBy('id', metricId);
                var index = bars.indexOf(bar);
                if( ! Ember.isEmpty(bar)) {
                    set(bar, 'min_value', min);
                }
                bars.replace(index, 0, bar);
                //me.trigger('refresh');
            });
        },

        getUnitAndValue: function(from, to, metricId) {
            var perfdata = get(this, 'controllers.perfdata');
            var me = this;
            perfdata.aggregate(metricId, from, to, "last", 86400).then(function(result){
                var value = result.data[0].points[0][1];
                var unit = result.data[0].meta.unit;
                var min = result.data[0].meta.min;
                if(isNaN(min)){
                    min = 0;
                }
                var max = result.data[0].meta.max;
                if(isNaN(max)){
                    me.getMaxValue(from, to, metricId);
                }
                var bars = get(me, 'bars');
                var bar = bars.findBy('id', metricId);
                var index = bars.indexOf(bar);
                if( ! Ember.isEmpty(bar)) {
                    set(bar, 'value', value);
                    set(bar, 'unit', unit);
                    set(bar, 'min_value', min);
                    if(isNaN(max)){
                        set(bar, 'max_value', max);
                    }
                }
                bars.replace(index, 0, bar);
                //me.trigger('refresh');
            });
        },
        
    }, widgetOptions);

    return widget;
});
