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
     * @mixin InspectableItemMixin
     */

    var mixin = Mixin('inspectableItem', {

        /**
         * @property attributesKey
         * The key to get to retreive the list of attributes to edit
         */
        attributesKey: 'attributes',

        /**
            @property inspectedDataItem
            @required
        */
        inspectedDataItem: function() {
            console.error("This must be defined on the base class. Assuming inspected data is content");

            return "content";
        }.property(),

        /**
            @property inspectedItemType
            @required
        */
        inspectedItemType: function() {
            console.error("This must be defined on the base class. Assuming inspected data is content.xtype");

            return "content.xtype";
        }.property(),

        /**
            @property inspectedItemInstance
            @required
        */
        inspectedItemInstance: function() {
            console.error("Not mandatory, but attr.value field will not be set");

            return "content";
        }.property(),

        /**
         * @method getInspectedItemType
         */
        getInspectedItemType: function() {
            var itemType = get(this, 'inspectedItemType');

            if (itemType === "view") {
                itemType = "userview";
            }

            return itemType;
        },

        /**
         * @method insertValueIntoAttribute
         */
        insertValueIntoAttribute: function(createdCategory, inspectedDataItem, key, attr, count) {
            var value = (!this.isOnCreate)? get(inspectedDataItem, key) : attr.options["defaultValue"];

            if (attr.type === "array"){
                var value_temp = Ember.copy(value , true);
                value = value_temp;
            }
            createdCategory.keys[count].value = value;

            return createdCategory;
        },

        /**
         * @method generateEditorNameForAttribute
         */
        generateEditorNameForAttribute: function(attr) {
            var editorName;

            if (attr.options !== undefined && attr.options.role !== undefined) {
                editorName = "editor-" + attr.options.role;
            } else {
                editorName = "editor-" + attr.type;
            }

            if (Ember.TEMPLATES[editorName] === undefined) {
                editorName = "editor-defaultpropertyeditor";
            }

            return editorName;
        },

        /**
         * @method generateRoleAttribute
         */
        generateRoleAttribute: function(attr_role) {
            return {
                type:'string',
                model: {
                    options: {
                        role: attr_role
                    }
                },
                options: {}
            };
        },

        /**
         * @method getAttributes
         */
        getAttributes: function() {
            var itemType = this.getInspectedItemType();
            var referenceModel = Application[itemType.capitalize()];

            if (referenceModel === undefined || referenceModel.proto() === undefined) {
                notificationUtils.error("There does not seems to be a registered schema for", itemType.capitalize());
            }
            if (referenceModel.proto().categories === undefined) {
                notificationUtils.error("No categories in the schema of " + itemType);
            }

            return get(referenceModel, get(this, 'attributesKey'));
        },

        //getting attributes (keys and values as seen on the form)
        /**
         * @property categorized_attributes
         */
        categorized_attributes: function() {
            var inspectedDataItem = get(this, 'inspectedDataItem');
            console.log("recompute categorized_attributes", inspectedDataItem );
            if (inspectedDataItem !== undefined) {

                console.log("inspectedDataItem attributes", this.getAttributes());
                var itemType = this.getInspectedItemType();
                var referenceModel = Application[itemType.capitalize()];

                if (itemType !== undefined) {

                    var options = get(this, 'options'),
                        filters = [];

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

                    set(this, 'categories', []);

                    var modelAttributes = this.getAttributes();

                    var refModelCategories = referenceModel.proto().categories;
                    for (var i = 0, li = refModelCategories.length; refModelCategories && i < li; i++) {

                        var category = refModelCategories[i],
                        createdCategory = {
                            'title': category.title,
                            'keys': []
                        };

                        for (var j = 0, lj = category.keys.length; j < lj; j++) {
                            var key = category.keys[j];
                            var attr = modelAttributes.get(key);

                            if(key === "separator") {
                                createdCategory.keys[j] = this.generateRoleAttribute('separator');
                            } else {
                                if (key !== undefined && attr === undefined) {
                                    notificationUtils.error("An attribute that does not exists seems to be referenced in schema categories" + key);
                                    console.error(referenceModel, attr, modelAttributes);

                                    createdCategory.keys[j] = this.generateRoleAttribute('error');
                                    createdCategory.keys[j].field = key;
                                    createdCategory.keys[j].error = 'Attribute referenced in schema categories not found';

                                    continue;
                                } else {
                                    //TODO refactor the 20 lines below in an utility function "getEditorForAttr"
                                    //find appropriate editor for the model property
                                    var editorName;

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

                                    //enable field label override.
                                    var label = key;
                                    if (override_labels[key]) {
                                        label = override_labels[key];
                                    }

                                    createdCategory.keys[j] = {
                                        field: label,
                                        model: attr,
                                        editor: this.generateEditorNameForAttribute(attr)
                                    };

                                    createdCategory = this.insertValueIntoAttribute(createdCategory, inspectedDataItem, key, attr, j);
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


    return mixin;
});
