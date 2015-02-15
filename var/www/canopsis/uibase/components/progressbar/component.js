define([
  'ember',
  'circliful',
  'app/application'
], function($, Ember, Application) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    var component = Ember.Component.extend({

        init: function(){
            this._super();
        },

        label: function(){
            if(get(this,"label_display")){
                return get(this,"label");
            }
            return "";
        }.property("label"),
        
        style_label: function(){
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
                return "width: " + width + unit + ";";
            }
            return "display: none;";
        }.property("style_label"),

        style_bar: function(){
            var color = "background: " + get(this,"get_color") + ";";
            return color + "width: " + get(this, "percent") + "%;";
        }.property("style_bar"),

        get_color: function(){
            var background_color = get(this, "bg_color");
            var warn_color = get(this, "warning_color");
            var critic_color = get(this, "critic_color");
            var valstatus = get(this, "get_status");
            switch(valstatus){
                case 2:
                    return critic_color;
                    break;
                case 1:
                    return warn_color;
                    break;
                default:
                    return background_color;
                    break;
            }
        }.property("getcolor"),

        get_status: function(){
            var unit_or_percent = get(this, "unit_or_percent");
            var percent = get(this, "percent");
            var value = get(this, "value");
            if(unit_or_percent){
                var compared = value;
            } else {
                var compared = percent;
            }
            if(compared >= get(this, "crit_value")){
                return 2;
            } else if(compared >= get(this, "warn_value")){
                return 1;
            } else {
                return 0;
            }
        }.property("getstatus"),
       
        text_status:function(){
            return "(" + get(this, "get_status") + ")";
        }.property("text_status"),

        text_percent:function(){
            if(get(this, "show_value")){
                return "" + get(this, "percent") + "%";
            }
            return "";
        }.property("text_percent"),

        percent:function(){
            var min = parseFloat(get(this, "min_value"));
            var value = parseFloat(get(this, "value"));
            var new_val = value - min;
            var max = parseFloat(get(this, "max_value"));
            var new_max = max - min;
            var percent =  Math.ceil(new_val/new_max * 100);
            if(isNaN(percent)){
                percent = 0;
            }
            return percent;
        }.property("percent")

    });

    Ember.Application.initializer({
        name:"component-progressbar",
        initialize: function(container, application) {
            application.register('component:component-progressbar', component);
        }
    });

    return component;
});
