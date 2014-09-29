/*
# Copyright (c) 2014 "Capensis" [http://www.capensis.com]
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
    'app/adapters/application',
    'app/lib/utils/notification'
], function(Ember, DS, Application, ApplicationAdapter, notificationUtils) {

    var adapter = ApplicationAdapter.extend({
        gen_resolve: function(callback) {
            return function(data) {
                for (var i = 0; i < data.data.length; i++) {
                    data.data[i].id = data.data[i]._id;
                    delete data.data[i]._id;
                }

                Ember.run(null, callback, data);
            };
        },

        gen_reject: function(callback) {
            return function(xhr) {
                xhr.then = null;
                Ember.run(null, callback, xhr);
            };
        },

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

            return new Ember.RSVP.Promise(function(resolve, reject) {
                var url = me.buildURL(model.typeKey, id);
                var funcres = me.gen_resolve(resolve);
                var funcrej = me.gen_reject(reject);

                $.get(url).then(funcres, funcrej);
            });
        },

        findMany: function(store, model, ids) {
            void(store);
            var me = this;

            return new Ember.RSVP.Promise(function(resolve, reject) {
                var funcres = me.gen_resolve(resolve);
                var funcrej = me.gen_reject(reject);
                var url = me.buildURL(model.typeKey, ids.join(','));

                $.get(url).then(funcres, funcrej);
            });
        },

        findAll: function(store, model, options) {
            void(store);
            var me = this;

            return new Ember.RSVP.Promise(function(resolve, reject) {
                var funcres = me.gen_resolve(resolve);
                var funcrej = me.gen_reject(reject);

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

            return new Ember.RSVP.Promise(function(resolve, reject) {
                var funcres = me.gen_resolve(resolve);
                var funcrej = me.gen_reject(reject);
                var url = me.buildURL(model.typeKey);

                query._filter = JSON.stringify(query.filter);
                delete query.filter;

                console.log('findQuery: ', query);

                $.post(url, query).then(funcres, funcrej);
            });
        }
    });

    Application.ContextAdapter = adapter;

    Application.CtxconnectorAdapter = adapter.extend({
        buildURL: function(type, id) {
            return '/context/connector' + (id ? ('/' + id) : '');
        }
    });

    Application.CtxconnectornameAdapter = adapter.extend({
        buildURL: function(type, id) {
            return '/context/connector_name' + (id ? ('/' + id) : '');
        }
    });

    Application.CtxcomponentAdapter = adapter.extend({
        buildURL: function(type, id) {
            return '/context/component' + (id ? ('/' + id) : '');
        }
    });

    Application.CtxresourceAdapter = adapter.extend({
        buildURL: function(type, id) {
            return '/context/resource' + (id ? ('/' + id) : '');
        }
    });

    Application.CtxmetricAdapter = adapter.extend({
        buildURL: function(type, id) {
            return '/context/metric' + (id ? ('/' + id) : '');
        }
    });

    Application.CtxhostgroupAdapter = adapter.extend({
        buildURL: function(type, id) {
            return '/context/hostgroup' + (id ? ('/' + id) : '');
        }
    });

    Application.CtxservicegroupAdapter = adapter.extend({
        buildURL: function(type, id) {
            return '/context/servicegroup' + (id ? ('/' + id) : '');
        }
    });

    return adapter;
});
