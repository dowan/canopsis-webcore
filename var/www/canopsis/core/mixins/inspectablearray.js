/**
 * Copyright (c) 2015 "Capensis" [http://www.capensis.com]
 *
 * This file is part of Canopsis.
 *
 * Canopsis is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Canopsis is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Canopsis. If not, see <http://www.gnu.org/licenses/>.
 */

Ember.Application.initializer({
    name:'InspectableArrayMixin',
    after: 'MixinFactory',
    initialize: function(container, application) {
        var Mixin = container.lookupFactory('factory:mixin');

        var mixin = Mixin('InspectableArray', {
            attributesKeys: function() {
                var attributes = [];

                var attributesDict = this.get('inspectedDataArray.type.attributes');

                if(!isNone(attributesDict)) {
                    attributesDict.forEach(function(attr) {
                        if (attr.options.hiddenInLists === false || attr.options.hiddenInLists === undefined) {
                            console.log("pushed attr", {
                                field: attr.name,
                                type: attr.type,
                                options: attr.options
                            });

                            attributes.pushObject({
                                field: attr.name,
                                type: attr.type,
                                options: attr.options
                            });
                        }
                    });
                }

                return attributes;
            }.property("inspectedProperty", "inspectedDataArray"),

            inspectedDataArray: function() { console.error("This must be defined on the base class"); }.property()
        });

        application.register('mixin:inspectable-array', mixin);
    }
});
