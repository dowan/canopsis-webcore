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
            this.getProperties();
            console.groupEnd();

            console.group('Load series:');
            this.fetchSeries(from, to, replace);
            console.groupEnd();

            console.group('Load metrics:');
            this.fetchMetrics(from, to, replace);
            console.groupEnd();

            this.trigger('refresh');

        },

        getPercent: function(min, max, value){
            if(isNaN(value)){
                return 0;
            }
            if(isNaN(min)){
                min = 0;
            }
            if(value == max){
                if(value == 0){
                    return 0;
                }
                return 100;
            }
            var new_val = value - min;
            if(isNaN(max)){
                max = value;
            }
            var new_max = max - min;
            var percent =  Math.ceil(new_val/new_max * 100);
            if(isNaN(percent)){
                percent = 0;
            }
            return percent;
        },

        getProperties: function(){
            // Label
            var show_value = get(this, 'config.show_value');
            set(this, "show_value", show_value);
            var label_align = get(this, 'config.label_align');
            set(this, "label_align", label_align);
            var label_display = get(this, 'config.label_display');
            set(this, "label_display", label_display);
            var label_width = get(this, 'config.label_width');
            set(this, "label_width", label_width);
            var label_unit = get(this, 'config.label_unit');
            set(this, "label_unit", label_unit); 

            // Colors - always set
            var standard_color = get(this, 'mixinOptions.criticitylevels.standard_color');
            set(this, "standard_color", standard_color);
            var warn_color = get(this, 'mixinOptions.criticitylevels.warn_color');
            set(this, "warn_color", warn_color);
            var critic_color = get(this, 'mixinOptions.criticitylevels.critic_color');
            set(this, "critic_color", critic_color);
            
            // Values - may not be set
            var display_as = get(this, 'config.display_as');
            set(this, "display_as", display_as);
            var warn_value = get(this, 'mixinOptions.criticitylevels.warn_value');
            set(this, "warn_value", warn_value);
            var crit_value = get(this, 'mixinOptions.criticitylevels.crit_value');
            set(this, "crit_value", crit_value);
            var unit_or_percent = get(this, 'mixinOptions.criticitylevels.unit_or_percent');
            set(this, "unit_or_percent", unit_or_percent);
    
            // Specifics
            var pb_thickness = get(this, 'config.pb_thickness');
            set(this, "pb_thickness", pb_thickness);
            var gg_width = get(this, 'config.gg_width');
            set(this, "gg_width", gg_width);
            var gg_thickness = get(this, 'config.gg_thickness');
            set(this, "gg_thickness", gg_thickness);
            var gg_fill = get(this, 'config.gg_fill');
            set(this, "gg_fill", gg_fill);
            var gg_border = get(this, 'config.gg_border');
            set(this, "gg_border", gg_border);
            var value_color = get(this, 'config.value_color');
            set(this, "value_color", value_color);
            var value_in_column = get(this, 'config.value_in_column');
            set(this, "value_in_column", value_in_column);
        },

        fetchSeries: function(from, to, replace) {
            var store = get(this, 'widgetDataStore');
            //var series = get(this, 'config.series');

            var bars = get(this, "bars");

            var controller = this,
                seriesController = get(controller, 'controllers.serie'),
                series;

            var seriesValues = get(this, 'series');
            if (!isNone(seriesValues)) {

                //Declared here for translation purposes
                var valueNotDefined = __('No data available');

                var seriesFilter = JSON.stringify({
                    crecord_name: {'$in': seriesValues}
                });

                console.log('widget text series duration queries', from, to);
                get(this, 'widgetDataStore').findQuery('serie', {filter: seriesFilter}).then(function(results) {

                    series = get(results, 'content');
                    console.log('series records', series);

                    //Event query is the first param if any rk have to be fetched
                    var seriesQueries = [];
                    for (var i = 0, l = series.length; i < l; i++) {
                        seriesQueries.push(seriesController.fetch(
                            series[i],
                            from,
                            to
                        ));
                    }

                    console.log('seriesQueries', seriesQueries);

                    Ember.RSVP.all(seriesQueries).then(function(pargs) {
                        for (var i=0, l=pargs.length; i<l; i++) {
                            var data = pargs[i];
                            console.log('series pargs', pargs);
                            var displayValue = 0;
                            var min = null, max = null;
                            if (data.length) {
                                //choosing the value for the last point when any
                                displayValue = data[data.length - 1][1];
                                var boundaries = controller.getSerieBoundaries(data);
                                min = boundaries[0];
                                max = boundaries[1];
                            }
                            var serieName = get(series[i], 'crecord_name');
                            var percent = controller.getPercent(min, max, displayValue);
                            var bar = {
                                "id" : serieName,
                                "label" : serieName,
                                "max_value" : max,
                                "min_value" : min,
                                "value" : displayValue,
                                "percent" : percent,
                                "unit" : "",
                                "style_bar" : "",
                                "style_label" : "",
                                "style_content" : "",
                                "style_span" : "",
                                "text_percent" : ""
                            }
                            get(controller, "bars").pushObject(bar);
                        }
                        //controller.setReady('serie');
                    });


                });
            }
        },

        fetchMetrics: function(from, to, replace) {
            var metrics = get(this, 'config.metrics');
            var store = get(this, 'widgetDataStore');

            var bars = get(this, "bars");
            if(metrics){
                var mlength = metrics.length;
            } else {
                var mlength = 0;
            }
            var me = this;

            for(var m = 0; m < mlength; m++) {

                var metricId = metrics[m];            

                bar = {
                    "id" : metricId,
                    "label" : this.getName(metricId),
                    "max_value" : 100,
                    "min_value" : 0,
                    "value" : 0,
                    "percent" : 0,
                    "unit" : "",
                    "style_bar" : "",
                    "style_label" : "",
                    "style_content" : "",
                    "style_span" : "",
                    "text_percent" : ""
                }

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
                var percent = me.getPercent(get(bar, "min_value"), max,  get(bar, "value"));
                set(bar, 'percent', percent);
                //bars.replace(index, 0, bar);
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
                var percent = me.getPercent(min, get(bar, "max_value"), get(bar, "value"));
                set(bar, 'percent', percent);
                //bars.replace(index, 0, bar);
                //me.trigger('refresh');
            });
        },

        getUnitAndValue: function(from, to, metricId) {
            var perfdata = get(this, 'controllers.perfdata');
            var me = this;
            perfdata.aggregate(metricId, from, to, "last", 86400).then(function(result){
                var value = result.data[0].points[0][1];
                var bars = get(me, 'bars');
                var bar = bars.findBy('id', metricId);
                var index = bars.indexOf(bar);

                if(Ember.isEmpty(result.data[0].meta)){
                    var min = undefined;
                    var max = undefined;
                    me.getMinValue(from, to, metricId);
                    me.getMaxValue(from, to, metricId); 
                } else {
                    var unit = result.data[0].meta.unit;
                    if(!unit){
                        unit = "";
                    }
                    var min = result.data[0].meta.value.min;
                    if(isNaN(min)){
                        min = 0;
                    }
                    var max = result.data[0].meta.value.max;
                    if(isNaN(max)){
                        max = undefined;
                        me.getMaxValue(from, to, metricId);
                    }
                }
                if( ! Ember.isEmpty(bar)) {

                    set(bar, 'value', value);
                    set(bar, 'unit', unit);
                    var percent = me.getPercent(min, max, value);
                    set(bar, 'percent', percent);
                    if(!isNaN(min)){
                        set(bar, 'min_value', min);
                    }
                    if(!isNaN(max)){
                        set(bar, 'max_value', max);
                    }
                }

                //bars.replace(index, 0, bar);
                me.trigger('refresh');
            });
        },
        
        getSerieBoundaries: function(data) {
            var min = null, max = null;
            for(var i = 0, l = data.length; i < l; i++) {
                var point = data[i];
                if (min === null || point[1] < min) {
                    min = point[1];
                }
                if (max === null || point[1] > max) {
                    max = point[1];
                }
            }
            return [min, max];
        }

    }, widgetOptions);

    return widget;
});
