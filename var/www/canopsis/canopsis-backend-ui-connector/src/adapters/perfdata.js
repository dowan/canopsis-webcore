/*
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
    name: 'ContextAdapters',
    after: ['ApplicationAdapter', 'ContextAdapters', 'PojoAdapter'],
    initialize: function(container, application) {
        var ApplicationAdapter = container.lookupFactory('adapter:application');
        var ContextAdapter = container.lookupFactory('adapter:context');
        var PojoAdapter = container.lookupFactory('adapter:pojo');

        var get = Ember.get,
            isNone = Ember.isNone;

        var adapter = ApplicationAdapter.extend({

            /**
             * @description Get perdata with given filter to fetch metrics and options to fetch perdata
             * @method findQuery
             * @param {String} store Store in which we have to request data
             * @param model
             * @param {Object} query Object that contains query and options
             * @return 
             */
            findQuery: function(store, model, query) {
                // Get metrics from context with a given filter
                var metrics = ContextAdapter.findQuery(store, model, query.filter);

                // Get perfdata from perdata with requested metrics above
                metrics.then(function(result) {
                    console.log('test adapter perfdata', get(result, 'content'));
                    
                });
            }

        });

        application.register('adapter:perfdata', adapter);
    }
});
