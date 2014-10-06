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
    'app/view/recorddisplayer'
], function(Ember, Application) {
    var get = Ember.get,
        set = Ember.set;

    var eventedController = Ember.Controller.extend(Ember.Evented);

    var controller = eventedController.extend({

        title:__('Information'),

        init: function () {
            console.debug('initilizing recorddisplayer controller');
        },


        actions: {

            show: function(crecord, template) {
                console.log('Show recorddisplayer', crecord, template);

                var html;

                try {
                    html = Handlebars.compile(template)(crecord._data);
                } catch (err) {
                    html = '<i>An error occured while compiling the template with the record. please if the template is correct</i>';
                }

                set(this, 'content', new Ember.Handlebars.SafeString(html));

                var left = ($(window).width() - $("#recorddisplayer").outerWidth()) / 2;
                $("#recorddisplayer").css("left", left);

                $("#recorddisplayer").fadeIn(500);

            },

            hide: function() {
                console.log("hiding recorddisplayer");
                $("#recorddisplayer").fadeOut(500);
            },
        }

    });

    Application.RecorddisplayerController = controller;

    return controller;
});
