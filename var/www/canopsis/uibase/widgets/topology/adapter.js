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
    'ember-data',
    'app/application',
    'app/lib/promisesmanager'
], function(Ember, DS, Application, promisesmanager) {

    var get = Ember.get,
        set = Ember.set;

    var adapter = DS.RESTAdapter.extend({

        graph_type: 'topology',

        buildURL: function(type, id, record) {
            return '/' + this.graph_type + '/' + type + 's';
        },

        findQuery: function(store, type, query) {
            if (this.sortQueryParams) {
              query = this.sortQueryParams(query);
            }
            return this.ajax(this.buildURL(type.typeKey), 'POST', { data: query });
        },

    });

    loader.register('adapter:graphelt', adapter);
    loader.register('adapter:graph', adapter);
    loader.register('adapter:vertice', adapter);
    loader.register('adapter:edge', adapter);

    return adapter;
});
