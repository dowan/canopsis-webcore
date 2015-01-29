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
    'jqueryui',
], function($, Ember) {

    var get = Ember.get,
        set = Ember.set;

    var view = Ember.View.extend({
        templateName: 'tabledraggableth',
        tagName: 'th',
        attributeBindings : [ 'draggable', 'droppable' ],
        draggable : 'true',
        droppable : 'true',

        click: function() {
            this.get('controller').send("sort", get(this, 'attr'));
        },

        dragStart: function() {
            // console.log('dragStart');
        },
        drag: function(event) {
            // console.log('drag', this.get('elementId'), event.originalEvent.clientX);
            // console.log('getting th positions');

            var ths = this.$().parent().children('th'),
                mouseX = event.originalEvent.clientX;

            $(ths).css({'border-right': '0'});

            // console.log(this.getPosition(this.$()));

            this.closestTh = undefined;
            var closestDistance = 99999;
            for (var i = 0, l = ths.length; i < l; i++) {
                var absoluteDistance = Math.abs($(ths[i]).position().left + $(ths[i]).width() - mouseX);

                if(absoluteDistance < closestDistance) {
                    this.closestTh = ths[i];
                    closestDistance = absoluteDistance;
                }
            }

            // console.log(closestDistance, this.closestTh);
            $(this.closestTh).css({'border-right': '10px solid blue'});
            // console.log(ths);

        },
        dragEnter: function() {
            // console.log('dragEnter');
        },
        dragLeave: function() {
            // console.log('dragLeave');
        },
        dragOver: function() {
            // console.log('dragOver');
        },
        dragEnd: function(event) {
            var ths = this.$().parent().children('th');
            $(ths).css({'border-right': '0'});

            console.log('permute', this.getPosition(this.$()), this.getPosition($(this.closestTh)));
            this.permuteColumns(this.getPosition(this.$()), this.getPosition($(this.closestTh)));
        },
        drop: function() {
            // console.log('drop');
        },

        swapColumnsInDom: function(table, from, to) {
            var rows = $('tr', table);
            var cols;
            rows.each(function() {
                cols = $(this).children('th, td');
                cols.eq(from).detach().insertBefore(cols.eq(to));
            });
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

            var permutation = columns.splice(startIndex - 1,1)[0];


            // this.swapColumnsInDom(this.$().parent().parent(), startIndex, endIndex + 1);
            // exchange dragged column place in model as it is done in the view.
            if (!Ember.isNone(permutation)) {
                console.debug('permutation is', permutation);
                console.debug('permutation is replaced between', columns[endIndex -1], 'and', columns[endIndex]);
                columns.splice(endIndex, 0, permutation);

                console.debug('columns after drag', columns);

                // Synchornize view and model
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

        getPosition: function (th) {
            var ths = this.$().parent().children('th');
            var position;
            ths.each(function (i) {
                var equals = th[0] === ths.eq(i)[0];
                if (equals) {
                    position = i;
                    console.log('element position is', i);
                    return false;
                }
            });
            return position;
        },

        getColumns: function() {
            //find better column order depending on available information source.
            var columns = get(this,'controller.displayed_columns');
            if (Ember.isNone(columns)) {

                var shown_columns = get(this, 'controller.shown_columns');
                console.debug('using shown_columns property', shown_columns);
                columns = Ember.A();

                for (var i = 0, l = shown_columns.length; i < l; i++) {
                    columns.pushObject(get(shown_columns[i], 'field'));
                }
            } else {
                console.debug('using displayed_columns property');
            }
            return columns;
        }
    });


    loader.register('view:tabledraggableth', view);

    return view;
});
