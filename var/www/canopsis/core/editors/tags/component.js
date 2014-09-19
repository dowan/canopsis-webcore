define([
    'app/application',
    'app/mixins/arraymixin',
    'app/lib/mixinsmanager',
    'app/components/multiselect/component'
], function(Application , Arraymixin, mixinsmanager) {

    var component = Ember.Component.extend({
        contentREF:[],
        name : "",
        select:0,
        ArrayName:"",
        mixinName:"",

        //onInit :"";

        //Default     : Called for feed content if no mixin is given
        //Needs     : Application[ArrayName] must be defined earlier.
        //            : ArrayName must be defined on schema
        onInitBase: function( contentREF , _self , ArrayName ){
            Ember.assert('You Must pass a valid EntryArray Name on ComponentTags ( EntryArray should be defined on schema )', !Ember.isEmpty( ArrayName ));

            var EntryArray = Application[ ArrayName ];
            Ember.assert("Can't find  EntryArray or contentREF on ComponentTags",  EntryArray && contentREF );

            var template;
            for ( var attribut in EntryArray ) {
                if ( EntryArray.hasOwnProperty( attribut ) ) {

                    template = { name : attribut };

                    contentREF.push(template);
                }
            }

            template = { name : "from base (original) hello man" };
            contentREF.push(template);
        },

        getAndApplyMixin:function( MixinName , _self ){
        //    var MixinName = this.get("MixinName");
            Ember.assert('You Must pass a valid _self on ComponentTags', !Ember.isEmpty( _self ));

            var initMixin ;
            if ( !Ember.isEmpty( MixinName ) ){
                initMixin = mixinsmanager.all[ MixinName ];
                Ember.assert('no mixin found ', !Ember.isEmpty( initMixin ));

                initMixin.apply( _self );
                initMixin.detect(_self);
            }
        },

        // Feed content     : items for list
        // Feed selections     : already selected value
        // select             : template for list item tags
        init: function() {
           // var contentREF = this.getContent();
           var contentREF = this.get("content") || [];
            this.set("content" , contentREF );

            var attr = this.get("attr");
            var value = this.get("attr.value") || [];

            //var select = this.get("select");
            //select = ( select )? select : 0;

            // select template for list item tags
            //this.set("select", select );

            var MixinName = this.get("mixinName");
            this.getAndApplyMixin( MixinName , this );

            // if mixin added : use it for feed content
            // else use default one
            var ToCallForInit = ( this.onInit )? this.onInit : this.onInitBase;
            ToCallForInit( contentREF , this , this.get("ArrayName") );

            var selection = [];

            this.set("attr.value" , value );
            this._super(true);
        },

        onUpdate: function() {
            /*
            var formController  =  Canopsis.formwrapperController.form;
            var selection = this.get("value");
            var value = [];
            if (selection) {
                for (var i = 0 ; i < selection.length ; i++) {
                    value.push(selection[i].name);
                }
                var field = this.get("attr.field");
                if (field){
                    var attribut = "formContext." + field;
                    Ember.set(formController , attribut , value);
                }
            }
            else{
                console.warn("selection isn't defined on tags/view.js");
            }
*/
        }
    });

    Application.ComponentTagsComponent = component;

    return component;
});
