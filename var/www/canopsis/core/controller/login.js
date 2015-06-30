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
    'ember-data',
    'app/lib/loaders/utils',
    'app/lib/utils/data'
], function($, Ember, DS, utils, dataUtils) {

    var set = Ember.set,
        get = Ember.get,
        isNone = Ember.isNone;

    var controller = Ember.ObjectController.extend({
        content: {},

        needs: ['application'],

        init: function() {
            this._super.apply(this, arguments);

            var store = DS.Store.create({
                container: get(this, "container")
            });

            set(this, 'store', store);
        },

        userRoute: function () {
            var loginController = utils.data.getLoggedUserController();
            var record = get(loginController, 'record');
            var defaultview = get(record, 'defaultview');
            if (!defaultview) {
                defaultview = get(this, 'controllers.application.frontendConfig.defaultview');
            }
            return defaultview;
        }.property(),

        authkey: function () {
            var authkey = localStorage.cps_authkey;
            if (authkey === 'undefined') {
                authkey = undefined;
            }
            return authkey;
        }.property('authkey'),

        authkeyChanged: function() {
            localStorage.cps_authkey = get(this, 'authkey');
        }.observes('authkey'),

        sessionStart: function () {
            loggedaccountAdapter = dataUtils.getEmberApplicationSingleton().__container__.lookup('adapter:loggedaccount');
            username = get(this, 'record._id');
            loggedaccountAdapter.sessionStart(username);

            //Keep alive every 4"30'
            setInterval(function () {
                loggedaccountAdapter.keepAlive(username);
            },1000 * 60 * 4.5);
        }



    });

    loader.register('controller:login', controller);

    return controller;
});
