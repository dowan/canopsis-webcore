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
	//'ember',
    //'ember-data',
    //'app/lib/utils/values',
	'app/lib/factories/widget',
	'app/controller/perfdata',
	'canopsis/uibase/components/progressbar/component'
], 
function($, WidgetFactory) {

	var get = Ember.get,
	set = Ember.set;

	var widgetOptions = {};

	var widget = WidgetFactory('progressbar', {

		needs: ['serie', 'perfdata'],

		init: function() {
			this._super();
		},
        time_window: function() {
            return get(this, 'config.time_window') * 1000;
        }.property('config.time_window'),

        time_window_offset: function() {
            return get(this, 'config.time_window_offset') * 1000;
        }.property('config.time_window_offset'),

		aggregate_method: function(){
			return get(this, 'config.aggregate_method')
		}.property('config.aggregate_method'),

        findItems: function() {
            var replace = false;
            var from = get(this, 'lastRefresh');
            var now = new Date().getTime();
            var to = now - get(this, 'time_window_offset');

            if(from === null) {
                replace = true;
                from = to - get(this, 'time_window') - get(this, 'time_window_offset');
            }

            console.log('refresh:', from, to, replace);

            console.group('Load metrics:');
            this.fetchMetrics(from, to, replace);
            console.groupEnd();
        },
        fetchMetrics: function(from, to, replace) {
			var perfdata = get(this, 'controllers.perfdata');
            var metrics = get(this, 'config.metrics');

			var aggregate_method = get(this, 'aggregate_method');
			var aggregate_interval = get(this, 'aggregate_interval');
			var vals = [];
			var cmpt = 0;

			for(var m = 0; m < metrics.length; m++) {

				var metricId = metrics[m];			
				var total = 0;

				var me = this;
				perfdata.aggregate(metricId, from, to, aggregate_method, aggregate_interval).then(function(result) {

					var nmetric = result.total;
					var metrics = result.data;

					var unit = result.data[0].meta.unit;
					set(me, 'unit', unit);

					for(var i = 0; i < nmetric; i++) {
						var metric = result.data[i];
						var timestamp = metric.points[0][0];
						var value = metric.points[0][1];
						vals[cmpt] = value;
						cmpt += 1;
					}
				});
				
			}

            console.group('Generate Values:');
            this.generateValue(vals, aggregate_method);
            console.groupEnd();
			
        },
        generateValue: function(vals, aggregate_method) {
            console.group('Generate Value ProgressBar');
			switch(aggregate_method) {
				case "last":
					set(this, 'value', 0);
					break;
				case "first":
					set(this, 'value', 0);
					break;
				case "min":
					set(this, 'value', 0);
					break;
				case "max":
					set(this, 'value', 0);
					break;
				case "average":
					set(this, 'value', 0);
					break;
				case "sum":
					set(this, 'value', 0);
					 break;
				default:
					set(this, 'value', 0);
			} 
			set(this, 'value', 75);

			this.generateConfig();
            console.groupEnd();
        },
        generateConfig: function() {
            console.group('Generate Config ProgressBar');
            var config = get(this, 'config');
			set(this, "min_value", get(config, "min_value"));
			set(this, "warn_value", get(config, "warn_value"));
			set(this, "crit_value", get(config, "crit_value"));
			set(this, "max_value", get(config, "max_value"));
			set(this, "background_color", get(config, "background_color"));
			set(this, "start_color", get(config, "start_color"));
			set(this, "warn_color", get(config, "warn_color"));
			set(this, "critic_color", get(config, "critic_color"));
			set(this, "thickness", get(config, "thickness"));
			set(this, "vertical", get(config, "vertical"));
			set(this, "height", get(config, "height"));
			set(this, "label", get(config, "label"));
			set(this, "labeldisplay", get(config, "labeldisplay"));
			set(this, "labelalign", get(config, "labelalign"));
			set(this, "labelvertical", get(config, "labelvertical"));
			set(this, "show_value", get(config, "show_value"));
			set(this, "labelwidth", 0);
			console.groupEnd();
        }
    }, widgetOptions);


    return widget;
});

