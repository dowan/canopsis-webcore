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
    'app/application',
    'app/adapters/application',
], function(Ember, Application, ApplicationAdapter) {

    var get = Ember.get,
        set = Ember.set;

    var adapter = ApplicationAdapter.extend({

        buildURL: function(type, id, record_or_records, method) {
            console.log('buildURL', arguments);

            if(type === "account") {
                type = "user";
            }

            if(method === 'GET') {
                return ('/rest/default_rights/' + type + (!!id ? '/' + id : ''));
            } else if(method === 'DELETE') {
                return ('/account/delete/' + type + (!!id ? '/' + id : ''));
            } else {
                return ('/account/' + type + (!!id ? '/' + id : ''));
            }
        },

        find: function(store, type, id, record) {
            return this.ajax(this.buildURL(type.typeKey, id, record, 'GET'), 'GET');
        },

        findMany: function(store, type, ids, records) {
            return this.ajax(this.buildURL(type.typeKey, ids, records, 'GET'), 'GET', { data: { ids: ids } });
        },

        findQuery: function(store, type, query) {
            return this.ajax(this.buildURL(type.typeKey, undefined, undefined, 'GET'), 'GET', { data: query });
        },

        createRecord: function(store, type, record) {
            var me = this;

            return new Ember.RSVP.Promise(function(resolve, reject) {
                var url = me.buildURL(type.typeKey, undefined, record, 'POST');
                var hash = me.serialize(record, {includeId: true});

                var data = {};
                data[type.typeKey] = JSON.stringify(hash);

                $.ajax({
                    url: url,
                    type: 'POST',
                    data: data
                });
            });
        },

        updateRecord: function(store, type, record) {
            var me = this;

            return new Ember.RSVP.Promise(function(resolve, reject) {
                var url = me.buildURL(type.typeKey, undefined, record, 'POST');
                var hash = me.serialize(record, {includeId: true});

                var data = {};
                data[type.typeKey] = JSON.stringify(hash);

                $.ajax({
                    url: url,
                    type: 'POST',
                    data: data
                });
            });
        },

        deleteRecord: function(store, type, record) {
            var id = get(record, 'id');
            return this.ajax(this.buildURL(type.typeKey, id, record, 'DELETE'), "DELETE");
        }
    });

    Application.RoleAdapter = adapter;
    Application.GroupAdapter = adapter;
    Application.AccountAdapter = adapter;
    Application.UserAdapter = adapter;
    Application.ActionAdapter = adapter;
    Application.RoleAdapter = adapter;
    Application.RightAdapter = adapter;
    Application.ProfileAdapter = adapter;

    return adapter;
});
