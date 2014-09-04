define([
	'app/application',
	'app/mixins/arraymixin',
	'app/components/multiselect/component'
], function(Application) {
	Application.ComponentTagsComponent = Ember.Component.extend(Application.ArrayMixin, {
		content: [],
		selection:[],
		contentREF:[],
		name : "",
		select:0,
		ArrayName:"",
		mixinName:"",
		//onInit :"";

		//Default 	: Called for feed content if no mixin is given
		//Needs 	: Application[ArrayName] must be defined earlier.
		//			: ArrayName must be defined on schema
		onInitBase: function( contentREF , _self , ArrayName ){
			Ember.assert('You Must pass a valid EntryArray Name on ComponentTags ( EntryArray should be defined on schema )', !Ember.isEmpty( ArrayName ));

			var EntryArray = Application[ ArrayName ];
			Ember.assert("Can't find  EntryArray or contentREF on ComponentTags",  EntryArray && contentREF );

			for ( var attribut in EntryArray ) {
				if ( EntryArray.hasOwnProperty( attribut ) ) {
					var Template = { name : attribut };
					contentREF.push(Template);
				}
			}
			var Template = { name : "from base (original) hello man" };
			contentREF.push(Template);
		},

		getAndApplyMixin:function( MixinName , _self ){
		//	var MixinName = this.get("MixinName");
			Ember.assert('You Must pass a valid _self on ComponentTags', !Ember.isEmpty( _self ));

			var initMixin ;
			if ( !Ember.isEmpty( MixinName ) ){
				initMixin = Application.SearchableMixin.all[ MixinName ];
				Ember.assert('no mixin found ', !Ember.isEmpty( initMixin ));

				initMixin.apply( _self );
				initMixin.detect(_self);
			}
		},

		// Feed content 	: items for list
		// Feed selections 	: already selected value
		// select 			: template for list item tags
		init: function() {
			var value = this.getValue();
			var contentREF = this.getContent();

			var attr = this.get("attr");
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

			var selection = this.get("selection");
			this.emptyArray( selection );

			//for each field on value  create object with :  name =  field and push them on selection
			//var valueLength = value.length;
			for (var i = 0 ; i < value.length ; i++) {
				Template = { name : value[i] };
				selection.push(Template);
			}

			this._super(true);
		},

		onUpdate: function() {
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
		}
	});
	return Application.ComponentTagsComponent;
});