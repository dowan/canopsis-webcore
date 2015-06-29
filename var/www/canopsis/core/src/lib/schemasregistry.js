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
 *
 * @module canopsis-frontend-core
 */

Ember.Application.initializer({
    name:"SchemasRegistry",
    after: 'AbstractClassRegistry',
    initialize: function(container, application) {
        var Abstractclassregistry = container.lookupFactory('registry:abstractclass');

        /**
         * Schemas Registry
         *
         * @class SchemasRegistry
         * @extends Abstractclassregistry
         * @static
         */
        var registry = Abstractclassregistry.create({
            name: 'schemas',

            all: {},

            /**
             * Appends the item into the "all" array, and into the corresponding class arrays in the "byClass" dict
             */
            add: function(item, name) {
                this.all[name] = item;
            },

            /**
             * Get an item by its name. Implemented because all must be migrated from an array to a dict
             */
            getByName: function(name) {
                return this.all[name];
            },

            /**
             * Aims to provide a way to inspect and display items
             * Strictly typed object, at term, will not need this anymore
             */
            tableColumns: [{title: 'icon', name: 'icon'}, {title: 'name', name: 'name'}]
        });

        application.register('registry:schemas', registry);
    }
});
