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
     *
     * @class CrudMixin
     * @static
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
                get(this,'partials.selectionToolbarButtons').pushObject('actionbutton-removeselection');
                get(this,'partials.itemactionbuttons').pushObject('actionbutton-duplicate');
                get(this,'partials.itemactionbuttons').pushObject('actionbutton-remove');
            }
            if (!get(this, 'mixinOptions.crud.hideEdit')) {
                get(this,'partials.itemactionbuttons').pushObject('actionbutton-edit');
            }
            if (!get(this, 'mixinOptions.crud.hideCreate')) {
                get(this,'partials.actionToolbarButtons').pushObject('actionbutton-create');
            }

            set(this, 'itemsPerPagePropositionSelected', get(this, 'itemsPerPage'));
        },

        /**
         * @property userCanReadRecord
         * @type Boolean
         * @description Whether the user can read the records handled by the mixin
         */
        userCanReadRecord: true,

        /**
         * @property userCanCreateRecord
         * @type Boolean
         * @description Whether the user can read the records handled by the mixin
         */
        userCanCreateRecord: true,

        /**
         * @property userCanUpdateRecord
         * @type Boolean
         * @description Whether the user can update the records handled by the mixin
         */
        userCanUpdateRecord: true,

        /**
         * @property userCanDeleteRecord
         * @type Boolean
         * @description Whether the user can delete the records handled by the mixin
         */
        userCanDeleteRecord: true,

        onRecordReady: function(record) {
            this._super.apply(this, arguments);
        },

        /**
         * @method showEditFormAndSaveRecord
         * @param {DS.Model} record the record to edit
         *
         * Display an edition form for the record passed as first parameter, and make the changes persistant when the user saves the form.
         */
        showEditFormAndSaveRecord: function(record) {
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
                record.save().then(function() {
                    ctrl.refreshContent();
                });
            });
        },

        actions: {
            /**
             * @event add
             * @param {string} recordType
             */
            add: function (recordType) {
                this._super.apply(this, arguments);

                console.log("add", recordType);

                var record = get(this, "widgetDataStore").createRecord(recordType, {
                    crecord_type: recordType
                });

                this.showEditFormAndSaveRecord(record);
            },

            /**
             * @event duplicate
             * @param {DS.Model} record
             */
            duplicate: function (record) {
                console.error('copyWidget', arguments);
                var recordJson = cleanRecordJSON(record.toJSON());
                recordType = recordJson.xtype || recordJson.crecord_type;

                this._super.apply(this, arguments);

                console.log("add", recordType);

                var record = get(this, "widgetDataStore").createRecord(recordType, recordJson);

                this.showEditFormAndSaveRecord(record);
            },


            /**
             * @event edit
             * @param {DS.Model} record
             * @param {boolean} noconfirm
             */
            edit: function (record) {
                console.log("edit", record);

                var extraoptions = get(this, 'mixinOptions.crud.formoptions'),
                    formclass = get(this, 'mixinOptions.crud.form');
                var formoptions = {
                    title: 'Edit ' + get(record, 'crecord_type'),
                    inspectedItemType: get(this, 'listed_crecord_type')
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

            /**
             * @event remove
             * @param {DS.Model} record
             * @param {boolean} noconfirm
             */
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

            /**
             * @event removeSelection
             */
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

    /**
     * @function showEditFormAndSaveRecord
     * @param {object} recordJSON
     * @private
     *
     * remove keys that should not be present on a record exported to JSON, and generates new ids
     */
    function cleanRecordJSON(recordJSON) {
        for (var key in recordJSON) {
            var item = recordJSON[key];
            //see if the key need to be cleaned
            if(key === 'widgetId' || key === 'preference_id') {
                delete recordJSON[key];
            }

            if(key === 'id') {
                recordJSON['id'] = recordJSON['_id'] || hashUtils.generateId(recordJSON.xtype || recordJSON.crecord_type || 'item');
            }

            if(key === '_id') {
                recordJSON['_id'] = recordJSON['id'] || hashUtils.generateId(recordJSON.xtype || recordJSON.crecord_type || 'item');
            }

            //if this item is an object, then recurse into it
            //to remove empty arrays in it too
            if (typeof item === 'object') {
                cleanRecordJSON(item);
            }
        }

        return recordJSON;
    }

    return mixin;
});
