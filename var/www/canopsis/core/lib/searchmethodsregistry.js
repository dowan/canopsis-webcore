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
    'app/lib/abstractclassregistry',
    'app/application'
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
        },{
            name: 'metric',
            help: {
                title: __('Syntax'),
                content: ['<ul>',
                    '<li><code>co:regex</code> : ', __('look for a component'), '</li>',
                    '<li><code>re:regex</code> : ', __('look for a resource'), '</li>' ,
                    '<li><code>me:regex</code> : ' , __('look for a metric') , '(<code>me:</code>' , __(' isn\'t needed for this one') , ')</li>' ,
                    '<li>', __('combine all of them to improve your search'),' : <code>co:regex re:regex me:regex</code></li>' ,
                    '<li><code>co:</code>, <code>re:</code>, <code>me:</code> : ', __('look for non-existant field') , '</li>' ,
                    '</ul>'].join('')
            },

            buildFilter: function(search) {
                var conditions = search.split(' ');
                var i;

                var patterns = {
                    component: [],
                    resource: [],
                    cid: []
                };

                for(i = 0; i < conditions.length; i++) {
                    var condition = conditions[i];

                    if(condition !== '') {
                        var regex = condition.slice(3) || null;

                        if(condition.indexOf('co:') === 0) {
                            patterns.component.push(regex);
                        }
                        else if(condition.indexOf('re:') === 0) {
                            patterns.resource.push(regex);
                        }
                        else if(condition.indexOf('me:') === 0) {
                            patterns.cid.push(regex);
                        }
                        else {
                            patterns.cid.push(condition);
                        }
                    }
                }

                var mfilter = {'$and': []};
                var filters = {
                    component: {'$or': []},
                    resource: {'$or': []},
                    cid: {'$or': []}
                };

                for(var key in filters) {
                    for(i = 0; i < patterns[key].length; i++) {
                        var filter = {};
                        var value = patterns[key][i];

                        if(value !== null) {
                            filter[key] = {'$regex': value};
                        }
                        else {
                            filter[key] = null;
                        }

                        filters[key].$or.push(filter);
                    }

                    var len = filters[key].$or.length;

                    if(len === 1) {
                        filters[key] = filters[key].$or[0];
                    }

                    if(len > 0) {
                        mfilter.$and.push(filters[key]);
                    }
                }

                if(mfilter.$and.length === 1) {
                    mfilter = mfilter.$and[0];
                }

                return mfilter;
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
