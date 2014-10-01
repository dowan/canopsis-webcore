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

define([], function() {

    targetcontroller = {
        temp_buffer: [],
        createNotification: function(notificationType, notificationMessage) {
            this.temp_buffer.push({
                notificationType: notificationType,
                notificationMessage: notificationMessage
            });
        }
    };



    var notification = {
        /**
         * Initialize the notification controller
         * when the controller is not set up, it stores all the messages in a buffer stack.
         */
        setController: function(controller) {
            var buffer = targetcontroller.temp_buffer;
            targetcontroller = controller;

            for (var i = 0, l = buffer.length; i < l; i++) {
                var currentNotification = buffer[i];

                controller.createNotification(currentNotification.notificationType, currentNotification.notificationMessage);
            }
        },

        //will be defined when notification controller is called.
        info: function (message) {
            targetcontroller.createNotification('info', message);
            console.log('info', message);
            return message;
        },
        warning: function (message) {
            targetcontroller.createNotification('warning', message);
            console.log('warning', message);
            return message;
        },
        error: function (message) {
            targetcontroller.createNotification('error', message);
            console.error(message);
            return message;
        },
        help: function () {
            console.log("usage is: utils.notification.notificate('info'|'warning'|'error', 'my message');");
        }
    };

    return notification;
});
