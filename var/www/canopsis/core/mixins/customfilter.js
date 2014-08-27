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

/*
				var listController = this;

				var record = Canopsis.utils.data.getStore().createRecord('customfilter', {
					crecord_type: 'customfilter'
				});

				var recordWizard = Canopsis.utils.forms.showNew('modelform', record, {
					title: __('Create a custom filter for current list')
				});

				recordWizard.submit.done(function() {
					console.log('plop')
					record = form.get('formContext');
					listController.filters.push(record);
					console.log('Custom filter created', record, form);
					utils.notification.info(__('Custom filter created'));
				});
*/



			},

			editFilter: function (filter) {

				console.log('edit', filter);

			},
			removeFilter: function (filter) {

				console.log('remove', filter);

			},
		}
	});

	return Application.CustomFilterManagerMixin;
});
