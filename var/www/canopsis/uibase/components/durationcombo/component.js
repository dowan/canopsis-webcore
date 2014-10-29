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
    'ember',
    'app/application'
], function(Ember, Application) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;


    var component = Ember.Component.extend({
        init: function () {
            this._super.apply(this, arguments);

            console.log('formattedDuration CP');
            var durationType = 'second';

            var unformattedDuration = parseInt(get(this, 'content'), 10);

            if (isNaN(unformattedDuration)) {
                unformattedDuration = 0;
            }

            var convert = get(this, 'convertDuration');
            var durationUnits = get(this, 'durationType');
            var durationUnitsLen = durationUnits.length;

            for (var i=0; i<durationUnitsLen; i++) {

                var durationUnit = durationUnits[i];
                console.log('testing duration unit', durationUnit);
                var unitValue = convert[durationUnit];
                if (unitValue > unformattedDuration) {
                    break;
                } else {
                    durationType = durationUnit;
                }
            }

            console.log('selected unit value is', durationType);
            set(this, 'selectedDurationType', durationType);

            var conversionOperand = get(this, 'convertDuration').get(durationType);
            var res = parseInt(unformattedDuration / conversionOperand);

            console.log(
                'conversion operand is', conversionOperand, 
                'unformattedDuration', unformattedDuration, 
                'conversionOperand', conversionOperand, 
                'res', res
            );

            if (isNone(res) || isNaN(res)) {
                res = 0;
            }
            set(this, 'shownDuration', res);
            console.debug('shown duration initialized to ', this.get('shownDuration') ,res);

            //initilizes content with computed value
            this.shownDurationChanged();
        },

        shownDurationChanged: function () {
            console.log('shownDurationChanged');
            var durationType = get(this, 'selectedDurationType');
            var conversionOperand = get(this, 'convertDuration').get(durationType);
            var value = get(this, 'shownDuration');

            var computedValue = parseInt(value * conversionOperand);
            if (isNaN(computedValue)) {
                computedValue = 0;
            }
            console.log('computed value in content is', computedValue);

            set(this, 'content', computedValue);
        }.observes('shownDuration'),

        selectedDurationTypeChanged: function () {
            var durationType = get(this, 'selectedDurationType');
            var conversionOperand = get(this, 'convertDuration').get(durationType);
            console.log('conversionOperand', durationType, conversionOperand, get(this, 'shownDuration'));

            var newValue = get(this, 'shownDuration') * conversionOperand;
            console.log('selectedDurationTypeChanged', durationType, conversionOperand, newValue);
            set(this, 'content', newValue);
        }.observes('selectedDurationType'),

        selectedDurationType: 'second',

        selectedDurationLabel: function () {
            console.log('selectedDurationType');
            var durationType = get(this, 'selectedDurationType');
            return get(this, 'field.' + durationType);
        }.property('selectedDurationType'),

        field: Ember.Object.create({
            'second' : __('Second'),
            'minute' :__('Minute'),
            'hour' : __('Hour'),
            'day' : __('Day'),
            'year' : __('Year')
        }),

        convertDuration: Ember.Object.create({
            'second' : 1,
            'minute' : 60,
            'hour' : 3600,
            'day' : 3600 * 24,
            'year' : 3600 * 24 * 12
        }),

        durationType: [
            'second',
            'minute',
            'hour',
            'day',
            'year'
        ]
    });

    Application.ComponentDurationcomboComponent = component;

    return component;
});
