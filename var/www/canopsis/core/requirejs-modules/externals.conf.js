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
 */

var JSONSelect;
if(window.bricks.core.envMode === "production") {
    require.config({
        paths: {
            'css3-mediaqueries': 'canopsis/core/externals/min/css3-mediaqueries',
            'math': 'canopsis/core/externals/mathjs/dist/math.min',
            'hashes': 'canopsis/core/externals/jshashes/hashes.min',

            'jsonselect': 'canopsis/core/externals/jsonselect/src/jsonselect'
        }
    });

    define([
        'math',
        'hashes',
        'canopsis/runtime.conf',
        'css3-mediaqueries',
        'canopsis/core/externals/mousetrap/mousetrap.min',
        'jsonselect',
        'canopsis/core/externals/jquery-resize/jquery.ba-resize.min',
        'link!canopsis/core/externals/ionicons/css/ionicons.min.css',
    ], function(math, Hashes) {
        window.math = math;
        window.Hashes = Hashes;
    });
} else {
    require.config({
        paths: {
            'css3-mediaqueries': 'canopsis/core/externals/min/css3-mediaqueries',
            'math': 'canopsis/core/externals/mathjs/dist/math',
            'hashes': 'canopsis/core/externals/jshashes/hashes',

            'jsonselect': 'canopsis/core/externals/jsonselect/src/jsonselect'
        }
    });

    define([
        'math',
        'hashes',
        'canopsis/runtime.conf',
        'css3-mediaqueries',
        'canopsis/core/externals/mousetrap/mousetrap.min',
        'jsonselect',
        'canopsis/core/externals/jquery-resize/jquery.ba-resize.min',
        'link!canopsis/core/externals/ionicons/css/ionicons.min.css',
    ], function(math, Hashes) {
        window.math = math;
        window.Hashes = Hashes;
    });
}
