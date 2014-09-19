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
    'ember',
    'app/application',
    'app/mixins/arraymixin',
    'app/view/crecords'
], function(Ember, Application) {


    Application.ArrayToCollectionControlView = Ember.CollectionView.extend({
        cssClass: "tooltiptable hint--rounded hint--top btn btn-",
        cssClassON : "success",
        cssClassOFF : "danger",

        itemViewClass: Ember.View.extend({
            tagName: '',
            template: Ember.Handlebars.compile(" <button  data-hint={{ unbound template.label}} {{action 'modify' template target='view.parentView' }} {{bind-attr class='template.CSSclass'}}  > {{glyphicon template.icon}}   </button> ")
        }),

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
    return Application.ArrayToControlView;

});
