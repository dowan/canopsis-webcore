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

    var set = Ember.set;


    function isPointOnElement(x, y, el) {
        var el_x = ($(el).offset().left);
        var el_y = ($(el).offset().top);

        y = y + $(window).scrollTop();
        x = x + $(window).scrollLeft();

        console.log('isPointOnElement', y, $(window).scrollTop(), el_y);
        if(x > el_x && x < el_x + $(el).width() && y > el_y && y < el_y + $(el).height())
            return true;
        else
            return false;
    }

    /**
     * This view is used in the fixed layout mixin to allow replacement of widgets via drag and drop
     */
    var view = Ember.View.extend({
        templateName: 'draggablewidgeticon',
        tagName: 'div',
        attributeBindings : [ 'draggable', 'droppable' ],
        draggable : 'true',
        droppable : 'true',

        click: function() {},
        drag: function(event) {
            var table  = this.$().parent().parent().children('table'),
                mouseX = event.originalEvent.clientX,
                mouseY = event.originalEvent.clientY;

            var tds = table.find('td');

            for (var i = 0, l = tds.length; i < l; i++) {
                var td = tds[i];

                if(isPointOnElement(mouseX, mouseY, td)) {
                    $(td).css({'background-color' : 'red'});
                } else {
                    $(td).css({'background-color' : 'white'});
                }
            }
        },

        dragEnd: function(event) {
            var table  = this.$().parent().parent().children('table'),
                mouseX = event.originalEvent.clientX,
                mouseY = event.originalEvent.clientY;

            var trs = table.find('tr');

            for (var i = 0, li = trs.length; i < li; i++) {
                var tr = trs[i];

                if(isPointOnElement(mouseX, mouseY, tr)) {
                    var topPos = i,
                        tds = $(tr).find('td');

                    for (var j = 0, lj = tds.length; j < lj; j++) {
                        var td = tds[j];

                        if(isPointOnElement(mouseX, mouseY, td)) {
                            var leftPos = j;

                            set(this, 'widgetslot.position', {left:leftPos, top:topPos});
                        }
                    }
                }
            }
        }
    });


    loader.register('view:draggablewidgeticon', view);

    return view;
});
