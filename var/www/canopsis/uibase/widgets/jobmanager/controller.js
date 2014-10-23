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
    'canopsis/uibase/widgets/list/controller',
    'app/lib/utils/forms',
    'app/lib/utils/hash',
    'app/serializers/job'
], function(Ember, WidgetFactory, WidgetListController, formsUtils, hashUtils) {

    var get = Ember.get,
        set = Ember.set;


    var widgetOptions = {
        subclass: WidgetListController
    };


    //TODO refactor jobform to be able to nuke this widget, or eventually use a mixin to override action
    var widget = WidgetFactory('jobmanager', {
        listed_crecord_type: 'job',

        actions: {
            add: function(recordType) {
                console.log("add job");

                var record = get(this, 'widgetDataStore').push(
                    recordType,
                    {
                        id: hashUtils.generateId(recordType),
                        crecord_type: recordType
                    }
                );

                var recordWizard = formsUtils.showNew('jobform', record);

                var me = this;

                recordWizard.submit.then(function(form) {
                    console.group('submitJob');

                    var record = get(form, 'formContext');

                    console.log('record:', record);

                    record.save();

                    console.groupEnd();

                    me.trigger('refresh');
                    me.startRefresh();
                }, function() {
                    record.rollback();
                });
            },

            edit: function(record) {
                console.log('editting record:', record);

                var recordWizard = formsUtils.showNew('jobform', record);
                var me = this;

                recordWizard.submit.then(function(form) {
                    var record = get(form, 'formContext');
                    record.save();

                    me.trigger('refresh');
                    me.startRefresh();
                }, function() {
                    record.rollback();
                });
            }
        }
    }, widgetOptions);

    return widget;
});
