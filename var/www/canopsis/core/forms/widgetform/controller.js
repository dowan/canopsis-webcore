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
    'app/lib/widgetsmanager',
    'app/lib/loaders/schema-manager',
    'app/controller/journal'
], function(Ember, Application, FormFactory, utils, widgets) {

    FormFactory('widgetform', {
        needs: ['journal'],

        title: "Select a widget",

        widgets: widgets,

        availableWidgets: function() {
            console.log("availableWidgets");
            var widgets = [];

            for (var i = 0; i < Canopsis.widgets.all.length; i++) {
                var currentWidget = Canopsis.widgets.all[i];

                widgets.push(currentWidget);
            }

            return widgets;
        }.property('Canopsis.widgets.all', "title"),

        actions: {
            show: function() {
                var widgets = [];

                for (var i = 0; i < Canopsis.widgets.all.length; i++) {
                    var currentWidget = Canopsis.widgets.all[i];

                    widgets.push(currentWidget);
                }

                this.set('availableWidgets', widgets);
                this._super();
            },

            submit: function(newWidgets) {
                var newWidget = newWidgets[0];

                this.get('controllers.journal').send('publish', 'create', 'widget');

                console.log("onWidgetChooserSubmit", arguments);

                console.group("attach new widget to widgetwrapper");

                console.log("newWidget", newWidget);
                console.log("widgetwrapper", this.newWidgetWrapper);
                // Ember.set(this, 'newWidgetWrapper.widget', newWidget);

                console.groupEnd();


                this._super(this.newWidgetWrapper);
            },

            selectItem: function(widgetName) {
                console.log('selectItem', arguments);

                var containerwidget = this.get('formContext.containerwidget');
                console.group('selectWidget', this, containerwidget, widgetName);

                var store = this.get('formContext.containerwidget').store;
                console.log('store to use', this.get('formContext.containerwidget').store);
                var widgetId = utils.hash.generateId('widget_' + widgetName);

                //FIXME this works when "xtype" is "widget"
                var newWidget = store.createRecord(widgetName, {
                    'xtype': widgetName,
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
                    'widgetType': widgetName,
                    'meta': {
                        'embeddedRecord': true,
                        'parentType': containerwidget.get('xtype'),
                        'parentId': containerwidget.get('id')
                    }
                });

                console.log('newWidgetWrapper', this.newWidgetWrapper);

                console.log('newWidget', newWidget);
                console.log('formwrapper', this.get('formwrapper'));

                console.info('show embedded widget wizard');

                utils.forms.showNew('modelform', newWidget, {formParent: this, title: "Add new " + widgetName});
                console.groupEnd();
            }
        },

        partials: {
            buttons: []
        },

        parentContainerWidget: Ember.required(),
        parentUserview: Ember.required()
    });

    return Application.WidgetformController;
});
