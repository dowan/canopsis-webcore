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
    'ember'
], function(Ember, hash) {

    var get = Ember.get,
        set = Ember.set,
        __ = Ember.String.loc;


    var component = Ember.Component.extend({
        init: function () {
            this._super();
        },

        addNodes: function(nodes) {
            // create the graphical element
            var shapes = nodes
                .append('circle') // circle representation
                    .classed(this.node_class, true) // set class node
                    .classed('edgenode', function(d) {return d._type === 'edge';})
                ;
            var me = this;
            function show_toolbox() {
                var elt = d3.select(this);
                // if toolbox exists
                if (me.toolbox !== null) {
                    // remove old toolbox
                    me.toolbox.
                        transition()
                            .duration(300)
                            .remove()
                        ;
                }
                // add a new toolbox with specific node toolbox items
                var toolbox_items = me.getNodeToolBoxItems(elt[0][0].__data__);
                // get coordinates
                var coordinates = d3.mouse(this);
                // create generic toolbox
                me.toolbox = elt
                    .selectAll('.toolbox')
                    .data(toolbox_items).enter()
                    .append('circle')
                        .classed('.toolbox', true)
                        .attr('cx', function(d, i) {return coordinates[0] + Math.cos(i) * 10;})
                        .attr('cy', function(d, i) {return coordinates[1] + Math.sin(i) * 10;})
                        .attr('r', 2)
                    ;
                // and update it
                // me.updateToolbox(me.toolbox);
            };
            shapes
                .on('click', select) // add selection behaviour
                .on('dblclick', show_toolbox)  // add menu selection
                .on('mouseover', function() {d3.select(this).classed('over', true);})
                .on('mouseout', function() {d3.select(this).classed('over', false);})
                ;
            // add a title which is the entity id
            shapes.append('title')
                .text(
                    function(d) {
                        return d.name ? d.name : d.id;
                    }
                )
            ;
            // node drag
            var node_drag = this.force.drag
                .on(
                    'dragstart',
                    function (d) {
                        d3.event.sourceEvent.stopPropagation();
                        d3.select(this).classed("dragging", true);
                    }
                )
                .on(
                    'dragend',
                    function (d) {
                        d3.select(this).classed("dragging", false);
                    }
                );
            // ensure dragging of circle
            shapes.call(node_drag);
        },

        /**
        * called during node deletion.
        */
        delNodes: function(nodes) {
            nodes
                .transition(500)
                .remove()
            ;
        },

        /**
        * called during node updating.
        */
        updateNodes: function(nodes) {
            nodes
                .style(
                    'fill',
                    function(d) { // set default color to green
                        return (!d.state) ? 'green' : 'red'
                    }
                )
                .attr(
                    'r',
                    function(d) { return d.isRoot? 5 : d.weight;}
                )
            ;
        },

        /**
        * called during link addition.
        */
        addLinks: function(links) {
            // create the graphical element
            var shapes = links
                .append('line') // line representation
                    .classed(this.link_class, true) // set class link
            ;
        },

        /**
        * called during link deletion.
        */
        delLinks: function(links) {
            links
                .transition()
                    .duration(500)
                    .remove()
            ;
        },

        /**
        * called during link updating.
        */
        updateLinks: function(links) {
            links
                .classed('directed', function(d) {return d.elt.directed;})
                .style('stroke-width', function(d) { return d.elt._weight;})
                .style('stroke', 'green')
                .style(
                    'marker-end',
                    function(d) {
                        return (d.elt.directed && !d.isSource)? "url(#markerArrow)" : "";
                    }
                )
            ;
        }

    });

    Ember.Application.initializer({
        name:"component-graph",
        initialize: function(container, application) {
            application.register('component:component-graph', component);
        }
    });

    return component;
});
