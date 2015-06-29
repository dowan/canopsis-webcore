
/**
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
 *
 * @module canopsis-frontend-core
 */

Ember.Application.initializer({
    name:'BaseAdapter',
    after: ['ApplicationAdapter', 'ModelsolveUtils'],
    initialize: function(container, application) {
        var isNone = Ember.isNone,
            get = Ember.get;

        var ApplicationAdapter = container.lookupFactory('adapter:application');
        var modelsolve = container.lookupFactory('utility:modelsolve');

        var adapter = ApplicationAdapter.extend({

            buildURL: function(type, id) {
                void(id);
                console.warn('This method have to be overriden');
                return '/';
            },

            findQuery: function(store, type, query) {
                var url = this.buildURL(type, null);

                console.log('findQuery', query);
                var me = this;
                return this.ajax(url, 'POST', {data: query});
            },

            createRecord: function(store, type, record) {
                var context = {};
                if (isNone(type) || isNone(type.typeKey)) {
                    console.error('Error while retrieving typeKey from type is it is none.');
                }
                var serializer = store.serializerFor(type.typeKey);

                context = serializer.serializeIntoHash(context, type, record, 'POST', { includeId: true })[0];

                console.log('document', context);

                var url = this.buildURL(type.typeKey, record.id) + '/put';

                return this.ajax(url, 'POST', {data: {document: context}});
            },

            updateRecord: function(store, type, record) {
                return this.createRecord(store, type, record);
            },

            deleteRecord: function(store, type, record) {
                var id = get(record, 'id');
                var data = { ids: id};
                var url = this.buildURL(type.typeKey, id);

                return this.ajax(url, 'DELETE', {data: {ids: [id]}});
            },

        });

        application.register('adapter:base', adapter);
    }
});
