define([
    'app/application',
    'app/mixins/arraymixin',
    'app/lib/mixinsregistry',
    'app/lib/formsregistry',
    'canopsis/uibase/components/multiselect/component'
], function(Application , Arraymixin, mixinsregistry, formsregistry) {

    var get = Ember.get,
        set = Ember.set;


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
                initMixin = mixinsregistry.all[ MixinName ];
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
           var contentREF = get(this, "content") || [];
            set(this, "content" , contentREF );

            var attr = get(this, "attr");
            var value = get(this, "attr.value") || [];

            //var select = this.get("select");
            //select = ( select )? select : 0;

            // select template for list item tags
            //this.set("select", select );

            var MixinName = get(this, "mixinName");
            this.getAndApplyMixin( MixinName , this );

            // if mixin added : use it for feed content
            // else use default one
            var ToCallForInit = ( this.onInit )? this.onInit : this.onInitBase;
            ToCallForInit( contentREF , this , this.get("ArrayName") );

            var selection = [];

            set(this, "attr.value" , value );
            this._super(true);
        }
    });

    Ember.Application.initializer({
        name:"component-tagsselector",
        initialize: function(container, application) {
            application.register('component:component-tagsselector', component);
        }
    });

    return component;
});
