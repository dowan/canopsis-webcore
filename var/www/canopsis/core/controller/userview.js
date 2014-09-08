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
	'app/controller/crecord',
	'utils',
	'app/lib/widgetsmanager',
	'app/routes/userview',
	'app/view/userview',
	'app/serializers/userview'
], function(Ember, Application, CrecordController, utils, widgets) {

	Application.UserviewController = CrecordController.extend(Ember.Evented, {
		needs: ['application'],

		actions: {
			insertWidget: function(containerController) {
				console.log("insertWidget", containerController);
				var widgetChooserForm = Canopsis.utils.forms.showNew('enumchooserform', this, {
					title: __('Select a widget'),

					baseItemLabel: 'widget',

					classifiedItemList : widgets,

					onSelectItem: function(elementName) {
						console.log('selectItem', arguments);

						var containerwidget = this.get('formContext.containerwidget');
						console.group('selectWidget', this, containerwidget, elementName);

						var store = this.get('formContext.containerwidget').store;
						console.log('store to use', this.get('formContext.containerwidget').store);
						var widgetId = utils.hash.generateId('widget_' + elementName);

						var newWidget = store.createRecord(elementName, {
							'xtype': elementName,
							'listed_crecord_type': 'account',
							'meta': {
								'embeddedRecord': true,
								'parentType': 'widgetwrapper'
							},
							'id': widgetId
						});

						this.newWidgetWrapper = store.push('widgetwrapper', {
							'id': utils.hash.generateId('widgetwrapper'),
							'xtype': 'widgetwrapper',
							'title': 'wrapper',
							'widget': widgetId,
							'widgetType': elementName,
							'meta': {
								'embeddedRecord': true,
								'parentType': containerwidget.get('xtype'),
								'parentId': containerwidget.get('widgetId')
							}
						});

						console.log('newWidgetWrapper', this.newWidgetWrapper);

						console.log('newWidget', newWidget);
						console.log('formwrapper', this.get('formwrapper'));

						console.info('show embedded widget wizard');

						utils.forms.showNew('modelform', newWidget, {formParent: this, title: "Add new " + elementName});
						console.groupEnd();
					}
				});

				var userviewController = this;

				widgetChooserForm.submit.done(function(form) {
					var newWidgetWrapper = form.newWidgetWrapper;

					console.log('onsubmit, adding widgetwrapper to containerwidget', newWidgetWrapper, containerController);
					console.log('containerwidget items', containerController.get('content.items.content'));
					//FIXME wrapper does not seems to have a widget
					containerController.get('content.items.content').pushObject(newWidgetWrapper);

					console.log("saving view");
					userviewController.get('content').save();
				});

				widgetChooserForm.submit.fail(function() {
					console.info('Widget insertion canceled');
				});
			}
		}
	});

	return Application.UserviewController;
});