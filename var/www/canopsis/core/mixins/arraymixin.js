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
    'ember',
    'app/lib/formsregistry',
    'app/lib/factories/mixin'
], function(Ember, formsregistry, Mixin) {

    var get = Ember.get,
        set = set;

    var mixin = Mixin('array', {
        cssClass: "tooltiptable hint--rounded hint--top btn btn-",
        cssClassON : "success",
        cssClassOFF : "danger",

        valueRef: "",
        value: "",
        // WARNING : MUST be redefined on child if valueRef is not set ( from template )
        valueRefPath:"valueRef",
        valuePath:"value",
        // redifine content on subclass or intsance will share the same content array:
        /* From Mixin Doc :
        Note that mixins extend a constructor's prototype so arrays and object literals
        defined as properties will be shared amongst objects that implement the mixin.
        If you want to define a property in a mixin that is not shared, you can define
        it either as a computed property or have it be created on initialization of the object.
        */

        /*
         * Create an array of template in order to feed collectionView's content (Must be redefined on child)
         */
        init : function(redefined) {

            set(this, 'content', []);

            if (redefined!== true) {
                console.warn("you must redefine init (ArrayMixin)");
            }
            this._super();
        },

        emptyArray :function( ArrayToEmpty ){
            if ( ArrayToEmpty ) {
                while ( ArrayToEmpty.length > 0 ) {
                    ArrayToEmpty.pop();
                }
            }
        },

        getValue: function() {
            var value = get(this, get(this, "valuePath"));
            var valueRef = get(this, get(this, "valueRefPath"));

            console.log("valueRef", valueRef);
            if (valueRef === undefined) {
                valueRef = [];
            }
            value = valueRef.slice(0);
            set(this, this.get("valuePath"),value);

            return value;
        },

        /*
         *  Get and Reset content .
         */
        getContent: function() {
            var  contentREF = get(this, "content");
            // WARNING : clear content and content must be an array
            while(contentREF.length > 0) {
                contentREF.pop();
            }

            return contentREF;
        },

        /*
         *   Create template  {name, icon, CSSclass, label} (called by init) and push it on content
         */
        addTemplate : function(templat, value, contentREF) {
            var copyTemplate = [];

            for (var attribut in templat) {
                if (templat.hasOwnProperty(attribut)) {
                    copyTemplate[attribut] = templat[attribut];
                }
            }
            this.changeCssClass(copyTemplate, value);
            contentREF.push({ template: copyTemplate });
        },

        registerFieldWithController: function() {
            var formController  =  get(formsregistry, 'formwrapper.form');
            if (formController) {
                var ArrayFields = get(formController, 'ArrayFields');
                if (ArrayFields) {
                    ArrayFields.pushObject(this);
                }
            }
        }.on('didInsertElement'),

        changeCssClass : function(template,value) {
            var CSSclassToUse =  (this.checkIfAContainB(value,template))? this.cssClassON : this.cssClassOFF;
            set(template, "CSSclass", this.cssClass + CSSclassToUse);
        },

        checkIfAContainB : function(value, template) {
            //add attribute to check
            return(value.contains(template.name));
        },

        //Called by controller when submit
        onUpdate: function() {
            var formController = get(formsregistry, 'formwrapper.form');
            var value = get(this, get(this, "valuePath"));
            var field;
            if ( this.attr )
                field = get(this, 'attr.field') ;
            else if (this.content) {
                field = get(this, 'content.field') ;
            }
            if (field){
                var attribut = "formContext." + field;
                set(formController , attribut , value);
                set(this, get(this, "valueRefPath"), value);
            }
            else{
                console.warn("content.field isn't defined ");
            }
        }
    });

    return mixin;
});
