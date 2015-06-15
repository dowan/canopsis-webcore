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
    'canopsis/canopsis-backend-ui-connector/adapters/application',
    'app/lib/utils/notification',
    'app/lib/utils/modelsolve'
], function(Ember, DS, ApplicationAdapter, notificationUtils, modelsolve) {

    var isNone = Ember.isNone;

    var adapter = ApplicationAdapter.extend({

        buildURL: function(type, id) {
            var url = '/context';

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

            var id = get(record, 'id');

            var data = {};
            var serializer = store.serializerFor(type.modelName);
            var url = this.buildURL(type.modelName, null, snapshot);

            serializer.serializeIntoHash(
                data, type, snapshot, { includeId: true }
            );

            var query = {
                _type: data.type,
                entity: data,
                context: data
            };

            return this.ajax(url, "PUT", {data: query});
        },

        deleteRecord: function(store, type, record) {
            var url = this.buildURL();

            var id = get(record, 'id');
            var query = {data: {ids: id}};

            return this.ajax(url, 'DELETE', query);
        },

        findQuery: function(store, model, query) {
            void(store);
            var url = this.buildURL();

            if(typeof (query.filter) !== "string") {
                query._filter = query.filter;
            }
            else {
                query._filter = query.filter;
            }

            delete query.filter;

            console.log('findQuery: ', query);

            return this.ajax(url, 'POST', {data: query});
        }
    });

    loader.register('adapter:context', adapter);
    loader.register('adapter:entity', adapter);

    loader.register('adapter:ctxconnector', adapter.extend({
        buildURL: function(type, id) {
            return '/context/connector' + (id ? ('/' + id) : '');
        }
    }));


    loader.register('adapter:ctxconnectorname', adapter.extend({
        buildURL: function(type, id) {
            return '/context/connector_name' + (id ? ('/' + id) : '');
        }
    }));

    loader.register('adapter:ctxcomponent', adapter.extend({
        buildURL: function(type, id) {
            return '/context/component' + (id ? ('/' + id) : '');
        }
    }));

    loader.register('adapter:ctxresource', adapter.extend({
        buildURL: function(type, id) {
            return '/context/resource' + (id ? ('/' + id) : '');
        }
    }));

    loader.register('adapter:ctxmetric', adapter.extend({
        buildURL: function(type, id) {
            return '/context/metric' + (id ? ('/' + id) : '');
        }
    }));

    loader.register('adapter:ctxhostgroup', adapter.extend({
        buildURL: function(type, id) {
            return '/context/hostgroup' + (id ? ('/' + id) : '');
        }
    }));

    loader.register('adapter:ctxservicegroup', adapter.extend({
        buildURL: function(type, id) {
            return '/context/servicegroup' + (id ? ('/' + id) : '');
        }
    }));

    loader.register('adapter:ctxtopology', adapter.extend({
        buildURL: function(type, id) {
            return '/context/topo' + (id ? ('/' + id) : '');
        }
    }));

    loader.register('adapter:ctxselector', adapter.extend({
        buildURL: function(type, id) {
            return '/context/selector' + (id ? ('/' + id) : '');
        }
    }));

    return adapter;
});
