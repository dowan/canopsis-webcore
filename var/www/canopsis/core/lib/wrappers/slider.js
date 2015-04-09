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
    'app/lib/factories/wrapper',
    'link!webcore-libs/ion.rangeSlider/css/ion.rangeSlider.css',
    'link!webcore-libs/ion.rangeSlider/css/ion.rangeSlider.skinHTML5.css',
    'webcore-libs/ion.rangeSlider/js/ion.rangeSlider',
], function(Wrapper) {

    return Wrapper("slider", null, arguments, "1.0.1");
});
