  define([
  'jquery',
  'ember',
  'app/application'
], function($, Ember, Application) {

    Application.ComponentProgressbarComponent = Ember.Component.extend({
        classNames: 'progress',

        getPercent:Ember.computed(function() {
        var value = this.get('value');
        var max = this.get('max');
        var percent = value/max * 100;
        return percent;
    }).property('value'),

    init:function(){
        debugger;
        this._super();
        //this.set("value" , 33);
    },

    width_test: function(){
        debugger;
        return "width: " + this.get("percent_test") + "%";
    }.property("percent_test"),

    valuenow:function(){
        var value = this.get("value");
        return value;
    }.property("value"),

    valuemax:function(){
        return 100;
    }.property(),

    valuemin:function(){
        return 0;
    }.property(),

    percent_test:function(){
        debugger;
        var value = this.get("valuenow");
        var max = this.get("valuemax");

        var percent =  Math.ceil(value/max * 100);
        return percent;
    }.property("valuemax", "valuenow"),


    statusClass: function(){
        debugger;
        var warn = 50//attr.get('warn') || 50;
        var crit = 75//attr.get('crit') || 75;
        var result = 'progress-bar progress-bar-';

        var percent = this.get("percent_test");
        var widthStyle  = "style='width: %@%;'".fmt(percent);
        var bad_when_full = this.get("bad_when_full");

        if(bad_when_full){
            if(percent > crit)
              statusClass = "danger";
            else if(percent > warn)
              statusClass = "warning";
            else
              statusClass = "success";
        }
        else{
            if (percent < crit)
              statusClass = "danger";
            else if(percent < warn)
              statusClass = "warning";
            else
              statusClass = "success";
        }
        return result+statusClass;

    }.property("percent_test","bad_when_full"),

    statusClassWillChange: Ember.beforeObserver(function() {
        this.$('.bar').removeClass(this.get('statusClass'));
    }, 'statusClass'),

    statusClassDidChange: Ember.observer(function() {
        this.$('.bar').addClass(this.get('statusClass'));
    }, 'statusClass')
  })
  return  Application.ComponentProgressbarComponent;
})