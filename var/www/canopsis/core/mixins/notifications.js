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

define([
    'ember',
    'ember-data',
    'app/lib/utils/test',
    'app/lib/factories/mixin'
], function(Ember, DS, testUtils, Mixin) {

    var get = Ember.get,
        set = Ember.set;
        assert = Ember.assert;

    /**
     * Mixin handling frontend-wide notifications. Used on the Application controller
     *
     * @class NotificationsMixin
     * @extensionfor ApplicationController
     * @static
     */
    var mixin = Mixin('notifications', {
        init: function() {
            this.partials.statusbar.pushObject('notificationsstatusmenu');
            this._super();
        },

        notifications: function(){
            testUtils.pre(this, function () {
                assert('The notification store should be an instance of DS.Store', DS.Store.detectInstance(this.store));
            });

            return this.store.find("notification");
        }.property(),

        createNotification: function (level, message) {
            testUtils.pre(this, function () {
                assert('The notification store should be an instance of DS.Store', DS.Store.detectInstance(this.store));
            });

            var falevel = level;

            if (message === undefined || level === undefined) {
                message = 'missing information for notification';
                falevel = 'warning';
                level = 'warning';
            }
            if (level === 'error') {
                falevel = 'warning';
                level = 'danger';
            }
            var notification = this.store.createRecord('notification',{
                level: level,
                message: message,
                timestamp: new Date().getTime(),
                falevel: 'fa-' + falevel
            });

            notification.save();
        },

        notificationCount: function () {
            return get(this, 'notifications.length');
        }.property('notifications.length')
    });


    return mixin;
});
