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
    'circliful',
], function(jQuery, Ember, Circliful) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;


    var component = Ember.Component.extend({

        init: function(){

            this._super();

            var display_as = get(this, 'display_as');

            set(this, "style_content", "float:left;");
            if(display_as === "halfgauge"){
                set(this, "type", "half");
            } else {
                set(this, "type", "full");
            }

            if(isNone(get(this,"gg_thickness"))){
                set(this, "thickness", 10);
            } else {
                set(this, "thickness", get(this,"pb_thickness") );
            }

            if(isNone(get(this,"gg_width"))){
                set(this, "width", 250);
            } else {
                set(this, "width", get(this,"gg_width") );
            }

            if( get(this, "type") == "half" ){
                set(this, "height", parseInt(get(this, "width")) / 2);
            } else {
                set(this, "height", get(this, "width"));
            }
            if(isNone(get(this,"gg_fill"))){
                set(this, "gg_fill", "#ffffff");
            }
            if(isNone(get(this,"gg_border"))){
                set(this, "gg_border", "#cccccc");
            }
        },

        didInsertElement: function(){
            this.onValueChange();
            jQuery('#' + get(this,"id")).circliful();
        },

        onValueChange: function(){
            this.gettStyleLabel();
            //this.gettColor();
            this.gettStatus();
            this.texttStatus();
            this.texttPercent();
            this.gettStyleSpan();
            if(get(this, "display_as")=="progressbar"){
                this.gettStyleBar();
            } else {
                this.gettStyleGauge();
            }
        },

        id: function(){
            return "gauge_" + get(this,"label").replace(/\W+/g, "");
        }.property(),

        id_bar: function(){
            return "bar_" + get(this,"label").replace(/\W+/g, "");
        }.property(),

        label: function(){
            if(get(this,"label_display")){
                return get(this,"label");
            }
            return "";
        }.property(),

        gettStyleLabel: function(){
            if(get(this,"label_display")){
                if(isNone(get(this, "label_width"))){
                    width = 0;
                } else {
                    width = get(this, "label_width");
                }
                if(isNone(get(this, "label_unit"))){
                    unit = "%";
                } else {
                    unit = get(this, "label_unit");
                }
                var padding = "";
                padding = "padding-top: " + parseInt(parseInt(get(this, "height") - 14) / 2) + "px; ";
                var result = "width: " + width + unit + ";" + padding;
            } else {
                var result = "display: none;";
            }
            set(this, "style_label", result);
        },

        gettStyleSpan: function(){
            if(get(this, "value_in_column")){
                result = "display: none;";
            } else {
                if(isNone(get(this, "value_color"))){
                    result = "color: #000000;"
                } else {
                    result = "color: " + get(this, "value_color") + ";";
                }
            }
            set(this, "style_span", result);
        },

        gettStyleBar: function(){
            var id = get(this, "id_bar");
            var height = "height: " + get(this, "thickness") + "px;";
            var color = "background: " + this.gettColor() + ";";
            var result =  color + "width: " + get(this, "percent") + "%;";
            set(this, "style_bar", result);
        },

        gettStyleGauge: function(){
            var id = get(this, "id");
            var result = "width: " + get(this, "width") + "px; height: " + get(this, "height") + "px;";
            set(this, "style_gauge", result);
            var color = "background: " + this.gettColor() + ";";
            jQuery('#' + get(this,"id")).attr("data-fgcolor", this.gettColor());
        },

        gettColor: function(){
            var background_color = get(this, "bg_color");
            var warn_color = get(this, "warning_color");
            var critic_color = get(this, "critic_color");
            var valstatus = this.gettStatus();
            switch(valstatus){
                case 2:
                    var result = critic_color;
                    break;
                case 1:
                    var result = warn_color;
                    break;
                default:
                    var result = background_color;
                    break;
            }
            return result;
        },

        gettStatus: function(){
            var unit_or_percent = get(this, "unit_or_percent");
            var value = get(this, "value");
            if(unit_or_percent){
                var compared = value;
            } else {
                var compared = get(this, "percent");
            }
            if(compared >= get(this, "crit_value")){
                var result = 2;
            } else if(compared >= get(this, "warn_value")){
                var result = 1;
            } else {
                var result = 0;
            }
            return result;
        },

        texttStatus: function(){
            var result = "(" + get(this, "get_status") + ")";
            set(this, "text_status", result);
        },

        texttPercent: function(){
            var unit_or_percent = get(this, "unit_or_percent");
            if(get(this, "show_value")){
                if(unit_or_percent){
                    var result = "" + get(this, "value") + get(this, "unit");
                } else {
                    var result = "" + get(this, "percent") + "%";
                }
            } else {
                var result = "";
            }
            set(this, "text_percent", result);
        }

    });

    Ember.Application.initializer({
        name:"component-circularprogressbar",
        initialize: function(container, application) {
            application.register('component:component-circularprogressbar', component);
        }
    });

    return component;
});
