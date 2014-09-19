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
    'app/lib/loaders/templates',
    'app/view/arraytocollectioncontrol'
], function(Application, templates) {
    Application.TemplateView = Application.ArrayToCollectionControlView.extend({
        //cssClass: "btn-items-",
        init: function() {
            var contentREF = this.get("content")|| [];
            var attr = this.get("attr");
            var value = this.get("attr.value") || [];

            var classToGet = this.templateData.keywords.controller.content.model.options.templateClass;
            if(classToGet !== undefined) {
                for (var i=0 ; i < templates.byClass[classToGet].length ; i++) {
                    this.addTemplate(templates.byClass[classToGet][i], value, contentREF);
                }
            }
            else{
                for (var i=0 ; i < templates.all.length ; i++) {
                    this.addTemplate(templates.all[i], value, contentREF);
                }
            }

            //Have to be done after
            this.set("attr.value" , value);
            this.set("value" , value);

            this.set("content" , contentREF);
            this._super(true);
        }
    });
    return Application.TemplateView;
});
