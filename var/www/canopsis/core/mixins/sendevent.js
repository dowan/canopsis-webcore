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
], function(Ember, Application, cutils) {

	var mixin = Ember.Mixin.create({
		getDataFromRecord: function(event_type, crecord, formRecord) {
			console.group('getDataFromRecord');
			console.log('event:', event_type, record);

			var login = this.get('controllers.login');

			var record = {
				authkey: login.get('authkey'),
				author: login.get('username'),
				id: crecord.get('id'),
				connector: crecord.get('connector'),
				connector_name: crecord.get('connector_name'),
				event_type: event_type,
				source_type: crecord.get('source_type'),
				component: crecord.get('component'),
				state: crecord.get('state'),
				state_type: crecord.get('state_type'),
				crecord_type: event_type
			};

			if(record.source_type === 'resource') {
				record.resource = crecord.get('resource')
			}

			this.processEvent(event_type, 'extract', [record, crecord, formRecord]);

			console.groupEnd();

			return record;
		},

		submitEvents: function(crecords, record, event_type) {
			var me = this;

			return new Ember.RSVP.Promise(function(resolve, reject) {
				var post_events = [];

				for(var i = 0; i < crecords.length; i++) {
					console.log('Event:', record.get('author'), record.get('output'));

					var post_event = me.getDataFromRecord(event_type, crecords[i], record);
					post_event.author = record.get('author');
					post_event.output = record.get('output');

					if(!!record.get('ticket')) {
						post_event.ticket = record.get('ticket');
					}

					post_events.push(post_event);
				}

				$.post('/event', {
					event: JSON.stringify(post_events)
				}).then(function(data) {
					record.rollback();
					record.unloadRecord();

					setTimeout(function() {
						me.refreshContent();
					}, 500);

					resolve(arguments);
				}, reject);
			});
		},

		getEventForm: function(event_type, record, crecords, formbuttons) {
			var wizard = cutils.form.showNew('modelform', record, {
				title: __('Add event type: ') + event_type,
				override_labels: {
					output: 'comment'
				},
				onePageDisplay: true,
				partials: {
					buttons: formbuttons
				}
			});

			var me = this;
			var rollback = function() {
				me.startRefresh();
				record.rollback();
				record.unloadRecord();
			};

			wizard.submit.then(function(form) {
				console.log('saveRecord:', record, form);

				record = form.get('formContext');
				cutils.notification.info(__('event sent: ') + event_type);
				me.submitEvents(crecords, record, event_type);

				rollback();
			}, rollback);
		},

		getRoutingKey: function(record) {
			var rk = [
				record.connector,
				record.connector_name,
				record.event_type,
				record.source_type,
				record.component
			].join('.');

			if (record.source_type === 'resource') {
				rk = [record.id, record.resource].join('.');
			}

			return rk;
		},

		getDisplayRecord: function(event_type, crecord) {
			var store = this.get('widgetDataStore');

			var recordData = this.getDataFromRecord(event_type, crecord);
			var record = store.createRecord(event_type, recordData);

			return record;
		},

		filterUsableCrecords: function(event_type, crecords) {
			var selected = [];

			var filter = this.event_filters[event_type];

			for(var i = 0; i < crecords.length; i++) {
				var record = crecords[i];

				var topush = this.processEvent(event_type, 'filter', [record]);

				if(topush) {
					selected.push(record);
				}
			}

			return selected;
		},

		event_processors: {
			ack: {
				extract: function(record, crecord, formRecord) {
					record.ref_rk = crecord.get('id');
					record.state = 0;
					record.id = this.getRoutingKey(record);
				},

				filter: function(record) {
					return (record.get('state') && !record.get('ack.isAck') && !record.get('ack.isCancel'));
				},

				handle: function(crecords) {
					var record = this.getDisplayRecord(crecords[0]);

					var formbuttons = [
						'formbutton-cancel',
						'formbutton-ack',
						'formbutton-ackandproblem'
					];

					this.getEventForm('ack', record, crecords, formbuttons);
				}
			},

			ackremove: {
				extract: function(record, crecord, formRecord) {
					record.output = __('Removed ack for event:');
					record.output += ' ' + record.component;

					if(record.source_type === 'resource') {
						record.output += ' ' + record.resource;
					}

					record.ref_rk = crecord.get('id');
					record.state = 0;
					record.id = this.getRoutingKey(record);
				},

				filter: function(record) {
					return (record.get('ack.author') && record.get('ack.isAck'));
				},

				handle: function(crecords) {
					var record = this.getDisplayRecord(crecords[0]);

					cutils.notification.info(__('event "ackremove" sent'));
					this.submitEvents(crecords, record, 'ackremove');
				}
			},

			declareticket: {
				extract: function(record, crecord, formRecord) {
					record.ref_rk = crecord.get('id');
					record.state = 0;
					record.id = this.getRoutingKey(record);
				},

				filter: function(record) {
					return (record.get('ack.isAck'));
				},

				handle: function(crecords) {
					var record = this.getDisplayRecord(crecords[0]);

					var formbuttons = [
						'formbutton-cancel',
						'formbutton-incident'
					];

					this.getEventForm('declareticket', record, crecords, formbuttons);
				}
			},

			assocticket: {
				extract: function(record, crecord, formRecord) {
					record.ref_rk = crecord.get('id');
					record.state = 0;
					record.id = this.getRoutingKey(record);
				},

				filter: function(record) {
					return (record.get('ack.isAck'));
				},

				handle: function(crecords) {
					console.log('Not implemented: assocticket');
				}
			},

			cancel: {
				extract: function(record, crecord, formRecord) {
					record.ref_rk = crecord.get('id');
				},

				filter: function(record) {
					return (record.get('ack.isAck'));
				},

				handle: function(crecords) {
					var record = this.getDisplayRecord(crecords[0]);

					var formbuttons = [
						'formbutton-cancel',
						'formbutton-submit'
					];

					this.getEventForm('cancel', record, crecords, formbuttons);
				}
			},

			recovery: {
				extract: function(record, crecord, formRecord) {
					crecord.set('state', 0);
				},

				filter: function(record) {
					return false;
				},

				handle: function(crecords) {
					var record = crecords[0];
					this.submitEvents([record], record, 'recovery');
				}
			},

			uncancel: {
				extract: function(record, crecord, formRecord) {
					record.ref_rk = crecord.get('id');
				},

				filter: function(record) {
					return (record.get('ack.isCancel'));
				},

				handle: function(crecords) {
					var record = this.getDisplayRecord(crecords[0]);

					cutils.notification.info(__('event "uncancel" sent'));
					this.submitEvents(crecords, record, 'uncancel');
				}
			},

			changestate: {
				extract: function(record, crecord, formRecord) {
					if(!Ember.isNone(formRecord)) {
						record.state = formRecord.get('state');
					}

					record.event_type = 'check';
					record.keep_state = true;
				},

				filter: function(record) {
					return (record.get('state'));
				},

				handle: function(crecords) {
					var record = this.getDisplayRecord(crecords[0]);

					var formbuttons = [
						'formbutton-cancel',
						'formbutton-submit'
					];

					this.getEventForm('changestate', record, crecords, formbuttons);
				}
			}
		},

		hasEventProcessorForType: function(event_type) {
			return (this.event_processors[event_type] !== undefined);
		},

		processEvent: function(event_type, fname, args) {
			if(this.hasEventProcessorForType(event_type)) {
				var callback = this.event_processors[event_type][fname];

				return callback.apply(this, args);
			}
		},

		actions: {
			sendEvent: function(event_type, crecord) {
				console.group('sendEvent:');

				this.stopRefresh();

				var crecords = [];

				if (!Ember.isNone(crecord)) {
					console.log('event:', event_type, crecord);
					crecords.push(crecord);
				}
				else {
					var content = this.get('widgetData.content');
					var selected = content.filterBy('isSelected', true);

					crecords = this.filterUsableCrecords(event_type, selected);

					console.log('events:', event_type, crecords);

					if(!crecords.length) {
						cutils.notification.warning(
							'No matching event found for event:',
							event_type
						);
						return;
					}
				}

				this.processEvent(event_type, 'handle', [crecords]);

				console.groupEnd();
			}
		}
	});

	Application.sendEventMixin = mixin;

	return mixin;
});