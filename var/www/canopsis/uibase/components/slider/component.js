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
    'ember',
    'jqueryui'
], function(Ember) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone,
        __ = Ember.String.loc;


    var component = Ember.Component.extend({

        init: function() {
            this._super();

        },

        didInsertElement: function (){

            var sliderComponent = this;

            var options = get(this, 'options');
            var min = get(options, 'min') || 0;
            var max = get(options, 'max') || 100;
            var step = get(options, 'step') || 1;

            var value = parseInt(get(sliderComponent, 'content'));
            if (isNone(value) || isNaN(value)) {
                value = get(options, 'default') || min;
            }

            console.log('slider options', {
                min: min,
                max: max,
                step: step,
                value: value
            });

            sliderComponent.$('.slider').slider({
                min: min,
                max: max,
                step: step,
                value: value,
                slide: function (event, ui) {
                    console.log('slider change', ui.value, event, ui);
                    set(sliderComponent, 'content', ui.value);
                }
            });
        }

    });

    Ember.Application.initializer({
        name:"component-slider",
        initialize: function(container, application) {
            application.register('component:component-slider', component);
        }
    });

    return component;
});
