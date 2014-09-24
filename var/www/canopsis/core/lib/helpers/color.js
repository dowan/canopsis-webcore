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

define(['ember', 'app/application'], function(Ember, Application) {
    Ember.Handlebars.helper('menu', Application.MenuView);
    Ember.Handlebars.helper('color', function(color) {

        var style = '';

        if (color && color.toLowerCase() !== '#null') {
            var max = parseInt('FFFFFF', 16);
            var bgcolor = parseInt(color, 16);
            var fgcolor = max - bgcolor;
            fgcolor = fgcolor.toString(16);

            // Gray scale
            var r = parseInt(fgcolor.substring(0, 2), 16);
            var g = parseInt(fgcolor.substring(2, 4), 16);
            var b = parseInt(fgcolor.substring(4, 6), 16);

            fgcolor = (r + g + b) / 3;
            fgcolor = parseInt(fgcolor.toFixed());
            fgcolor = fgcolor.toString(16);
            fgcolor = fgcolor + fgcolor + fgcolor;

            // set the style attribute
            var css = 'background-color: #' + color + ';';
            css += 'color: #' + fgcolor + ';';

            style = 'style="' + css + '"';
        } else {
            color = 'no color';
        }

        return new Ember.Handlebars.SafeString('<div class="color" ' + style + '>' + color + '</div>');
    });

});
