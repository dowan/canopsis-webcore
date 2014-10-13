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
    'app/lib/wrappers/dragtable'
], function(Ember, Application, dragtable) {

    var get = Ember.get,
        set = Ember.set;

    var mixin = Ember.Mixin.create({

        onDomReady: function (element) {

            this._super(arguments);

            console.debug('will add dragtable to the list');

            var listController = this;
            //column drag and drop management
            dragtable.makeDraggable(element[0], function (startColumn, stopColumn){
                var startIndex = startColumn - 1;
                var endIndex = stopColumn - 1;

                console.debug('permutation from list drag and drop -> start' ,startIndex, 'stop', endIndex);
                var columns = listController.get('displayed_columns');
                console.debug('showing selected columns', columns);

                var permutation = columns.splice(startIndex,1)[0];
                if (!Ember.isNone(permutation)) {
                    console.debug('permutation is', permutation);
                    console.debug('permutation is replaced between', columns[endIndex -1], 'and', columns[endIndex]);
                    console.debug(columns);
                    columns.splice(endIndex, 0, permutation);

                    console.debug('Will permute cols', columns[startIndex], 'and', columns[endIndex]);

                    set(listController, 'userParams.displayed_columns', columns);
                    listController.saveUserConfiguration();
                }
            });
        }


    });

    Application.Draggablecolumns = mixin;

    return mixin;
});
