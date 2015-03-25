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
    'ember-data',
    'app/application',
    'app/adapters/application',
    'app/lib/promisesmanager',
    'app/lib/utils/modelsolve'
], function($, Ember, DS, Application, ApplicationAdapter, promisesmanager, modelsolve) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    var adapter = ApplicationAdapter.extend({

        graphType: 'topology',

        buildURL: function(type, id, record) {
            void(id);
            void(record);
            return '/' + this.graphType + '/' + type + 's';
        },

        createRecord: function(store, type, record) {

            var data = {};
            if (isNone(type) || isNone(type.typeKey)) {
                console.error('Error while retrieving typeKey from type is it is none.');
            }
            var serializer = store.serializerFor(type.typeKey);

            data = serializer.serializeIntoHash(data, type, record, 'PUT', { includeId: true });

            var url = this.buildURL('graphelt');

            return this.ajax(url, 'PUT', { data: {elts: data }});
        },

        updateRecord: function(store, type, record) {

            return this.createRecord(store, type, record);

        },

        deleteRecord: function(store, type, record) {
            var url = this.buildURL('graphelt', null);

            var id = get(record, 'id');
            var query = {data: {ids: id}};

            return this.ajax(url, 'DELETE', query);
        },

        findQuery: function(store, type, query) {
            var url = this.buildURL(type.typeKey, null);

            return this.ajax(url, 'POST', {data: query});
        },

    });

    loader.register('adapter:graphelt', adapter);
    loader.register('adapter:graph', adapter);
    loader.register('adapter:vertice', adapter);
    loader.register('adapter:edge', adapter);
    loader.register('adapter:toponode', adapter);
    loader.register('adapter:topoedge', adapter);
    loader.register('adapter:topo', adapter);


    return adapter;
});
