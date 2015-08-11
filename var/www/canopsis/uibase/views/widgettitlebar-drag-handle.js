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
 */

define([
    'canopsis/canopsisConfiguration',
    'app/lib/utils/debug'
], function(canopsisConfiguration, debugUtils) {

    var get = Ember.get;

    var dragOrigin, dragOriginContainerController;
    var $droppableZones;
    var closestDropZone;

    /**
     * @class WidgettitlebarDragHandleView
     * @extends Ember.View
     * @memberOf canopsis.frontend.uibase
     * @constructor
     */
    var view = Ember.View.extend({
        tagName: 'span',
        classNames: ['fleft'],

        attributeBindings: 'draggable',
        draggable: 'true',
        dragStart: function(event) {
            var dataTransfer = event.originalEvent.dataTransfer;
            dataTransfer.setData('Text', this.get('elementId'));
            dragOrigin = get(this, 'widget');
            dragOriginContainerController = get(this, 'controller');
            $droppableZones = $('.dropTarget');
        },
        drag: function(event) {
            evt = event.originalEvent || window.event;
            var x = evt.pageX,
                y = evt.pageY;

            if(x !== 0 && y !== 0) {
                $droppableZones.removeClass('nearest');
                closestDropZone = $droppableZones.nearest({ x: x, y: y });
                closestDropZone.addClass('nearest');
            }
            // console.log($droppableZones.nearest({ x: x, y: y }), event);
        },
        dragEnd: function(event) {
            if(closestDropZone.length) {
                debugUtils.getViewFromJqueryElement(closestDropZone).dropWidget(event);
                $droppableZones.removeClass('nearest');
            }
        },
        templateName: 'widgettitlebar-drag-handle'
    });

    Ember.Handlebars.helper('widgettitlebar-drag-handle', view);

    /**
     * @class WidgettitlebarDragHandleView
     * @extends Ember.View
     * @memberOf canopsis.frontend.uibase
     * @constructor
     */
    var view2 = Ember.View.extend({
        init: function() {
            this._super();

            if(get(this, 'additionnalClass')) {
                get(this, 'classNames').pushObject(get(this, 'additionnalClass'));
            }
        },

        classNames: ['dropTarget'],

        dropWidget: function(event) {
            console.log('dropped', arguments, dragOrigin, get(this, 'insertAtIndex'));
            var originItems = get(dragOriginContainerController, 'items.content');
            console.log('items', originItems);

            var removedIndex;
            var insertAtIndex = get(this, 'insertAtIndex');
            for (var i = 0, l = originItems.length; i < l; i++) {
                // console.log(get(widgetController, 'content.items.content')[i]);

                if (get(originItems[i], 'widget') === get(dragOrigin, 'widget')) {
                    originItems.removeAt(i);
                    console.log('deleteRecord ok');
                    removedIndex = i;
                    break;
                }
            }

            var destination = get(this, 'controller');
            get(destination, 'items.content').insertAt(insertAtIndex, dragOrigin);

            get(this, 'controller.viewController.content').save();

            event.preventDefault();
            return false;
        },
        templateName: 'widget-drop-target'
    });

    Ember.Handlebars.helper('widget-drop-target', view2);

    Ember.Application.initializer({
        name: 'WidgettitlebarDragHandleView',
        initialize: function(container, application) {
            application.register('view:widgettitlebar-drag-handle', view);
        }
    });

    return view;
});
