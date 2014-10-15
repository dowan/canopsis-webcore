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
    'app/lib/utils/forms',
    'app/lib/utils/hash'
], function(Ember, Application, formsUtils, hashUtils) {

    var get = Ember.get,
        set = Ember.set;

    var mixin = Ember.Mixin.create({
        partials: {
            selectionToolbarButtons: [
                'actionbutton-removeselection'
            ],
            actionToolbarButtons: [
                'actionbutton-create'
            ],
            itemactionbuttons: [
                'actionbutton-edit',
                'actionbutton-removeselection'
            ],
            header: [],
            subHeader: [],
            footer: []
        },

        userCanReadRecord: function() {
            if(get(this, 'user') === "root") {
                return true;
            }

            var crecord_type = get(this, 'listed_crecord_type');

            return get(this, 'rights.' + crecord_type + '_read.checksum');
        }.property('config.listed_crecord_type'),

        userCanCreateRecord: function() {
            if(get(this, 'user') === "root") {
                return true;
            }

            var crecord_type = get(this, 'listed_crecord_type');

            return get(this, 'rights.' + crecord_type + '_create.checksum');
        }.property('config.listed_crecord_type'),

        userCanUpdateRecord: function() {
            if(get(this, 'user') === "root") {
                return true;
            }

            var crecord_type = get(this, 'listed_crecord_type');

            return get(this, 'rights.' + crecord_type + '_update.checksum');
        }.property('config.listed_crecord_type'),

        userCanDeleteRecord: function() {
            if(get(this, 'user') === "root") {
                return true;
            }

            var crecord_type = get(this, 'listed_crecord_type');

            return get(this, 'rights.' + crecord_type + '_delete.checksum');
        }.property('config.listed_crecord_type'),

        actions: {
            add: function (recordType) {
                console.log("add", recordType);

                var record = get(this, "widgetDataStore").createRecord(recordType, {
                    crecord_type: recordType
                });

                console.log('temp record', record, formsUtils);

                var recordWizard = formsUtils.showNew('modelform', record, { title: "Add " + recordType });

                var listController = this;

                recordWizard.submit.then(function(form) {
                    console.log('record going to be saved', record, form);

                    //Dirty hack to make acl routes work
                    if(get(record, 'crecord_type') === 'group') {
                        set(record, 'id', hashUtils.generateId('group'));
                    }
                    if(get(record, 'crecord_type') === 'profile') {
                        console.error('set id for profile', record);
                        set(record, 'id', hashUtils.generateId('profile'));
                    }

                    record = get(form, 'formContext');

                    record.save();

                    //quite ugly callback
                    setTimeout(function () {
                        listController.refreshContent();
                        console.log('refresh after operation');
                    },500);

                    listController.startRefresh();
                });
            },

            edit: function (record) {
                console.log("edit", record);

                var listController = this;
                var recordWizard = formsUtils.showNew('modelform', record, { title: "Edit " + get(record, 'crecord_type') });

                recordWizard.submit.then(function(form) {
                    console.log('record going to be saved', record, form);

                    record = get(form, 'formContext');

                    record.save();

                    listController.trigger('refresh');
                });
            },

            remove: function(record) {
                console.info('removing record', record);
                record.deleteRecord();
                record.save();
            },

            removeSelection: function() {
                var selected = this.get("widgetData").filterBy('isSelected', true);
                console.log("remove action", selected);

                for (var i = 0, l = selected.length; i < l; i++) {
                    var currentSelectedRecord = selected[i];
                    this.send("remove", currentSelectedRecord);
                }
            }
        }
    });

    Application.CrudMixin = mixin;

    return mixin;
});
