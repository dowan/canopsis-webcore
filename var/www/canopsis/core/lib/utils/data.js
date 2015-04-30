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

define(['app/application'], function(Application) {

    /**
     * @class dataUtils
     * @static
     *
     * Utility class to manage data, whether they are related or not to Ember Data
     */
    var dataUtils = {

        /**
         * @method getStore
         * @return {store} the application store
         *
         * Get the main application store
         */
        getStore: function() {
            console.warn("this should not be used as there is not only one store in Canopsis. This might lead to unexpected behaviour");
            return Application.__container__.lookup('store:main');
        },

        /**
         * @method addRecordToRelationship
         */
        addRecordToRelationship: function(record, parentElement, relationshipKey, cardinality) {
            console.log('addRecordToRelationship', arguments);
            if (cardinality === "hasMany") {
                console.log("addRecordToRelationship hasMany", relationshipKey, arguments, parentElement);
                parentElement.get(relationshipKey).pushObject(record);
            } else if (cardinality === "belongsTo") {
                console.log("addRecordToRelationship belongsTo", relationshipKey, arguments, parentElement);
                parentElement.set(relationshipKey, record);
            }
        },

        /**
         * @method download
         * @param {string} content the file content
         * @param {string} filename the file name
         * @param {string} contentType the file content type
         *
         * Automatically download content as a file
         */
        download: function (content, filename, contentType) {
            if(!contentType) contentType = 'application/octet-stream';
                var a = document.createElement('a');
                var blob = new Blob([content], {'type':contentType});
                a.href = window.URL.createObjectURL(blob);
                a.download = filename;
                a.click();
        }
    };

    return dataUtils;
});
