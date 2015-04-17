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

/**
 * Component for choosing a color.
 * It let to choose between a colorpicker 
 * and a display of several ranges
 *
 * @module component
 * @return {component} colpick
 * @requires jquey
 * @requires ember
 * @requires app/lib/wrappers/colpick
 */
define([
    'jquery',
    'ember',
    'app/lib/wrappers/colpick',
], function($, Ember) {

    var get = Ember.get,
        set = Ember.set;

    var component = Ember.Component.extend({

        /**
         * instantiate component and load data
         * @method init
         */
        init: function() {
            this._super();

            set(this, 'store', DS.Store.create({
                container: this.get('container')
            }));
        },

        /**
         * set the chosen color and update css in function
         * @method didInsertElement
         */
        didInsertElement: function() {
            var component = this;

            var options = {
                flat:true,
                layout:'hex',
                submit:0,
                /**
                 * @method onChange
                 * @param hsb : not used
                 * @param {string} hexa code color
                 */
                onChange: function(hsb,hex) {
                    void(hsb);

                    set(component, 'value', '#' + hex);
                }
            };

            /**
             * set each colors selected attribute to false
             * set background-color of each div with color code 
             */
           this.get('store').findAll('rangecolor', {
            }).then(function(result) {
                var ranges = get(result, 'content');
                for (var i = ranges.length - 1; i >= 0; i--) {
                    var colors = get(ranges[i], 'colors');
                    for (var j = colors.length - 1; j >= 0; j--) {
                        var color = colors[j];
                        set(color, 'style', 'background-color:' + get(color, 'code'));
                        set(color, 'selected', false);
                    }
                }
                
                set(component, 'ranges', ranges);

            });

            var value = get(this, 'value');
            if(value) {
                options.color = value;
            }

            /**
             *switch display between colorPicker and colorGrid
             */
            component.$('.colorGrid').hide();
            component.$('#colorPicker').addClass('activeColor');

            component.$('#colorPicker').click(function() {
                component.$('.customcolor').show();
                component.$('#colorPicker').addClass('activeColor');
                component.$('.colorGrid').hide();
                component.$('#colorGrid').removeClass('activeColor');
            });

            component.$('#colorGrid').click(function() {
                component.$('.customcolor').hide();
                component.$('#colorPicker').removeClass('activeColor');
                component.$('.colorGrid').show();
                component.$('#colorGrid').addClass('activeColor');
            });

            component.$('.customcolor').colpick(options);

            this._super();
        },

        /**
         * action to update css for ranges and set the chosen color
         */
        actions: {
            changeColor: function(color, ranges){
                var component = this;
                var currentColor = color;
                var colorHex = currentColor.code;

                for (var i = ranges.length - 1; i >= 0; i--) {
                    var colors = get(ranges[i], 'colors');
                    for (var j = colors.length - 1; j >= 0; j--) {
                        color = colors[j];
                        set(color, 'selected', false);
                    }
                }

                set(currentColor, 'selected', true);
                set(component, 'value', colorHex);
                component.$('.customcolor').colpickSetColor(colorHex, true);
            }
        },

        willDestroyElement: function() {
            this._super();
        }
    });


    Ember.Application.initializer({
        name:"component-colpick",
        initialize: function(container, application) {
            application.register('component:component-colpick', component);
        }
    });

    return component;
});
