/**
 * Copyright (c) 2015 "Capensis" [http://www.capensis.com]
 *
 * This file is part of Canopsis.
 *
 * Canopsis is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Canopsis is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Canopsis. If not, see <http://www.gnu.org/licenses/>.
 *
 * @module canopsis-frontend-core
 */

define([
    'ember',
    'app/lib/utils/hash'
], function(Ember, hashUtils) {

    /**
     * @class EditorView
     * @extends Ember.View
     * @constructor
     */
    var view = Ember.View.extend({
        /**
         * @property attrBinding
         */
        attrBinding: "templateData.keywords.attr.value",

        /**
         * @method init
         */
        init: function() {
            var id = utils.hash.generateId(this.templateName);
            this.elementId = id;
        }
    });

    loader.register('view:editor', view);

    return view;
});
