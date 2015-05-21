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
    'jquery',
    'ember',
    'app/lib/wrappers/colpick',
], function($, Ember) {

    var get = Ember.get,
        set = Ember.set;

        /**
         * Component for choosing a color.
         * It let to choose between a colorpicker 
         * and a display of several ranges
         *
         * @class Colpick
         * @static
         */

    var component = Ember.Component.extend({
        classNames: ['colorSelector dropdown-toggle'],
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

            component.$().parents('td').css('overflow-x', 'visible').css('overflow-y', 'visible');

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

            /*
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
                        var style = 'background-color:' + color;
                        var selected = false;
                        var colorCode = color;

                        colors[j] = {
                            style: style,
                            selected: selected,
                            code: colorCode
                        };
                    }
                }
                
                set(component, 'ranges', ranges);

            });

            var value = get(this, 'value');
            if(value) {
                options.color = value;
            }

            /*
             * close the dropdownbutton
             */
             component.$('.closeDropdown').click(function(){
               
             });

            /*
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
         * @method changeColor : action to update css for ranges and set the chosen color
         * @param {object} color
         * @param {object} range
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

        /**
         * @method willDestroyElement
         */
        willDestroyElement: function() {
            this._super();
            this.$().off('click');
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
