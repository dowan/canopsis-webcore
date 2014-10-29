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
    'jquery',
    'ember',
    'app/application',
    'app/lib/utils/notification',
    'app/lib/factories/mixin'
], function($, Ember, Application, notificationUtils, Mixin) {

    var get = Ember.get,
        set = Ember.set;


    /**
     * Provides an "attributes" property, dependant on content, to iterate on model's attributes, with the value and schema's properties
     *
     * Warning :the parent controller MUST have attributesKeys property!
     * @mixin
     */

    var mixin = Mixin('inspectableItem', {

        /**
            @required
        */
        inspectedDataItem: function() {
            console.error("This must be defined on the base class. Assuming inspected data is content");

            return "content";
        }.property(),

        /**
            @required
        */
        inspectedItemType: function() {
            console.error("This must be defined on the base class. Assuming inspected data is content.xtype");

            return "content.xtype";
        }.property(),

        /**
            @required
        */
        inspectedItemInstance: function() {
            console.error("Not mandatory, but attr.value field will not be set");

            return "content";
        }.property(),

        //getting attributes (keys and values as seen on the form)
        categorized_attributes: function() {
            var inspectedDataItem = get(this, 'inspectedDataItem');
            console.log("recompute categorized_attributes", inspectedDataItem );
            if (inspectedDataItem !== undefined) {

                console.log("inspectedDataItem attributes", get(inspectedDataItem, 'attributes'));
                var me = this;

                if (get(this, 'inspectedItemType') !== undefined) {
                    var itemType;

                    if (get(this, 'inspectedItemType') === "view") {
                        itemType = "userview";
                    } else {
                        itemType = get(this, 'inspectedItemType');
                    }

                    console.log("inspected itemType", itemType.capitalize());
                    var referenceModel = Application[itemType.capitalize()];

                    if (referenceModel === undefined || referenceModel.proto() === undefined) {
                        notificationUtils.error("There does not seems to be a registered schema for", itemType.capitalize());
                    }
                    if (referenceModel.proto().categories === undefined) {
                        notificationUtils.error("No categories in the schema of" + itemType);
                    }

                    var options = get(this, 'options');
                    var filters = [];

                    //Allows showing only some fields in the form.
                    if (options && options.filters) {
                        filters = options.filters;
                    }
                    console.log(' + filters ', filters);

                    //Enables field label override in form from options.
                    var override_labels = {};
                    if (options && options.override_labels) {
                        override_labels = options.override_labels;
                    }

                    this.categories = [];

                    var modelAttributes = get(referenceModel, 'attributes');

                    for (var i = 0; referenceModel.proto().categories &&
                         i < referenceModel.proto().categories.length; i++) {
                        var category = referenceModel.proto().categories[i];
                        var createdCategory = {};
                        createdCategory.title = category.title;
                        createdCategory.keys = [];

                        for (var j = 0, lj = category.keys.length; j < lj; j++) {
                            var key = category.keys[j];

                            if(key === "separator") {
                                createdCategory.keys[j] = Ember.Object.create({
                                    type:'string',
                                    model: Ember.Object.create({
                                        options: Ember.Object.create({
                                            role:"separator"
                                        })
                                    }),
                                    options: Ember.Object.create()
                                });
                            } else {
                                if (typeof key === "object") {
                                    key = key.field;
                                }

                                if (key !== undefined && modelAttributes.get(key) === undefined) {
                                    notificationUtils.error("An attribute that does not exists seems to be referenced in schema categories" + key, referenceModel);

                                    //break the iteration
                                    createdCategory.keys[j] = Ember.Object.create({
                                        type:'string',
                                        model: Ember.Object.create({
                                            options: Ember.Object.create({
                                                role:"separator"
                                            })
                                        }),
                                        options: Ember.Object.create()
                                    });

                                    //break the iteration, insertinng a separator instead of a regular editor
                                    //TODO custom error readonly editor
                                    continue;
                                } else {
                                    //TODO refactor the 20 lines below in an utility function "getEditorForAttr"
                                    //find appropriate editor for the model property
                                    var editorName;
                                    var attr = modelAttributes.get(key);

                                    //defines an option object explicitely here for next instruction
                                    if (attr.options === undefined) {
                                        attr.options = {};
                                    }

                                    //hide field if not filter specified or if key match one filter element.
                                    if (filters.length === 0 || $.inArray(key, filters) !== -1) {
                                        set(attr, 'options.hiddenInForm', false);
                                    } else {
                                        set(attr, 'options.hiddenInForm', true);
                                    }

                                    if (attr.options !== undefined && attr.options.role !== undefined) {
                                        editorName = "editor-" + attr.options.role;
                                    } else {
                                        editorName = "editor-" + attr.type;
                                    }

                                    if (Ember.TEMPLATES[editorName] === undefined) {
                                        editorName = "editor-defaultpropertyeditor";
                                    }

                                    //enable field label override.
                                    var label = key;
                                    if (override_labels[key]) {
                                        label = override_labels[key];
                                    }

                                    createdCategory.keys[j] = {
                                        field: label,
                                        model: modelAttributes.get(key),
                                        editor: editorName
                                    };

                                    var value = (!this.isOnCreate)? get(inspectedDataItem, key) : attr.options["default"];

                                    if (attr.type === "array"){
                                        var value_temp = Ember.copy(value , true);
                                        value = value_temp;
                                    }
                                    createdCategory.keys[j].value = value;

                                    console.log("category key ", category.keys[j].value);
                                }
                            }
                        }

                        this.categories.push(createdCategory);
                    }

                    console.log("categories", this.categories);
                    return this.categories;
                }
                else {
                    return undefined;
                }
            }
        }.property("inspectedDataItem", "inspectedItemType")
    });


    loader.register('mixin:inspectable-item', mixin);

    return mixin;
});
