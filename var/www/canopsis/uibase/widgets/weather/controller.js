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
	'app/lib/factories/widget'
], function($, WidgetFactory) {
	var get = Ember.get;

	var widget = WidgetFactory('weather', {
		init: function() {
			this._super();
			this.set('worst_state', 0);
			this.set('sub_weather', []);
			this.fetchStates();
			console.log('Setting up weather widget : ' + this.get('config.title'));
		},

		actions: {
			goToInfo: function(element) {
				console.log("goToInfo", element);
				var transition = this.transitionToRoute("/userview/" + get(this, 'config.destination_view'));

				var filter_pattern = get(this, 'config.filter_pattern');

				transition.promise.then(function(routeInfos){
					console.log("transition done", routeInfos);
					var list = get(routeInfos, 'controller.content.containerwidget');
					list = get(list, '_data.items')[0];
					list = get(list, 'widget');
					console.log(list);

					console.log("filter_pattern", filter_pattern);

					var template = filter_pattern;
					var context = element;
					var compiledFilterPattern = Handlebars.compile(template)(context);

					console.log("compiledFilterPattern", compiledFilterPattern);

					list.set("default_filter", compiledFilterPattern);
					list.set("rollbackable", true);
					list.set("title", "Info on events : " + element.title);
				});
			}
		},

		//generate and refresh the title
		title: function () {
			return this.get('config.title');
		}.property('config.title'),

		icon: function () {
			return this.class_icon(this.get('worst_state'));
		}.property('worst_state'),

		//generate weather class depending on status
		class_icon: function (status) {
			return 'ion-ios7-' + [
				'sunny',
				'cloudy',
				'thunderstorm',
				'thunderstorm',
				''][status] + '-outline';
		},

		//generate and refresh background property for widget weather display
		background: function () {
			return this.class_background(this.get('worst_state'));
		}.property('worst_state'),

		//generate weather class depending on status
		class_background: function (status) {
			return [
				'bg-green',
				'bg-orange',
				'bg-red',
				'bg-red',
				'bg-yellow'][status];
		},

		fetchStates: function () {
			var that = this;
			var rks = that.get('config.event_selection');

			if (!rks || !rks.length) {
				console.warn('Widget weather ' + this.get('title') + ' No rk found, the widget may not be configured properly');
				return;
			}


			//TODO avoid using 0 as limit. A better practivce should be used, like limiting to 1000 and display a warning if payload.length > 1000
			var params = {
				limit: 0,
				ids: JSON.stringify(rks)
			};

			$.ajax({
				url: '/rest/events',
				data: params,
				success: function(data) {
					if (data.success) {
						that.computeWeather(data.data);
					} else {
						console.error('Unable to load event information for weather widget from API');
					}
					that.trigger('refresh');
					console.log(' + Weather content', that.get('config.event_selection'));
				}
			});
		},

		computeWeather: function (data) {
			//TODO change "data" argument name, and "currentData" var name accordingly
			console.group('computing weathers');
			var worst_state = 0;
			var sub_weathers = [];
			var ack_count = 0;
			var computedState = 0;

			for (var i = 0, l = data.length; i < l; i++) {

				var currentData = data[i];

				console.log("subweather event", currentData);

				//compute wether or not each event were acknowleged for this weather
				if (currentData.ack && currentData.ack.isAck) {
					console.log('one more ack count')
					ack_count++;
					computedState = 4;
				} else {
					console.log('normal ack count')
					computedState = data[i].state;
				}

				//computing worst state for general weather display
				if (currentData.state > worst_state) {
					worst_state = currentData.state;
				}

				//compute sub item title depending on if resource exists
				var resource = '';
				if (currentData.resource) {
					resource = ' ' + currentData.resource;
				}

				console.log('computedState', computedState);

				//building the data structure for sub parts of the weather
				var subweatherDict = {
					rk: currentData.rk,
					event_type : get(currentData, 'event_type'),
					isSelector : get(currentData, 'event_type') === "selector",
					component: get(currentData, 'component'),
					resource: get(currentData, 'resource'),
					title: get(currentData, 'component') + resource,
					custom_class: this.class_background(computedState)
				};

				if(get(currentData, "event_type") === "selector") {
					this.generateSelectorFilter(currentData, subweatherDict);
				}

				sub_weathers.push(subweatherDict);

			}

			if (ack_count === data.length) {
				worst_state = 4;
			}
			console.log('worst_state', worst_state);

			console.log('weather content', {sub_weathers: sub_weathers, worst_state: worst_state});
			this.set('sub_weather', sub_weathers);
			this.set('worst_state', worst_state);

			console.groupEnd();

			this.trigger('refresh');
		},

		generateSelectorFilter: function (event, subweatherDict) {
			console.log('generateSelectorFilter', arguments);

			var params = {
				limit: 1,
				ids: JSON.stringify(get(event, 'selector_id'))
			};

			$.ajax({
				url: '/rest/object',
				data: params,
				success: function(payload) {
					console.log("### SUCCESS", payload);
					if(payload.data.length >= 1) {
						var filter = {"$or" : []};

						var selectorObject = payload.data[0];
						var include_ids = get(selectorObject, 'include_ids');
						var exclude_ids = get(selectorObject, 'exclude_ids');
						var mfilter = get(selectorObject, 'mfilter');

						if(include_ids && include_ids.length) {
							filter.$or.push({ _id : { $in: include_ids}});
						}

						if(exclude_ids && exclude_ids.length) {
							filter.$or.push({ _id : { $nin: exclude_ids}});
						}

						if(mfilter) {
							filter.$or.push(JSON.parse(mfilter));
						}

						Ember.set(subweatherDict, 'selector_filter', JSON.stringify(filter));
					}
				}
			});
		},

		refreshContent: function () {
			this.fetchStates();
			this._super();
		}
	});

	return widget;
});