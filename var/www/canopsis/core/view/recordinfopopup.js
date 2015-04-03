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
    'app/lib/utils/drag',
], function($, Ember, drag) {

    var get = Ember.get,
        set = Ember.set;

    var view = Ember.View.extend({

        didInsertElement: function () {
            console.log('Recordinfopopup dom element');

            $( window ).on('resize', function () {
                var left = ($(window).width() - $('#recordinfopopup').outerWidth()) / 2;
                $('#recordinfopopup').css('left', left);
            });

            drag.setDraggable($('#recordinfopopup .hand'), $('#recordinfopopup'));

        }
    });


    loader.register('view:recordinfopopup', view);

    return view;
});
