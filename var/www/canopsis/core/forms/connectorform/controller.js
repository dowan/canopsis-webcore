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
	'app/application',
	'app/lib/factories/form',
	'utils',
	'app/lib/loaders/schema-manager',
], function(Ember, Application, FormFactory, utils) {

	FormFactory('connectorform', {

		title: "Select a connector",

		availableConnectors: function() {
			var connector = [];

			for (var key in Canopsis.Application.connector) {
				if ( Canopsis.Application.connector.hasOwnProperty( key ) ) {
					var currentConnector = Canopsis.Application.connector[key];
					connector.push(currentConnector);
				}
			}

			return connector;

		}.property('Canopsis.Application.connector'),

		actions: {
			show: function() {
				this._super();
			},

			selectConnector: function (recordType) {
					console.log("add", recordType);

					var recordType = recordType.name;
					var widgetDataStore = this.get("formContext.widgetDataStore");
					var record = widgetDataStore.createRecord(recordType, {
						crecord_type: recordType
					});
					console.log('temp record', record);

					var recordWizard =	utils.forms.showNew('modelform', record , { title : recordType + " connector" , isOnCreate : true , modelname:recordType });

					var listController = Canopsis.Application.listController;

					recordWizard.submit.then(function(form) {
						console.log('record going to be saved', record, form);
						record = form.get('formContext');
						Ember.set(  record , "connector_type" , recordType );
						record.save();
						listController.trigger('refresh');

						listController.startRefresh();
					});
				},
		},

		parentContainerWidget: Ember.required(),
		parentUserview: Ember.required()
	});

	Application.connector = [ "nagios" , "shinken" , "schneider" , "collectd"];
	return Application.WidgetformController;
});
