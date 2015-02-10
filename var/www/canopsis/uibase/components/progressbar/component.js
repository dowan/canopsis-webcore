define([
  'jquery',
  'ember',
  'app/application'
], function($, Ember, Application) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    var component = Ember.Component.extend({

        value : null,
        min_value : null,
        max_value : null,

        init: function(){

            this._super();

        },

        label: function(){
            return "LABEL";
        }.property("label"),
        
        width_label: function(){
            return "width: 0%;";
        }.property("width_label"),

        style_bar: function(){
            var color = "background: " + get(this,"getcolor") + ";";
            return color + "width: " + get(this, "percent") + "%;";
        }.property("style_bar"),

        getcolor: function(){
            var background_color = get(this, "bg_color");
            var warn_color = get(this, "warning_color");
            var critic_color = get(this, "critic_color");
            var valstatus = get(this, "getstatus");
            switch(valstatus){
                case "critical":
                    return critic_color;
                    break;
                case "warning":
                    return warn_color;
                    break;
                default:
                    return background_color;
                    break;
            }
        }.property("getcolor"),

        getstatus: function(){
            var unit_or_percent = get(this, "unit_or_percent");
            var percent = get(this, "percent");
            var value = get(this, "value");
            if(unit_or_percent){
                var compared = value;
            } else {
                var compared = percent;
            }
            if(compared > get(this, "crit_value")){
                return "critical";
            } else if(compared > get(this, "warn_value")){
                return "warning";
            } else {
                return "complete"
            }
        }.property("getstatus"),
       
        textstatus:function(){
            return "(" + get(this, "getstatus") + ")";
        }.property("textstatus"),

        textpercent:function(){
            return "" + get(this, "percent") + "%";
        }.property("textpercent"),

        percent:function(){
            var min = parseFloat(get(this, "min_value"));
            var value = parseFloat(get(this, "value"));
            var new_val = value - min;
            var max = parseFloat(get(this, "max_value"));
            var new_max = max - min;
            var percent =  Math.ceil(new_val/new_max * 100);
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
