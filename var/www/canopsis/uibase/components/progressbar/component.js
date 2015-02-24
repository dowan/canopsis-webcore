define([
  'ember',
  'circliful',
  'app/application'
], function(Ember, Circliful, Application) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    var component = Ember.Component.extend({

        init: function(){

            this._super();

            var display_as = get(this,"display_as");
            if(isNone(display_as)){
                display_as = "progressbar";
            }
            if(display_as == "progressbar"){
                set(this, "is_progressbar", true);
                if(isNone(get(this,"pb_thickness"))){
                    set(this, "thickness", 10);
                    set(this, "height", 10);
                } else {
                    set(this, "thickness", get(this,"pb_thickness") );
                    set(this, "height", get(this,"pb_thickness") );
                }

            } else {
                set(this, "is_gauge", true);
                set(this, "style_content", "float:left;");
                if(display_as == "halfgauge"){
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
            }
            this.addObserver('value', this.onValueChange);
        },

        didInsertElement: function(){
            jQuery('#' + get(this,"id")).circliful();
        },
       
        onValueChange: function(){
            this.getPercent();
            this.updateValues();
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
       
        updateValues: function(){
            this.getStyleLabel();
            this.getColor();
            this.getStatus();
            this.textStatus();
            this.textPercent();
            if(get(this, "display_as")=="progressbar"){
                this.getStyleBar();
            } else {
                this.getStyleGauge();
            }
        },

        getStyleLabel: function(){
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

        getStyleBar: function(){
            var id = get(this, "id_bar");
            var height = "height: " + get(this, "thickness") + "px;";
            var color = "background: " + this.getColor() + ";";
            var result =  color + "width: " + get(this, "percent") + "%;";
            jQuery("#" + id).attr("style", result);
            jQuery("#" + id).parent().attr("style", height);
        },

        getStyleGauge: function(){
            var id = get(this, "id");
            var result = "width: " + get(this, "width") + "px; height: " + get(this, "height") + "px;";
            jQuery("#" + id).attr("style", result);
        },

        getColor: function(){
            var background_color = get(this, "bg_color");
            var warn_color = get(this, "warning_color");
            var critic_color = get(this, "critic_color");
            var valstatus = this.getStatus();
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

        getStatus: function(){
            var unit_or_percent = get(this, "unit_or_percent");
            var percent = this.getPercent();
            var value = get(this, "value");
            if(unit_or_percent){
                var compared = value;
            } else {
                var compared = percent;
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
       
        textStatus: function(){
            var result = "(" + get(this, "get_status") + ")";
            set(this, "text_status", result);
        },

        textPercent: function(){
            if(get(this, "show_value")){
                var result = "" + get(this, "percent") + "%";
            } else {
                var result = "";
            }
            set(this, "text_percent", result);
        },

        getPercent: function(){
            //var min = parseFloat(get(this, "min_value"));
            var min = 0;
            var value = parseFloat(get(this, "value"));
            var new_val = value - min;
            var max = parseFloat(get(this, "max_value"));
            var new_max = max - min;
            var percent =  Math.ceil(new_val/new_max * 100);
            if(isNaN(percent)){
                percent = 0;
            }
            set(this, "percent", percent);
        },

        numPercent: function(){
            this.getPercent();
            var percent = get(this, "percent");
            percent += ''
            return percent;
        }.property()
    });

    Ember.Application.initializer({
        name:"component-progressbar",
        initialize: function(container, application) {
            application.register('component:component-progressbar', component);
        }
    });

    return component;
});

