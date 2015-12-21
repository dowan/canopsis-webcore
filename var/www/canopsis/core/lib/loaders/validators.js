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

var validatorsArray = [
    'mail',
    'rights',
    'required',
    'validate',
    'number',
    'minItems',
    'maxItems'
];

var deps = [];

for (var i = 0; i < validatorsArray.length; i++) {
    var validatorUrl = 'canopsis/core/validators/' + validatorsArray[i] + '/validator';
    deps.push(validatorUrl);
}

define(deps, function() {

    var validators = {};
    console.log("Begin load validators", arguments);

    for (var i = 0, l = arguments.length; i < l; i++) {
        var validatorName = validatorsArray[i];
        console.log("load validator", validatorName);
        validators[validatorName] = arguments[i];
    }

    Ember.validators = validators;

    return validators;

});
