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

        init:function () {
            this._super();
            console.log('draggable mixin ready');
        },


        didInsertElement: function() {

            var table = this.$('table');

            console.debug('will add dragtable to the list', table);

            var controller = get(this, 'controller');
            var view = this;

            //column drag and drop management
            dragtable.makeDraggable(table[0], function (startColumn, stopColumn){

                //compute permutation from plugin given information
                var startIndex = startColumn - 1;
                var endIndex = stopColumn - 1;

                var columns = view.getColumns();
                console.debug('columns before drag', columns);

                var permutation = columns.splice(startIndex,1)[0];

                //exchange dragged column place in model as it is done in the view.
                if (!Ember.isNone(permutation)) {
                    console.debug('permutation is', permutation);
                    console.debug('permutation is replaced between', columns[endIndex -1], 'and', columns[endIndex]);
                    columns.splice(endIndex, 0, permutation);

                    console.debug('columns after drag', columns);

                    //Synchornize view and model
                    set(controller, 'userParams.displayed_columns', columns);
                    set(controller, 'displayed_columns', columns);

                    controller.saveUserConfiguration();
                }
            });
            this._super();

        },

        getColumns: function() {
            //find better column order depending on available information source.
            var columns = get(this,'controller.displayed_columns');
            if (Ember.isNone(columns)) {
                var shown_columns = get(this, 'controller.shown_columns');
                console.debug('using shown_columns property', shown_columns);
                columns = [];
                for (var i=0; i<shown_columns.length; i++) {
                    columns.push(get(shown_columns[i], 'field'));
                }
            } else {
                console.debug('using displayed_columns property');
            }
            return columns;
        }


    });

    Application.DraggablecolumnsMixin = mixin;

    return mixin;
});
