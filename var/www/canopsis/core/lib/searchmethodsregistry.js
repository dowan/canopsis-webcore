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
    'ember',
    'app/lib/abstractclassregistry'
], function(Ember, Abstractclassregistry) {

    var searchMethods = [
        {
            name: 'simple',
            filter: function(array, options) {
                var propertyToCheck = options.propertyToCheck;
                var searchCriterion = options.searchCriterion;

                var res = array.filter(function(loopItem, index, enumerable){
                    void(index);
                    void(enumerable);

                    var doesItStartsWithSearchFilter = loopItem.name.slice(0, searchCriterion.length) == searchCriterion;
                    return doesItStartsWithSearchFilter;
                });

                console.log("##" ,res);
                return res;
            }
        }
    ];

    /**
     * Singleton to register and manage search algorithms and their options
     *
     * @class SearchMethodsRegistry
     * @extends Abstractclassregistry
     * @static
     */
    var searchMethodsRegistry = Abstractclassregistry.create({
        name: 'searchMethods',

        all: [],
        byClass: {},
        tableColumns: [{title: 'name', name: 'name'}]
    });

    for (var i = 0, l = searchMethods.length; i < l; i++) {
        searchMethodsRegistry.all.pushObject(searchMethods[i]);
    }

    return searchMethodsRegistry;
});
