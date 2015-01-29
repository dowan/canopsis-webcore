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
    'app/application',
    'app/adapters/application',
], function(Ember, Application, ApplicationAdapter) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    var adapter = ApplicationAdapter.extend({

        namespace: 'topology',

        buildURL: function(type, id, record, method) {
            var result = null;
            var result = this._super.buildURL(type, id, record);
            if (method === 'POST') { // in case of creation
                result += 'elt';
            } else if (method === 'DELETE' || method === 'PUT' || type !== 'topo') {  // in case of deletion, update
                result += 'elts';
            } else { // in case of get topologies
                result += 'graphs';
            return result;
        },

        createRecord: function(store, type, record, graph_id) {
            var elt = {};
            var serializer = store.serializeFor(type.typeKey);
            serializer.serializeIntoHash(elt, type, record, {includeId: true});
            var data = {elt: elt, graph_ids: graph_id};
            return this.ajax(this.buildURL(type.typeKey, elt.get('id'), record, 'POST'), 'POST', {data: data});
        },

        updateRecord: function(store, type, record) {
            var me = this;
            if (isNone(type) || isNone(type.typeKey)) {
                console.error('Error while retrieving typeKey from type is it is none.');
            }
            var serializer = store.serializeFor(type.typeKey);
            var elts = {};
            serializer.serializeIntoHash(elts, type, record);
            var data = {
                elts: elts
            };
            return this.ajax(this.buildURL(type.typeKey, elt.get('id'), record, 'PUT'), 'PUT', { data: data});
        },

        deleteRecord: function(store, type, record) {
            var id = get(record, 'id');
            var data = { ids: id};
            return this.ajax(this.buildURL(type.typeKey, id, record, 'DELETE'), 'DELETE', {data: data});
        },
    });

    loader.register('adapter:topology', adapter);

    return adapter;
});
