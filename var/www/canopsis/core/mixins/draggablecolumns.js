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
    'app/lib/factories/mixin',
    'jquery',
    'jqueryui'
], function(Ember, Mixin) {

    var get = Ember.get,
        set = Ember.set;


    var mixin = Mixin('draggablecolumns', {

        init:function () {
            this._super();
            console.log('draggable mixin ready');
        },


        didInsertElement: function() {

            var view = this;
            var table = $('table', this.$());
            var tableId  = $(table).attr('id');
            console.log('table id', tableId);

            // let the gallery items be draggable
            $('th', table).draggable({
                revert: "invalid",
                containment: "document",
                cursor: "move"
            });

            console.log('droppables ', $('th', table));
            $('th', table).droppable({
                accept: '#' + tableId + ' th',
                activeClass: 'emphasis',
                drop: function( event, ui ) {

                    var droppableIndex = view.getPosition($(this), table) - 1;
                    console.log('droppable index', droppableIndex);
                    var draggableIndex = view.getPosition(ui.draggable, table) - 1;
                    console.log('draggable index', draggableIndex);

                    view.permuteColumns(draggableIndex, droppableIndex);

                }
            });
            this._super();
        },

        getPosition: function (th, table) {
            var position;
            $('th', table).each(function (i) {
                var equals = th[0] === $('th', table).eq(i)[0];
                if (equals) {
                    position = i;
                    console.log('element position is', i);
                    return false;
                }
            });
            return position;
        },

        permuteColumns: function (startIndex, endIndex) {

            //compute permutation from plugin given information
            //var startIndex = startColumn - 1;
            //var endIndex = stopColumn - 1;
            var controller = get(this, 'controller');
            var columns = this.getColumns();

            if (startIndex === 0 || endIndex === 0) {
                console.log('unable to perform drag and drop operation');
                controller.send('refreshView');
            }

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

                controller.saveUserConfiguration(function () {
                    controller.send('refreshView');
                });
            } else {
                console.log('unable to perform drag and drop operation');
                controller.send('refreshView');
            }
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

    return mixin;
});
