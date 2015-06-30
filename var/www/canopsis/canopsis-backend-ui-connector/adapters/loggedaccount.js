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
        'canopsis/canopsis-backend-ui-connector/adapters/application'
], function(ApplicationAdapter) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;


    var adapter = ApplicationAdapter.extend({
        buildURL: function(type, id) {
            return '/account/me';
        },

        find: function () {
            return this.ajax('/account/me', 'GET', {});
        },

        updateRecord: function(store, type, record) {
            var me = this,
                id = get(record, '_id');

            if (isNone(type) || isNone(type.typeKey)) {
                console.error('Error while retrieving typeKey from type is it is none.');
            }

            return new Ember.RSVP.Promise(function(resolve, reject) {
                var hash = me.serialize(record, {includeId: true});
                var url = '/account/user';

                var payload = JSON.stringify({
                    user: hash
                });

                $.ajax({
                    url: url,
                    type: 'POST',
                    data: payload
                });
            });
        },
        keepAlive: function (username) {
            $.ajax({
                url: '/keepalive',
                type:'GET',
                data: {username: username}
            });
        },

        sessionStart: function (username) {
            $.ajax({
                url: '/sessionstart',
                type:'GET',
                data: {username: username}
            });
        },
    });


    loader.register('adapter:loggedaccount', adapter);

    return adapter;
});
