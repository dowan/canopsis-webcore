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
	'utils'
], function(Ember, Application, utils) {

	/**
	  Implements methods to send event to api from widget list
	*/

	Application.sendEventMixin = Ember.Mixin.create({


		TYPE_ACK: 'ack',
		TYPE_CANCEL: 'cancel',
		TYPE_UNCANCEL: 'uncancel',

		getDataFromRecord: function (event_type, crecord) {
			//gets the controller instance for login to access some of it s values
			var login = this.get('controllers.login');

			//record instanciation depending on crecord type
			var record = {
				authkey : login.get('authkey'),
				author : login.get('username'),
				id : crecord.get('id'),
				connector : crecord.get('connector'),
				connector_name : crecord.get('connector_name'),
				event_type : event_type,
				source_type : crecord.get('source_type'),
				component : crecord.get('component'),
				resource : crecord.get('resource'),
				state : 0,
				state_type : crecord.get('state_type'),
				crecord_type: event_type,
			};

			//business code taking care of different event types to send information
			if (event_type === this.TYPE_CANCEL) {
				//event cancellation
				record.cancel = true;
				record.event_type = 'check';
			}

			if (event_type === this.TYPE_UNCANCEL) {
				//event cancel cancellation
				record.cancel = false;
				record.event_type = 'check';
			}

			if (event_type === this.TYPE_ACK) {
				//ref rk is required by ack engine
				record.ref_rk = crecord.get('id');
				//recomputing id with ack event type
				record.id = [
					record.connector,
					record.connector_name,
					record.event_type,
					record.source_type,
					record.component
				].join('.');
			}
			return record;
		},


		submitEvents: function (crecords, record, event_type) {
			var controller = this;
			//ajax logic, send single or multiple events
			var post_events = [];
			for(var i=0; i<crecords.length; i++) {
				console.log('Event author', record.get('author'),'comment', record.get('output'));

				var post_event = this.getDataFromRecord(event_type, crecords[i]);
				post_event.author = record.get('author');
				post_event.output = record.get('output');

				post_events.push(post_event);
			}
			var listController = this;
			$.ajax({
				url: '/event',
				type: 'POST',
				data: {'event': JSON.stringify(post_events)},
				success: function(data) {
					if (data.success) {
						console.log('will refresh list content');
						record.rollback();
						record.unloadRecord();
						setTimeout(function() {
							console.log('refreshing list content')
							listController.refreshContent();
						},500);
					}
				},
			});
		},

		filterUsableCrecords: function (event_type, crecords) {

			//from selected crecords, filters crecords that can be processed for current event type

			var selectedRecords = [];
			//businbess rules describing how events are filtered depending on their types.
			//rules are the same as the ack template ones.
			if (event_type === this.TYPE_ACK) {
				for(var i=0; i<crecords.length; i++) {
					if (crecords[i].get('state') && !crecords[i].get('ack.pending')) {
						selectedRecords.push(crecords[i]);
					}
				}
			}

			if (event_type === this.TYPE_CANCEL) {
				for(var i=0; i<crecords.length; i++) {
					if (crecords[i].get('state') && !crecords[i].get('cancel.cancel')) {
						selectedRecords.push(crecords[i]);
					}
				}
			}

			if (event_type === this.TYPE_UNCANCEL) {
				for(var i=0; i<crecords.length; i++) {
					if (crecords[i].get('cancel.cancel')) {
						selectedRecords.push(crecords[i]);
					}
				}
			}

			return selectedRecords;
		},

		actions: {

			sendEvent: function(event_type, crecord) {
				//Gets information from record and then send event accordingly depending on event type
				this.stopRefresh();

				var controller = this;

				var crecords = [];
				var display_crecord = crecord;

				if (!Ember.isNone(crecord)) {
					crecords.push(crecord);
				} else {
					crecords = this.get('widgetData.content').filterBy('isSelected', true);
					crecords = this.filterUsableCrecords(event_type, crecords);
					console.log('Filtered crecord list', crecords);
					if (!crecords.length) {
						utils.notification.info(_('No event matches for operation on ') + event_type);
						return;
					} else {
						crecord = crecords[0];
					}
				}

				display_crecord = this.getDataFromRecord(event_type, crecord);

				var record = this.get("widgetDataStore").createRecord(event_type, display_crecord);

				//generating form from record model
				var recordWizard = utils.forms.showNew('modelform', record, {
					title: 'Add event type : ' + event_type,
					override_labels: {output: 'comment'}
				});

				//submit form and it s callback
				recordWizard.submit.then(function(form) {
					console.log('record going to be saved', record, form);

					//generated data by user form fill
					record = form.get('formContext');

					utils.notification.info(event_type + ' ' +_('event sent'));
					//UI repaint taking care of new sent values
					controller.submitEvents(crecords, record, event_type);

				}).fail(function () {
					utils.notification.warning(_('Unable to send event'));
					record.rollback();
					record.unloadRecord();
				}).then(function () {
					controller.startRefresh();
					record.rollback();
					record.unloadRecord();
				});

			},

		}
	});

	return Application.sendEventMixin;
});
