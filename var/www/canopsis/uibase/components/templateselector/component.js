/*
# Copyright (c) 2014 "Capensis" [http://www.capensis.com]
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
    'app/application',
    'app/lib/templateregistry',
    'ember'
], function(Application, templates , Ember){

    var get = Ember.get,
        set = Ember.set;


    Application.ComponentTemplateselectorComponent = Ember.Component.extend({
        cssClass: "tooltiptable hint--rounded hint--top btn btn-",
        cssClassON : "success",
        cssClassOFF : "danger",

        templates: function(){
            var contentREF = this.get("content")|| [];
            var attr = this.get("attr");
            var value = this.get("attr.value") || [];

            var classToGet = this.templateData.keywords.controller.content.model.options.templateClass;
            if(classToGet !== undefined && templates.byClass[classToGet] !== undefined) {
                for (var i = 0, li = templates.byClass[classToGet].length; i < li; i++) {
                    this.addTemplate(templates.byClass[classToGet][i], value, contentREF);
                }
            }
            else{
                for (var j = 0, lj = templates.all.length; j < lj; j++) {
                    this.addTemplate(templates.all[j], value, contentREF);
                }
            }

            //Have to be done after
            this.set("attr.value" , value);
            this.set("value" , value);

            this.set("content" , contentREF);
            return contentREF;
        }.property(),

        /*
        *   Create template  {name, icon, CSSclass, label} (called by init) and push it on content
        */
        addTemplate : function(templat, value, contentREF) {
            var copyTemplate ={};

            for (var attribut in templat) {
                if (templat.hasOwnProperty(attribut)) {
                    copyTemplate[attribut] = templat[attribut];
                }
            }
            this.changeCssClass(copyTemplate, value);
            contentREF.push({ template: copyTemplate });
        },

        changeCssClass : function(template,value) {
            var CSSclassToUse =  (this.checkIfAContainB(value,template))? this.cssClassON : this.cssClassOFF;
            Ember.set(template, "CSSclass", this.cssClass+CSSclassToUse);
        },

        checkIfAContainB : function(value, template) {
            //add attribute to check
            return(value.contains(template.name));
        },

        /*
         *  modify template's CSSClass and value (called when button is pressed).
         */
        actions: {
            modify: function(template) {
                var value = this.get("value");
                var isPresent = this.checkIfAContainB(value,template);
                console.log("isPresent = ",isPresent, " value = ",value," and template =", template);

                if (!isPresent) {
                    value.pushObject(template.name);
                } else {
                    value.removeObject(template.name);
                }
                this.changeCssClass(template,value);
            }
        }
    });

    return Application.ComponentTemplateselectorComponent;
});

