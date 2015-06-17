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
    'app/lib/utils/dates',
    'app/lib/utilityclass'
], function(dateUtils, Utility) {

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
        },

        castValue: function(value, type) {
            type = type.toLowerCase();
            var types = ['string', 'boolean', 'number', 'array'];
            if (types.indexOf(type) === -1) {
                console.warn('type', type, 'not recognized. Expected one of', types.join(','));
                return value;
            }
            if (type === 'string') {
                //simple no dump case, can be improved
                return value + '';
            }
            if (type === 'number') {
                try {
                    value = parseFloat(value);
                } catch (err) {
                    console.warn('unable to case to number value', value);
                }
                if (isNaN(value)) {
                    return 0;
                }
                return value;
            }
            if (type === 'boolean') {
                try {
                    if (value === 'true') {
                        return true;
                    }
                    if (value === 'false'){
                        return false;
                    }
                    value = !!value;
                } catch (err) {
                    console.warn('unable to case to boolean value', value);
                }
                return value;
            }
            if (type === 'array') {
                try {
                    value = value.split(',');
                } catch (err) {
                    console.warn('unable to case to array value', value);
                }
                return value;
            }

        }
    });

    return values;
});
