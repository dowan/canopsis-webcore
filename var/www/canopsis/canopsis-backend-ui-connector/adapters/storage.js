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
    name: 'StorageAdapters',
    after: 'ApplicationAdapter',
    initialize: function(container, application) {
        var ApplicationAdapter = container.lookupFactory('adapter:application');
        var get = Ember.get,
            isNone = Ember.isNone;

        var adapter = ApplicationAdapter.extend({
            protocol: 'storage',
            data_type: 'default',

            buildURL: function(type, id) {
                var url = '/storage';

                url += '/' + get(this, 'protocol')
                url += '/' + get(this, 'data_type');

                if (!isNone(type)) {
                    url += '/' + type;
                }

                if (!isNone(id)) {
                    url += '/' + id;
                }

                return url;
            },

            createRecord: function(store, type, record) {
                return this.updateRecord(store, type, record);
            },

            updateRecord: function(store, type, record) {
                if (isNone(type) || isNone(type.typeKey)) {
                    throw new Error('Cannot determine type of record: type or type.typeKey is None');
                }

                var id = get(record, 'id');
                var serializer = store.serializerFor(type.typeKey),
                    url = this.buildURL(type.typeKey, id),
                    data = {};

                data = serializer.serializeIntoHash(data, type, record, 'PUT');

                var query = {
                    element: data
                };

                return this.ajax(url, "PUT", {data: query});
            },

            deleteRecord: function(store, type, record) {
                if (isNone(type) || isNone(type.typeKey)) {
                    throw new Error('Cannot determine type of record: type or type.typeKey is None');
                }

                var id = get(record, 'id');
                var url = this.buildURL(type.typeKey, id);

                return this.ajax(url, 'DELETE');
            },

            findQuery: function(store, type, query) {
                if (isNone(type) || isNone(type.typeKey)) {
                    throw new Error('Cannot determine type of record: type or type.typeKey is None');
                }

                var url = this.buildURL(type.typeKey);

                if (typeof(query.filter) !== "string") {
                    query._filter = query.filter;
                }
                else {
                    query._filter = query.filter;
                }

                delete query.filter;

                return this.ajax(url, 'POST', {data: query});
            }
        });

        application.register('adapter:storage-default', adapter);
        application.register('adapter:storage-composite', adapter.extend({
            data_type: 'composite'
        }));
        application.register('adapter:storage-timed', adapter.extend({
            data_type: 'timed'
        }));
        application.register('adapter:storage-periodic', adapter.extend({
            data_type: 'periodic'
        }));
        application.register('adapter:storage-file', adapter.extend({
            data_type: 'file'
        }));
    }
});
