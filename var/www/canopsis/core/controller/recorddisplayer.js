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

        init: function () {
            console.debug('initilizing recorddisplayer controller');
            set(this, 'title', __('Displaying record content'));



            var template = 'this is -> {{property}}';
            var context = Ember.Object.create({property:'test value'});
            var html = Handlebars.compile(template)(context);
            set(this, 'content', html);
        },




        actions: {

            show: function() {
                console.log('Show recorddisplayer');

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
