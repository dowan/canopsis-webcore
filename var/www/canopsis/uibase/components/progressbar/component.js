  define([
  'jquery',
  'ember',
  'app/application'
], function($, Ember, Application) {

    var get = Ember.get,
        set = Ember.set;

    var component = Ember.Component.extend({

        style_bar: function(){
            var color = "background: " + get(this,"getcolor") + ";";
            return color + "width: " + get(this, "percent") + "%;";
        }.property("style_bar"),

        value: function(){
            return get(this, "value");
        }.property("value"),

        getcolor: function(){
            var background_color = get(this, "background_color");
            var warn_color = get(this, "warn_color");
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
        },

        getstatus: function(){
            var percent = get(this, "percent");
            if(percent > get(this, "crit_value")){
                return "critical";
            } else if(percent > get(this, "warn_value")){
                return "warning";
            } else {
                return "complete"
            }
        },
        
        textstatus:function(){
            return "(" + get(this, "getstatus") + ")";
        }.property("textstatus"),

        textpercent:function(){
            return "" + get(this, "percent") + "";
        }.property("textpercent"),

        percent:function(){
            var value = get(this, "value") - get(this, "min_value");
            var max = get(this, "max_value") - get(this, "min_value");
            var percent =  Math.ceil(value/max * 100);
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
