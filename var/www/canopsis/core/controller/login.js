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
    'jquery',
    'ember',
    'app/application',
    'utils',
    'jquery.encoding.digests.sha1'
], function($, Ember, Application, utils) {
    var set = Ember.set,
        get = Ember.get;

    Application.LoginRoute = Ember.Route.extend({
        setupController: function(controller, model) {
            void(model);

            controller.reset();
            //prevents from getting a string into the authkey
        }
    });

    Application.LoginController = Ember.ObjectController.extend({
        content: {},

        getUser: function () {
            var controller = this;

            $.ajax({
                url: '/account/me',
                success: function(data) {
                    if (data.success) {
                        var login = Ember.Object.create(data.data[0]);
                        controller.set('record', login);
                    }
                    set(utils, 'session', controller.get('record'));
                },
                async: false
            });

        },


        reset: function() {
            this.setProperties({
                username: "",
                password: "",
                shadow: "",
                cryptedkey: "",
                authkey: this.get('authkey')
            });
        },

        authkey: function () {
            var authkey = localStorage.cps_authkey;
            if (authkey === 'undefined') {
                authkey = undefined;
            }
            return authkey;
        }.property('authkey'),

        authkeyChanged: function() {
            localStorage.cps_authkey = this.get('authkey');
        }.observes('authkey')
    });

    return Application.LoginController;
});
