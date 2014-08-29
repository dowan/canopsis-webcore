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
	'ember-data',
	'app/application',
	'utils'
], function(Ember, DS, Application, utils) {

	/**
	  Implements Custom filter management for list
	  A filter is a combination of a cfilter and a title.
	  Custom cfilter allow perform selelection on a list with custom filter information.
	*/

	Application.CustomFilterManagerMixin = Ember.Mixin.create({

		actions: {
			addUserFilter: function () {


				var widgetController = this;

				var record = Canopsis.utils.data.getStore().createRecord('customfilter', {
					crecord_type: 'customfilter'
				});

				var recordWizard = Canopsis.utils.forms.showNew('modelform', record, {
					title: __('Create a custom filter for current list')
				});

				recordWizard.submit.then(function(form) {
					record = form.get('formContext');
					widgetController.get('filters').pushObject(record);
					console.log('Custom filter created', record, form);
					utils.notification.info(__('Custom filter created'));
					widgetController.set('userParams.filters', widgetController.get('filters'));
					widgetController.get('userConfiguration').saveUserConfiguration();

				});

			},

			editFilter: function (filter) {

				var widgetController = this;

				var filterValue;
				var filterTitle;

				try {
					//gets data from ember instance if object is ember object
					filterValue = filter.get('filter');
					filterTitle = filter.get('title');
				} catch (err) {
					//gets data from js object if not ember object
					filterValue = filter.filter;
					filterTitle = filter.title;
				}
				//rebuild a crecord as data may be simple js object saved to userpreferences
				var record = Canopsis.utils.data.getStore().createRecord('customfilter', {
					crecord_type: 'customfilter',
					filter: filterValue,
					title: filterTitle,
				});


				var recordWizard = Canopsis.utils.forms.showNew('modelform', record, {
					title: __('Edit filter for current list')
				});

				recordWizard.submit.then(function(form) {
					widgetController.get('filters').removeObject(filter);
					record = form.get('formContext');
					widgetController.get('filters').pushObject(record);
					console.log('Custom filter created', record, form);
					utils.notification.info(__('Custom filter created'));
					widgetController.set('userParams.filters', widgetController.get('filters'));
					widgetController.get('userConfiguration').saveUserConfiguration();

				});

			},

			removeFilter: function (filter) {
				this.get('filters').removeObject(filter);
				utils.notification.info(__('Custom filter removed'));
				this.set('userParams.filters', this.get('filters'));
				this.get('userConfiguration').saveUserConfiguration();

			},
		}
	});

	return Application.CustomFilterManagerMixin;
});
