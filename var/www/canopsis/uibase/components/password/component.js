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
    'app/lib/utils/hash'
], function(Ember, hash) {

    var get = Ember.get,
        set = Ember.set,
        __ = Ember.String.loc;


    var component = Ember.Component.extend({

        init: function () {
            this._super.apply(this, arguments);

            var allowed_methods = ['sha1', 'md5'];
            var method_name = get(this, 'method');

            if (allowed_methods.indexOf(method_name) === -1 ) {
                console.warning('Invalid method, using sha1:', method_name);
                set(this, 'method', 'sha1');
            }
        },

        onUpdate: function () {
            var pass = get(this, 'password');
            var method_name = get(this, 'method');
            var method = get(hash, method_name);

            pass = method(pass);
            set(this, 'content', pass);

        }.observes('password')

    });

    Ember.Application.initializer({
        name:"component-password",
        initialize: function(container, application) {
            application.register('component:component-password', component);
        }
    });

    return component;
});
