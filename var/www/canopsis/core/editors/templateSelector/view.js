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
    var get = Ember.get,
        set = Ember.set;

    var view = Application.ArrayToCollectionControlView.extend({
        //cssClass: "btn-items-",
        init: function() {
            var contentREF = this.get("content")|| [];
            var attr = this.get("attr");
            var value = this.get("attr.value") || [];

            var classToGet = this.templateData.keywords.controller.content.model.options.templateClass;

            if(classToGet !== undefined) {
                for (var i = 0, l1 = templates.byClass[classToGet].length ; i < l1 ; i++) {
                    this.addTemplate(templates.byClass[classToGet][i], value, contentREF);
                }
            } else{
                for (var j = 0, l2 = templates.all.length; j < l2 ; j++) {
                    this.addTemplate(templates.all[j], value, contentREF);
                }
            }

            //Have to be done after
            set(this, "attr.value" , value);
            set(this, "value" , value);

            set(this, "content" , contentREF);
            this._super(true);
        }
    });

    Application.TemplateView = view;

    return view;
});
