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
    'app/lib/wrappers/bootstrap'
], function(Ember, Application) {

    var get = Ember.get,
        set = Ember.set;


var DragNDrop = Ember.Namespace.create();

DragNDrop.cancel = function(event) {
    event.preventDefault();
    return false;
};
/*
DragNDrop.Dragable = Ember.Mixin.create({
    attributeBindings: 'draggable',
    draggable: 'true',
    dragStart: function(event) {
        console.log('drag started !');
        var dataTransfer = event.originalEvent.dataTransfer;
        dataTransfer.setData(
            'elementId', this.get('elementId'),
            'content', get(this, 'content')
        );

    }
});
*/
DragNDrop.Droppable = Ember.Mixin.create({
    dragEnter: DragNDrop.cancel,
    dragOver: DragNDrop.cancel,
    drop: function(event, ui) {

        console.log('ui element dropped', ui);

        var viewId = event.originalEvent.dataTransfer.getData('elementId');
        var content = event.originalEvent.dataTransfer.getData('content');

        console.log('drop done !');

        console.log('viewId', viewId);
        console.log('content', content);


        Ember.View.views[viewId].destroy();

        event.preventDefault();

        return false;
    }
});

//App.Box = Ember.View.extend(DragNDrop.Dragable);
//App.DropTarget = Ember.View.extend(DragNDrop.Droppable);​


    var component = Ember.Component.extend(/*DragNDrop.Dragable,*/ DragNDrop.Droppable, {

        didInsertElement: function() {

        }
    });

    Application.ComponentListtreeComponent = component;

    return component;
});
