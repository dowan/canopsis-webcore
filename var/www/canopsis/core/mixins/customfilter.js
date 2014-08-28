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
	*/

	Application.CustomFilterManagerMixin = Ember.Mixin.create({

		actions: {
			addUserFilter: function () {


				var listController = this;

				var record = Canopsis.utils.data.getStore().createRecord('customfilter', {
					crecord_type: 'customfilter'
				});

				var recordWizard = Canopsis.utils.forms.showNew('modelform', record, {
					title: __('Create a custom filter for current list')
				});

				recordWizard.submit.then(function(form) {
					record = form.get('formContext');
					listController.get('filters').pushObject(record);
					console.log('Custom filter created', record, form);
					utils.notification.info(__('Custom filter created'));
				});




			},

			editFilter: function (filter) {

				var listController = this;

				filter.set('crecord_type', 'customfilter');

				var recordWizard = Canopsis.utils.forms.showNew('modelform', filter, {
					title: __('Edit filter for current list')
				});

				recordWizard.submit.then(function(form) {
					listController.get('filters').removeObject(filter);
					record = form.get('formContext');
					listController.get('filters').pushObject(record);
					console.log('Custom filter created', record, form);
					utils.notification.info(__('Custom filter created'));
				});



			},
			removeFilter: function (filter) {
				this.get('filters').removeObject(filter);
				utils.notification.info(__('Custom filter removed'));

			},
		}
	});

	return Application.CustomFilterManagerMixin;
});
