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
    'ember',
    'jquery',
    'app/lib/attributepresetregistry',
    'app/lib/utils/dom',
    'app/lib/utils/jquery'
], function(Ember, $, attributepresetRegistry, domUtils, jqueryUtils) {

    var get = Ember.get,
        set = Ember.set;


    var component = Ember.Component.extend({
        tagName: 'li',
        attributeBindings : [ 'draggable', 'droppable' ],

        draggable : 'true',
        droppable : 'true',

        didInsertElement: function() {
            set(this, 'parentLi', this.$().parent());
        },

        drag: function(event) {
            var treeviewBase  = this.$().closest('.treeview'),
                mouseX = event.originalEvent.clientX,
                mouseY = event.originalEvent.clientY;

            var lis = treeviewBase.find('li');

            for (var i = 0, l = lis.length; i < l; i++) {
                var li = lis[i];

                if(jqueryUtils.isPointOnElement(mouseX, mouseY, li)) {
                    $(li).css({'border-top' : '1px solid red'});
                    $(li).addClass('selected');
                } else {
                    $(li).css({'border-top' : '0'});
                    $(li).removeClass('selected');
                }
            }
        },

        dragEnd: function(event) {
            var treeviewBase  = this.$().closest('.treeview'),
                mouseX = event.originalEvent.clientX,
                mouseY = event.originalEvent.clientY;

            var lis = treeviewBase.find('li.selected');

            var selectedLi = lis[lis.length - 1];
            $(selectedLi).css({'border-top' : '1px solid green'});

            treeviewBase.find('li.selected').removeClass('selected').css({'border-top' : '0'});

            var selectedView = domUtils.getViewFromJqueryElement($(selectedLi).parent());
            if(selectedView !== undefined) {
                console.log(domUtils.getViewFromJqueryElement($(selectedLi).parent()));
                var droppedWidget = domUtils.getViewFromJqueryElement($(event.target));
                var droppedWidgetParent = domUtils.getViewFromJqueryElement($(event.target).parent());

                console.log(droppedWidgetParent);
                console.log('dropped', get(droppedWidget, 'widget.title'), 'into', get(selectedView.widget, 'title'));

                console.log('@@widget new', get(droppedWidget,'controller'));
                selectedView.widget.get('items.content').pushObject(get(droppedWidget,'controller'));
                var oldItems = droppedWidgetParent.get('widget').get('items.content');
                // oldItems.removeObject(get(droppedWidget, 'widget'));

                for (var i = 0, l = oldItems.length; i < l; i++) {
                    if(get(oldItems[i], 'widget.title') === droppedWidget.get('widget.title')) {
                        console.log('>>>> remove at', i);
                        console.log('@@widget old', get(oldItems[i], 'widget'));
                        oldItems.removeAt(i);
                    }
                }
            }
        }
    });


    Ember.Application.initializer({
        name:"component-widgettreeitem",
        initialize: function(container, application) {
            application.register('component:component-widgettreeitem', component);
        }
    });

    return component;
});
