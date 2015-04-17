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
    'app/lib/factories/widget',
    'app/controller/perfdata',
    'app/controller/serie',
    'canopsis/progressbars/components/progressbar/component'
],
function($, Ember, WidgetFactory) {

    var get = Ember.get,
    set = Ember.set,
    isNone = Ember.isNone;

    var widgetOptions = {};

    var ProgressBarElement = Ember.Object.extend({
        value: undefined,
        max_value: undefined,
        min_value: undefined,
        unit: undefined,
        valueLabelInPercent: undefined,

        getPercent: function(min, max, value){
            if(isNaN(value)) {
                return 0;
            }
            if(isNaN(min)) {
                min = 0;
            }
            if(value === max) {
                if(value === 0) {
                    return 0;
                }
                return 100;
            }

            var new_val = value - min;
            if(isNaN(max)){
                max = value;
            }
            var new_max = max - min;
            var percent =  Math.ceil(new_val / new_max * 100);

            if(isNaN(percent)) {
                percent = 0;
            }

            return percent;
        },

        valueLabel: function() {
            var value = get(this, 'value'),
                min_value = get(this, 'min_value'),
                max_value = get(this, 'max_value'),
                unit = get(this, 'unit'),
                valueLabelInPercent = get(this, 'valueLabelInPercent');

            var unitLabelPart = '';
            if(!Ember.isEmpty(unit)) {
                unitLabelPart = ' (' + unit + ')';
            }

            if(valueLabelInPercent) {
                var percentage = this.getPercent(min_value, max_value, value);
                return '<b>' + percentage + '%</b>';
            } else {
                return '<b>' + value + '</b> / ' + max_value + unitLabelPart;
            }

        }.property('value', 'max_value', 'valueLabelInPercent')
    });

    var widget = WidgetFactory('progressbar', {

        needs: ['serie', 'perfdata'],

        timewindowFrom: function() {
            var from = get(this, 'lastRefresh'),
                to = get(this, 'timewindowTo');

            if(from === null) {
                from = to - get(this, 'config.time_window') - get(this, 'config.time_window_offset');
            }

            return from;
        }.property('timewindowTo', 'lastRefresh', 'config.time_window', 'config.time_window_offset'),

        timewindowTo: function() {
            var now = new Date().getTime();
            var to = now - get(this, 'config.time_window_offset');

            return to;
        }.property('config.time_window_offset'),

        findItems: function() {
            set(this, 'bars', []);

            var replace = false;
            var from = get(this, 'lastRefresh');
            var to = get(this, 'timewindowTo');

            if(get(this, 'lastRefresh') === null) {
                replace = true;
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

        showValueLabelInProgressbar: function () {
            if(!get(this, 'config.show_value')) {
                return false;
            }

            return !get(this, 'showValueLabelInColumn');
        }.property('showValueLabelInColumn', 'config.show_value'),

        showValueLabelInColumn: function () {
            if(!get(this, 'config.show_value')) {
                return false;
            }

            return get(this, 'config.value_in_column');
        }.property('config.value_in_column', 'config.show_value'),

        displayAsProgressbar: function() {
            return get(this, 'model.display_as') === 'progressbar';
        }.property('model.display_as'),

        getProperties: function(){
            var standard_color = get(this, 'mixinOptions.criticitylevels.standard_color');
            set(this, 'standard_color', standard_color);
            var warn_color = get(this, 'mixinOptions.criticitylevels.warn_color');
            set(this, 'warn_color', warn_color);
            var critic_color = get(this, 'mixinOptions.criticitylevels.critic_color');
            set(this, 'critic_color', critic_color);

            // Values - may not be set
            var warn_value = get(this, 'mixinOptions.criticitylevels.warn_value');
            set(this, 'warn_value', warn_value);
            var crit_value = get(this, 'mixinOptions.criticitylevels.crit_value');
            set(this, 'crit_value', crit_value);
            var unit_or_percent = get(this, 'mixinOptions.criticitylevels.unit_or_percent');
            set(this, 'unit_or_percent', unit_or_percent);
        },

        fetchSeries: function(from, to, replace) {
            var store = get(this, 'widgetDataStore');
            //var series = get(this, 'config.series');

            var bars = get(this, 'bars');

            var controller = this,
                seriesController = get(controller, 'controllers.serie'),
                series;

            var seriesValues = get(this, 'series');
            if (!isNone(seriesValues)) {

                var seriesFilter = JSON.stringify({
                    crecord_name: {'$in': seriesValues}
                });

                console.log('widget text series duration queries', from, to);
                store.findQuery('serie', {filter: seriesFilter}).then(function(results) {

                    series = get(results, 'content');
                    console.log('series records', series);

                    //Event query is the first param if any rk have to be fetched
                    var seriesQueries = [];
                    for (var i = 0, l = series.length; i < l; i++) {
                        seriesQueries.pushObject(seriesController.fetch(
                            series[i],
                            from,
                            to
                        ));
                    }

                    console.log('seriesQueries', seriesQueries);

                    Ember.RSVP.all(seriesQueries).then(function(pargs) {
                        for (var i=0, l=pargs.length; i<l; i++) {
                            var data = pargs[i],
                                displayValue = 0,
                                min,
                                max;

                            console.log('series pargs', pargs);

                            if (data.length) {
                                //choosing the value for the last point when any
                                displayValue = data[data.length - 1][1];
                                var boundaries = controller.getSerieBoundaries(data);
                                min = boundaries[0];
                                max = boundaries[1];
                            }
                            var serieName = get(series[i], 'crecord_name');
                            var bar = ProgressBarElement.create({
                                id : serieName,
                                label : serieName,
                                max_value : max,
                                min_value : min,
                                valueLabelInPercent: get(this, 'config.label_in_percent'),
                                value : displayValue,
                                unit : '',
                                style_bar : '',
                                style_label : '',
                                style_content : '',
                                style_span : '',
                                text_percent : ''
                            });

                            bars.pushObject(bar);
                        }
                    });


                });
            }
        },

        fetchMetrics: function(from, to, replace) {
            var metrics = get(this, 'config.metrics');

            var bars = get(this, 'bars');

            if(metrics) {
                for(var m = 0, l = metrics.length; m < l; m++) {
                    var metricId = metrics[m];

                    var bar = ProgressBarElement.create({
                        id : metricId,
                        label : this.getName(metricId),
                        max_value : 100,
                        min_value : 0,
                        value : 0,
                        valueLabelInPercent: get(this, 'config.label_in_percent'),
                        unit : '',
                        style_bar : '',
                        style_label : '',
                        style_content : '',
                        style_span : '',
                        text_percent : ''
                    });

                    bars.pushObject(bar);

                    this.getUnitAndValue(from, to, metricId);
                }
            }
        },

        getName: function(name){
            return name.split('/').slice(-2).join(' ');
        },

        getMaxValue: function(from, to, metricId) {
            var perfdata = get(this, 'controllers.perfdata'),
                me = this;

            perfdata.aggregate(metricId, from, to, 'max', 86400).then(function(rmax){
                var max = rmax.data[0].points[0][1];
                var bars = get(me, 'bars');
                var bar = bars.findBy('id', metricId);
                if( ! Ember.isEmpty(bar)) {
                    set(bar, 'max_value', max);
                }
            });
        },

        getMinValue: function(from, to, metricId) {
            var perfdata = get(this, 'controllers.perfdata'),
                me = this;

            perfdata.aggregate(metricId, from, to, "min", 86400).then(function(rmin){
                var min = rmin.data[0].points[0][1];
                var bars = get(me, 'bars');
                var bar = bars.findBy('id', metricId);
                if( ! Ember.isEmpty(bar)) {
                    set(bar, 'min_value', min);
                }
            });
        },

        getUnitAndValue: function(from, to, metricId) {
            var perfdata = get(this, 'controllers.perfdata'),
                me = this;

            perfdata.aggregate(metricId, from, to, 'last', 86400).then(function(result){
                var value = result.data[0].points[0][1];
                var bars = get(me, 'bars');
                var bar = bars.findBy('id', metricId),
                    min,
                    max,
                    unit;

                if(Ember.isEmpty(result.data[0].meta)){
                    me.getMinValue(from, to, metricId);
                    me.getMaxValue(from, to, metricId);
                } else {
                    unit = result.data[0].meta.unit;
                    if(!unit){
                        unit = '';
                    }

                    min = result.data[0].meta.value.min;
                    if(isNaN(min)){
                        min = 0;
                    }

                    max = result.data[0].meta.value.max;
                    if(isNaN(max)){
                        max = undefined;
                        me.getMaxValue(from, to, metricId);
                    }
                }
                if(!Ember.isEmpty(bar)) {

                    set(bar, 'value', value);
                    set(bar, 'unit', unit);
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
            var min, max;

            for(var i = 0, l = data.length; i < l; i++) {
                var point = data[i];
                if (isNone(min) || point[1] < min) {
                    min = point[1];
                }
                if (isNone(max) || point[1] > max) {
                    max = point[1];
                }
            }
            return [min, max];
        }

    }, widgetOptions);

    return widget;
});
