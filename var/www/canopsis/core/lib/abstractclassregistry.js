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
    'app/lib/registries'
], function(Ember, registries) {

    var get = Ember.get,
        isNone = Ember.isNone;
        isArray = Ember.isArray;

    //TODO manage element with add and remove methods

    var manager = Ember.Object.extend({
        init: function() {
            this._super.apply(this, arguments);

            //put the initialized registry into the registry list
            var name = get(this, 'name');
            registries[name] = this;
        },

        /**
         * The name of the registry
         * @type {string}
         */
        name: 'unnamed registry',

        all: [],
        byClass: {},

        /**
         * Aims to provide a way to inspect and display items
         * Strictly typed object, at term, will not need this anymore
         */
        tableColumns: [{title: 'name', name: 'name'}],

        /**
         * Appends the item into the "all" array, and into the corresponding class arrays in the "byClass" dict
         */
        push: function(item, name, classes) {
            if(isNone(name)) {
                name = get(item, 'name');
            }

            if(isNone(classes)) {
                classes = get(item, 'classes');
            }

            console.log('registering item', get(item, 'name'), 'into registry', name, 'with classes', classes);
            this.all.pushObject(item);

            if(isArray(classes)) {
                for (var i = 0, l = classes.length; i < l; i++) {
                    if(isNone(this.byClass[classes[i]])) {
                        this.byClass[classes[i]] = Ember.A();
                    }

                    this.byClass[classes[i]].pushObject(item);
                }
            }
        },

        /**
         * Get an item by its name. Implemented because all must be migrated from an array to a dict
         *
         * @param {name} the name of the item to get
         */
        getByName: function(name) {
            for (var i = 0, l = this.all.length; i < l; i++) {
                if(get(this.all[i], 'name') === name) {
                    return this.all[i];
                }
            }
        },

        /**
         * Get a list of item that are registered in the specified class
         *
         * @param {name} the name of the class
         */
        getByClassName: function(name) {
            return get(this.byClass, name);
        }
    });

    return manager;
});
