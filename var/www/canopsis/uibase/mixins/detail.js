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
    'jquery',
    'ember',
    'app/lib/formsregistry',
    'app/lib/factories/mixin',
    'app/lib/utils/hash'
], function($, Ember, formsregistry, Mixin, hash) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    var mixin = Mixin('detail', {

        partials: {
            columnsLine: ["actionbutton-foldable"],
            columnsHead: ["column-unfold"]
        },

        actions: {
            unfold: function(view) {
                var unfolded = get(view, 'unfolded');

                if (isNone(unfolded)) {
                    set(view, 'unfolded', true);
                }
                else {
                    set(view, 'unfolded', !unfolded);
                }
            }
        },

        init: function() {
            this._super.apply(this, arguments);

            var tmplId = hash.generateId('dynamic-listline-detail');
            set(this, 'detailTemplate', tmplId);
        },

        mixinsOptionsReady: function() {
            this._super.apply(this, arguments);

            var tmplId = get(this, 'detailTemplate'),
                tmpl = get(this, 'mixinOptions.detail.template');

            if (isNone(tmpl)) {
                tmpl = 'No template defined';
            }

            set(Ember.TEMPLATES, tmplId, Ember.Handlebars.compile(tmpl));
        },

        colspan: function() {
            var nb_columns = get(this, 'controller.shown_columns.length');
            var nb_extracolumns = get(this, 'controller._partials.columnsLine.length');
            var have_item_actions = get(this, 'controller._partials.itemactionbuttons');

            if (isNone(nb_columns)) {
                nb_columns = 0;
            }

            if (isNone(nb_extracolumns)) {
                nb_extracolumns = 0;
            }

            if (isNone(have_item_actions)) {
                have_item_actions = false;
            }

            have_item_actions = !!have_item_actions;

            /* checkbox */
            nb_columns++;

            /* columnsLine */
            nb_columns += nb_extracolumns;

            /* item actions */
            if (have_item_actions) {
                nb_columns++;
            }

            return nb_columns;
        }.property("controller.shown_columns")
    });


    return mixin;
});
