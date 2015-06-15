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
    'app/lib/factories/mixin',
], function(Ember, Mixin) {

    /**
     * Mixin allowing to virtually resize the screen, adding a dedicated statusbar button into the app statusbar only in debug mode
     *
     * @class ScreentoolstatusmenuMixin
     * @extensionfor ApplicationController
     * @static
     */
    var mixin = Mixin('Screentoolstatusmenu', {

        init: function() {
            this.partials.statusbar.pushObject('screentoolstatusmenu');
            this._super();
        },

        actions: {
            /**
             * Change the size of the screen by resizing the body tag
             *
             * @event changeScreenSize
             * @param {String} size The size of the screen
             */
            changeScreenSize: function (size) {
                var cssSize = {
                    small: '480px',
                    medium: '940px',
                    large: '100%',
                }[size];

                $('body').animate({
                    width: cssSize
                });
            }
        }
    });


    return mixin;
});
