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
    'app/view/recordinfopopup'
], function(Ember, Application) {
    var get = Ember.get,
        set = Ember.set;

    var eventedController = Ember.Controller.extend(Ember.Evented);

    var controller = eventedController.extend({

        title:__('Information'),

        init: function () {
            console.debug('initilizing recordinfopopup controller');
        },


        actions: {

            show: function(crecord, template) {
                console.log('Show recordinfopopup', crecord, template);

                var html;

                try {
                    html = Handlebars.compile(template)(crecord._data);
                } catch (err) {
                    html = '<i>An error occured while compiling the template with the record. please if the template is correct</i>';
                }

                set(this, 'content', new Ember.Handlebars.SafeString(html));

                var left = ($(window).width() - $("#recordinfopopup").outerWidth()) / 2;
                $("#recordinfopopup").css("left", left);

                $("#recordinfopopup").fadeIn(500);

            },

            hide: function() {
                console.log("hiding recordinfopopup");
                $("#recordinfopopup").fadeOut(500);
            },
        }

    });

    Application.RecordinfopopupController = controller;

    return controller;
});
