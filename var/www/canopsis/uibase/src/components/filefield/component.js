/*
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
 */

Ember.Application.initializer({
    name: 'component-filefield',
    initialize: function(container, application) {
        var isEmpty = Ember.isEmpty;

        /**
         * @class FileField
         *
         * @description
         * Subclass Ember.TextField to allow file uploading.
         */
        var component = Ember.TextField.extend(Ember.Evented, {
            type: 'file',
            attributeBindings: ['multiple'],
            multiple: false,
            change: function(e) {
                var input = e.target;

                if (!isEmpty (input.files)) {
                    this.send('onFileUpload', input.files);
                }
            }
        });

        application.register('component:component-filefield', component);
    }
});
