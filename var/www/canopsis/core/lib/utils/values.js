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
    'app/application',
    'app/lib/utils/dates',
    'app/lib/utilityclass'
], function(Application, dateUtils, Utility) {

    var units = [ ' ', ' k', ' M', ' G', ' T' ];

    var values = Utility.create({

        name: 'values',

        humanize: function(x, unit) {

            //This is time to convert
            //premptive transformation
            if (unit.toLowerCase() === 's') {
                return dateUtils.second2Duration(x);
            }

            var step = 1000;
            var negative = (x < 0);

            if(negative) {
                x = -x;
            }

            if(unit === 'o' || unit === 'o/s') {
                step = 1024;
            }

            var nstep = 0;
            var cur = parseInt(x / step);

            while(cur > 0) {
                x = cur;
                cur = parseInt(x / step);
                nstep++;
            }

            if(negative) {
                return '-' + x + units[nstep] + unit;
            }
            else {
                return x + units[nstep] + unit;
            }
        }
    });

    return values;
});
