/*
# Copyright (c) 2015 "Capensis" [http://www.capensis.com]
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
    'jquery',
    'ember',
    'app/lib/utils/forms',
    'app/lib/utils/hash',
    'app/lib/factories/mixin'
], function($, Ember, formsUtils, hashUtils, Mixin) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    /**
     * Implement CRUD handling for widgets that manages collections
     *
     * Useful in lists for example, where it adds buttons to CRUD list elements
     */
    var mixin = Mixin('crud', {
        partials: {
            selectionToolbarButtons: [],
            actionToolbarButtons: [],
            itemactionbuttons: [],
            header: [],
            subHeader: [],
            footer: []
        },

        mixinsOptionsReady: function () {
            this._super();

            if (!get(this, 'mixinOptions.crud.hideRemove')) {
                get(this,'partials.selectionToolbarButtons').push('actionbutton-removeselection');
                get(this,'partials.itemactionbuttons').push('actionbutton-remove');
            }
            if (!get(this, 'mixinOptions.crud.hideEdit')) {
                get(this,'partials.itemactionbuttons').push('actionbutton-edit');
            }
            if (!get(this, 'mixinOptions.crud.hideCreate')) {
                get(this,'partials.actionToolbarButtons').push('actionbutton-create');
            }

            set(this, 'itemsPerPagePropositionSelected', get(this, 'itemsPerPage'));
        },

        userCanReadRecord: true,
        userCanCreateRecord: true,
        userCanUpdateRecord: true,
        userCanDeleteRecord: true,

        onRecordReady: function(record) {
            this._super.apply(this, arguments);
        },

        actions: {
            add: function (recordType) {
                this._super.apply(this, arguments);

                console.log("add", recordType);

                var record = get(this, "widgetDataStore").createRecord(recordType, {
                    crecord_type: recordType
                });

                this.onRecordReady(record);

                console.log('temp record', record, formsUtils);

                var extraoptions = get(this, 'mixinOptions.crud.formoptions'),
                    formclass = get(this, 'mixinOptions.crud.form');
                var formoptions = {
                    title: 'Add ' + recordType
                };

                if(!isNone(extraoptions)) {
                    $.extend(formoptions, extraoptions);
                }

                if(isNone(formclass)) {
                    formclass = 'modelform';
                }

                console.log('open form:', formclass, formoptions);

                var recordWizard = formsUtils.showNew(formclass, record, formoptions);

                var ctrl = this;

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

                    /* wait 1s to let the previous request travel to the webserver */
                    setTimeout(function() {
                        ctrl.trigger('refresh');
                    }, 1000);
                });
            },

            edit: function (record) {
                console.log("edit", record);

                var extraoptions = get(this, 'mixinOptions.crud.formoptions'),
                    formclass = get(this, 'mixinOptions.crud.form');
                var formoptions = {
                    title: 'Edit ' + get(record, 'crecord_type')
                };

                if(!isNone(extraoptions)) {
                    $.extend(formoptions, extraoptions);
                }

                if(isNone(formclass)) {
                    formclass = 'modelform';
                }

                console.log('open form:', formclass, formoptions);

                var ctrl = this;
                var recordWizard = formsUtils.showNew(formclass, record, formoptions);

                recordWizard.submit.then(function(form) {
                    console.log('record going to be saved', record, form);

                    record = get(form, 'formContext');

                    record.save();

                    ctrl.trigger('refresh');
                });
            },

            remove: function(record, noconfirm) {
                console.info('removing record', record);

                if (noconfirm) {
                    record.deleteRecord();
                    record.save();
                } else {
                    var confirmform = formsUtils.showNew('confirmform', {}, {
                        title: __('Delete this record ?')
                    });
                    var crudController = this;
                    confirmform.submit.then(function(form) {
                        record.deleteRecord();
                        record.save();
                    });
                }
            },

            removeSelection: function() {
                var confirmform = formsUtils.showNew('confirmform', {}, {
                    title: __('Delete these records ?')
                });
                var crudController = this;
                confirmform.submit.then(function(form) {
                    var selected = crudController.get("widgetData").filterBy('isSelected', true);
                    console.log("remove action", selected);

                    for (var i = 0, l = selected.length; i < l; i++) {
                        var currentSelectedRecord = selected[i];
                        crudController.send("remove", currentSelectedRecord, true);
                    }
                });

            }
        }
    });

    return mixin;
});
