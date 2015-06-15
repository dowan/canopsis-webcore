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
    'jquery',
    'ember',
    'app/lib/utilityclass'
], function($, Ember, Utility) {

    var __ = Ember.String.loc,
        isNone = Ember.isNone;

    var drag = Utility.create({

        name: 'drag',

        setDraggable: function (handle, dragElement) {
            handle.on('mousedown', function() {
                console.log('mousedown', $(this));
                dragElement.addClass('draggable').parents().on('mousemove', function(e) {
                    $('.draggable').offset({
                        top: e.pageY - 50,
                        left: e.pageX - $('.draggable').outerWidth() / 2
                    }).on('mouseup', function() {
                        dragElement.removeClass('draggable');
                    });
                });
            });
        }
    });

    return drag;
});
