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
    'canopsis/canopsis-backend-ui-connector/adapters/application'
], function($, Ember, ApplicationAdapter) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    var adapter = ApplicationAdapter.extend({

        buildURL: function(type, id, record) {
            void(type);
            void(id);
            void(record);

            return '/pbehavior/docs';
        },

        createRecord: function(store, type, record) {
            var url = this.buildURL();

            var id = get(record, 'id');
            var query = {data: {entity_id: id}};

            return this.ajax(url, 'PUT', query);
        },

        updateRecord: function(store, type, record) {

            return this.createRecord(store, type, record);
        },

        deleteRecord: function(store, type, record) {
            var url = this.buildURL();

            var id = get(record, 'id');
            var query = {data: {ids: id}};

            return this.ajax(url, 'DELETE', query);
        },

        findQuery: function(store, type, query) {
            var url = this.buildURL();

            return this.ajax(url, 'POST', {data: query});
        },

    });

    loader.register('adapter:pbehavior', adapter);

    return adapter;
});
