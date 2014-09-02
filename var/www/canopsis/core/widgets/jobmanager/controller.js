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
    'app/lib/factories/widget',
    'app/widgets/list/controller',
    'utils'
], function(Ember, WidgetFactory, WidgetListController, cutils) {
    var widgetOptions = {
        subclass: WidgetListController
    };

    var widget = WidgetFactory('jobmanager', {
        listed_crecord_type: 'job',

        actions: {
            add: function(recordType) {
                console.log("add job");

                var record = this.get('widgetDataStore').createRecord(
                    recordType,
                    {
                        crecord_type: recordType
                    }
                );

                var recordWizard = cutils.forms.showNew('jobform', record);

                var me = this;

                recordWizard.submit.then(function(form) {
                    var record = form.get('formContext');
                    console.log('Saving Job:', record);
                    record.save();

                    me.trigger('refresh');
                    me.startRefresh();
                });
            },

            edit: function(record) {
                var recordWizard = cutils.forms.showNew('jobform', record);
                var me = this;

                recordWizard.submit.then(function(form) {
                    var record = form.get('formContext');
                    record.save();

                    me.trigger('refresh');
                })
            }
        }
    }, widgetOptions);

    return widget;
});