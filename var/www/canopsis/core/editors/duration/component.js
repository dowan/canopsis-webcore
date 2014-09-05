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
	'ember',
	'app/application'
], function(Ember, Application) {
	Application.ComponentDurationComponent = Ember.Component.extend({


		init: function() {
			this._super();

			this.set('field', {
				'second' : __('Second'),
				'minute' :__('Minute'),
				'hour' : __('Hour'),
				'day' : __('Day'),
				'year' : __('Year')
			});

			this.set('convertDuration', {
				'second' : 1,
				'minute' : 60,
				'hour' : 3600,
				'day' : 3600 * 24,
				'year' : 3600 * 24 * 12
			});


			this.set('durationType', [
				__('Second'),
				__('Minute'),
				__('Hour'),
				__('Day'),
				__('Year')
			]);

			console.log('duration values', this.get('convertDuration'), this.get('durationType'));

			//default
			this.set('selectedDurationType', this.get('field.second'));

			//initialize component with existing integer value if any
			if (!Ember.isNone(this.get('content'))){
				var dTypes = this.get('durationType');
				for (var i=dTypes.length; i>0; i++) {
					var durationInteger = this.get('content') / this.get('convertDuration')[dTypes[i]];
					if (durationInteger > 1) {
						this.set('selectedDurationType', dTypes[i]);
						this.set('durationValue', durationInteger);
					}
				}
			}

		},

		updateContent: function () {


			var duration = this.get('durationValue') * convertDuration[this.get('selectedDurationType')];

			//positives values only
			if (duration < 0) {
				duration = 0;
				this.set('durationValue', 0)
			}

			this.set('content', duration);

			console.log('Duration recomputed : ' + duration);

		}.observes('selectedDurationType', 'durationValue')
	});

	return Application.ComponentDurationComponent;
});