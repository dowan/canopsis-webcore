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
	'app/application'
], function($, Ember, Application) {

			Application.ProgressBars = Ember.View.extend({
			classNames: 'progress',

			template: function(context , data) {
				arguments = arguments;
				var statusClass = data.data.view.get('statusClass'),
						percent     = data.data.view.get('percent'),
						widthStyle  = "style='width: %@%;'".fmt(percent);
						template = "<div class='progress'><div class='progress-bar" +(statusClass ? " " + statusClass : '') + "' " + widthStyle + "></div></div>";
				return template;
			},

			percent: 0,
			status: undefined,

			percentDidChange: Ember.observer(function() {
				var percent = this.get('percent') || 0;
				this.$('.bar').css('width', percent + "%");
			}, 'percent'),

			statusClass: Ember.computed(function() {
				var status = this.get('status');
				return status == null ? '' : 'bar-' + status;
			}).property('status').cacheable(),

			statusClassWillChange: Ember.beforeObserver(function() {
				this.$('.bar').removeClass(this.get('statusClass'));
			}, 'statusClass'),

			statusClassDidChange: Ember.observer(function() {
				this.$('.bar').addClass(this.get('statusClass'));
			}, 'statusClass')
	});

	return Application.ProgressBars;
});