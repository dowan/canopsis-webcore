  define([
  'jquery',
  'ember',
  'app/application'
], function($, Ember, Application) {

    var get = Ember.get,
        set = Ember.set;

    var component = Ember.Component.extend({

        style_bar: function(){
            var color = "background: " + this.getcolor() + ";";
            return color + "width: " + this.get("percent") + "%;";
        }.property("style_bar"),

        getcolor: function(){
            var background_color = this.get("background_color");
            var warn_color = this.get("warn_color");
            var critic_color = this.get("critic_color");
            var valstatus = this.getstatus();
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
            var percent = this.get("percent");
            if(percent > this.get("crit_value")){
                return "critical";
            } else if(percent > this.get("warn_value")){
                return "warning";
            } else {
                return "complete"
            }
        },
        
        textstatus:function(){
            return "(" + this.getstatus() + ")";
        }.property("textstatus"),

        textpercent:function(){
            return "" + ""/*str(this.percent())*/ + "";
        }.property("textpercent"),

        percent:function(){
            var value = this.get("value") - this.get("min_value");
            var max = this.get("max_value") - this.get("min_value");
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
