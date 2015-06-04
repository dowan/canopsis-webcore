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
            return '/context/' + type + (id ? ('/' + id) : '');
        },

        createRecord: function() {
            notificationUtils.error('Context creation not implemented');
        },

        updateRecord: function() {
            notificationUtils.error('Context update not implemented');
        },

        deleteRecord: function() {
            notificationUtils.error('Context deletion not implemented');
        },

        find: function(store, model, id) {
            void(store);
            var me = this;

            if (isNone(model) || isNone(model.typeKey)) {
                console.error('Error while retrieving typeKey from model is it is none.');
            }

            return new Ember.RSVP.Promise(function(resolve, reject) {
                var url = me.buildURL(model.typeKey, id);
                var funcres = modelsolve.gen_resolve(resolve);
                var funcrej = modelsolve.gen_reject(reject);

                $.get(url).then(funcres, funcrej);
            });
        },

        findMany: function(store, model, ids) {
            void(store);
            var me = this;

            if (isNone(model) || isNone(model.typeKey)) {
                console.error('Error while retrieving typeKey from model is it is none.');
            }

            return new Ember.RSVP.Promise(function(resolve, reject) {
                var funcres = modelsolve.gen_resolve(resolve);
                var funcrej = modelsolve.gen_reject(reject);
                var url = me.buildURL(model.typeKey, ids.join(','));

                $.get(url).then(funcres, funcrej);
            });
        },

        findAll: function(store, model, options) {
            void(store);
            var me = this;

            if (isNone(model) || isNone(model.typeKey)) {
                console.error('Error while retrieving typeKey from model is it is none.');
            }

            return new Ember.RSVP.Promise(function(resolve, reject) {
                var funcres = modelsolve.gen_resolve(resolve);
                var funcrej = modelsolve.gen_reject(reject);

                var promise;
                var url = me.buildURL(model.typeKey);

                if (options && options.mfilter) {
                    var mfilter = JSON.stringify({
                        '$and': [
                            {'type': model.typeKey},
                            options.mfilter
                        ]
                    });

                    promise = $.post(url, {_filter: mfilter});
                }
                else {
                    promise = $.get(url);
                }

                promise.then(funcres, funcrej);
            });
        },

        findQuery: function(store, model, query) {
            void(store);
            var me = this;

            if (isNone(model) || isNone(model.typeKey)) {
                console.error('Error while retrieving typeKey from model is it is none.');
            }

            return new Ember.RSVP.Promise(function(resolve, reject) {
                var funcres = modelsolve.gen_resolve(resolve);
                var funcrej = modelsolve.gen_reject(reject);
                var url = me.buildURL(model.typeKey);

                if(typeof (query.filter) !== "string") {
                    query._filter = JSON.stringify(query.filter);
                }
                else {
                    query._filter = query.filter;
                }

                delete query.filter;

                console.log('findQuery: ', query);

                $.post(url, query).then(funcres, funcrej);
            });
        }
    });

    loader.register('adapter:context', adapter);

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
