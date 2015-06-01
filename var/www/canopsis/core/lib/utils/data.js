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

define(['app/application', 'app/lib/utilityclass'], function(Application, Utility) {

    var _loggedUserController;

    var dataUtils = Utility.create({

        name: 'data',

        getLoggedUserController: function() {
            return _loggedUserController;
        },

        setLoggedUserController: function(loggedUserController) {
            _loggedUserController = loggedUserController;
        },

        getStore: function() {
            console.warn("this should not be used as there is not only one store in Canopsis. This might lead to unexpected behaviour");
            return Application.__container__.lookup('store:main');
        },

        //TODO change parentElement term to something more descriptive
        addRecordToRelationship: function(record, parentElement, relationshipKey, cardinality) {
            console.log('addRecordToRelationship', arguments);
            if (cardinality === "hasMany") {
                console.log("addRecordToRelationship hasMany", relationshipKey, arguments, parentElement);
                parentElement.get(relationshipKey).pushObject(record);
            } else if (cardinality === "belongsTo") {
                console.log("addRecordToRelationship belongsTo", relationshipKey, arguments, parentElement);
                parentElement.set(relationshipKey, record);
            }
        }
    });

    return dataUtils;
});
