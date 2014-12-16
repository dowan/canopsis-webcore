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
    'app/lib/factories/wrapper',
    'jquery',
    'flotchart',
    'flotchart-canvas',
    'flotchart-categories',
    'flotchart-crosshair',
    'flotchart-errorbars',
    'flotchart-fillbetween',
    'flotchart-image',
//    'flotchart-navigate',
    'flotchart-pie',
    // 'flotchart-resize',
    'flotchart-selection',
    'flotchart-stack',
    'flotchart-symbol',
    'flotchart-threshold',
    'flotchart-time',
    'flotchart-valuelabel'
    // 'flotchart-tooltip'
], function(Wrapper, $) {
    return Wrapper("flotchart", $, arguments, '0.8.3-alpha');
});
