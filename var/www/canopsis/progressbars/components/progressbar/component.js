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
  'jquery',
  'ember',
  'circliful',
  'app/application'
], function(jQuery, Ember, Circliful, Application) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    var component = Ember.Component.extend({

        classNames: ['progress'],

        thickness: 10,
        height: 10,

        style_span: function() {
            var res,
                showValueLabel = get(this, 'showValueLabel'),
                labelColor = get(this, 'labelColor');

            if(!showValueLabel){
                res = "display: none;";
            } else {
                if(isNone(labelColor)){
                    res = "color: #000000;";
                } else {
                    res = "color: " + labelColor + ";";
                }
            }

            return res;
        }.property('showValueLabel', 'labelColor'),

        style_bar: function() {
            var bg_color = get(this, 'bg_color'),
                percent = get(this, 'percent'),
                color = 'background: ' + bg_color + ';';

            return color + 'width: ' + percent + '%;';
        }.property('bg_color', 'percent'),

        percent: function () {
            var value = get(this, 'value'),
                min = get(this, 'min_value'),
                max = get(this, 'max_value');

            if(isNaN(value)){
                return 0;
            }
            if(isNaN(min)){
                min = 0;
            }
            if(value === max){
                if(value === 0){
                    return 0;
                }
                return 100;
            }
            var new_val = value - min;
            if(isNaN(max)){
                max = value;
            }
            var new_max = max - min;
            var percent =  Math.ceil(new_val/new_max * 100);
            if(isNaN(percent)){
                percent = 0;
            }
            return percent;

        }.property('value', 'min_value', 'max_value')
    });

    Ember.Application.initializer({
        name:'component-progressbar',
        initialize: function(container, application) {
            application.register('component:component-progressbar', component);
        }
    });

    return component;
});
