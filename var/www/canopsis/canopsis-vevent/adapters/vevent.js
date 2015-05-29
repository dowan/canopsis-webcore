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
    'canopsis/canopsis-backend-ui-connector/adapters/baseadapter'
], function($, Ember, BaseAdapter) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    var _upsertRecord = function(adapter, verb, store, type, record) {
        var serializer = store.serializerFor(type.typeKey);
        var data = serializer.serializeIntoHash({}, type, record, verb, { includeId: true
        });

        var query = {
            data: {
                'document': data
            }
        };

        return adapter.ajax(adapter.buildURL(type.typeKey), verb, query);
    };

    var adapter = BaseAdapter.extend({

        buildURL: function(type, id, record) {
            void(type);
            void(record);

            var result = '/vevent';

            if (!isNone(id)) {
                result += '/' + id;
            }

            return result;
        },

        createRecord: function(store, type, record) {
            return _upsertRecord(this, 'PUT', store, type, record);
        },

        updateRecord: function(store, type, record) {
            return _upsertRecord(this, 'PUT', store, type, record);
        },

        deleteRecord: function(store, type, snapshot) {
            var query = {
                data: {
                    'ids': snapshot.uid
                }
            };

            return this.ajax(this.buildURL(type.typeKey), 'DELETE', query);
        }

    });

    loader.register('adapter:vevent', adapter);

    return adapter;
});
