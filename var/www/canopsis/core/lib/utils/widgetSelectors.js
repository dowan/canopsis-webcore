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

define(['ember'], function(Ember) {

    var widgetSelectors = {


        toTree: function (widget) {
            if (Ember.isNone(widget)) {
                console.warn('Widget is undefined in widget selector toTree');
                return {};
            }

            tree = {};
            var widgets = widgetSelectors.directChildren(widget);
            for (var i=0; i<widgets.length; i++) {

                console.log('iterating over widget ',i);
                var children = widgetSelectors.toTree(widgets[i]);
                tree[widgets[i].get('id')] = {
                    children: children,
                    widget: widgets[i]
                };

            }

            return tree;
        },

        directChildren: function(widget) {

            if (Ember.isNone(widget)) {
                console.warn('Widget is undefined in widget selector direct children');
                return [];
            }

            console.log('in direct children')

            var widgets = widget.get('items.content');
            var result = [];

            if(!Ember.isNone(widgets)) {
                for (var i=0; i<widgets.length; i++) {
                    result.push(widgets[i].get('widget'));
                }
            }
            return result;
        },

        children: function(widget) {
            //Recursively fetch widgets an returns a list of chilren
            if (Ember.isNone(widget)) {
                console.warn('Widget is undefined in widget selector in children');
                return [];
            }

            var all = [];
            var widgets = widgetSelectors.directChildren(widget);

            for (var i=0; i<widgets.length; i++) {
                console.log('iterating over widget ',i)

                var children = widgetSelectors.children(widgets[i]);

                for(var j=0;j<children.length;j++){
                    console.log('iterating over sub children', j );
                    all.push(children[j]);
                }

                all.push(widgets[i]);
            }

            return all;
        },

        filter: function(widget, filter) {
            //testing if parameters exists
            if (Ember.isNone(widget)) {
                console.warn('Widget is undefined in widget selector in filter');
                return [];
            }
            if (Ember.isNone(filter)) {
                console.warn('Filter is undefined in widget selector in filter');
                return [];
            }

            //getting widget list for filtering purposes
            var widgets = [];

            if (filter.directChilrenOnly) {
                widgets = widgetSelectors.directChildren(widget);
                console.log('directChilrenOnly', widgets);
            } else {
                widgets = widgetSelectors.children(widget);
                console.log('not directChilrenOnly', widgets);
            }

            //keep track of selected element
            var selectedKeys = {};

            //widget filtered list
            var selection = [];

            if (filter.keyEquals) {
                for (var key in filter.keyEquals) {
                    console.log('checking if key', key, 'is in widget');
                    for (var i=0; i<widgets.length; i++) {
                        if (widgets[i].get(key) === filter.keyEquals[key]) {
                            if (Ember.isNone(selectedKeys[widgets[i].get('id')])) {
                                selection.push(widgets[i]);
                                selectedKeys[widgets[i].get('id')] = true;
                            }
                        }
                    }
                }
                //TODO implement Key exist feature
            }

            return selection;

        },

        root: function (widget) {
            if (Ember.isNone(widget)) {
                console.warn('Widget is undefined in widget selector in root');
                return [];
            }
            //TODO
        },

        parent: function (widget) {
            if (Ember.isNone(widget)) {
                console.warn('Widget is undefined in widget selector in parent');
                return [];
            }
            //TODO

        }

    };

    return widgetSelectors;
});
