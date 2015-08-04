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

define([], function() {

    var get = Ember.get;

    /**
     * TODO : Add validators to crecord.attributes
     * Scan attr's options in order to retrieve all needed validators (Ember.validators)
     * @return validators : array of validators
     */
    function GetValidators(attr) {
        console.log("attr = ", attr);
        var options = get(attr, 'model.options');
        var validators = [];

        var validatorName = get(attr, 'model.type');
        var validator = Ember.validators[validatorName];
        if (validator !== undefined) {
            console.log("pushed : ", validatorName);
            validators.push(Ember.validators[validatorName]);
        }

        if (options !== undefined) {

            for (var key in options) {
                if ( options.hasOwnProperty( key ) ) {
                    var keyValidatorName = (key === "role")? options[key] : key;
                    var keyValidator = Ember.validators[keyValidatorName];

                    if (keyValidator !== undefined) {

                        console.log("pushed : ", keyValidatorName);
                        validators.push(Ember.validators[keyValidatorName]);
                    }
                }
            }
        }

        return validators;
    }
    /**
     * Create struct (not really needed)
     */
    function makeStruct(attributes) {

        var names = attributes.split(' ');
        var count = names.length;
        function constructor() {

            for (var i = 0; i < count; i++) {
                this[names[i]] = arguments[i];
            }
        }
        return constructor;
    }

    /**
    * Check attr's value with all needed validators
    * @return valideStruct : struct containing result of validation(boolean) and message(string) .
    */
    function Validator(attr) {

        var errorMessage = "";
        var valideStruct = makeStruct("valid error");
        var toReturn = new valideStruct(true, errorMessage);

        var validators = GetValidators(attr);

        for (var i = 0; i < validators.length; i++) {
            validator = validators[i];
            toReturn = validator(attr, toReturn);

            if (toReturn.valid === false) {
                return toReturn;
            }
        }
        return toReturn;
    }

    return Validator;
});
