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
    'app/lib/factories/widget',
    'd3',
    'app/lib/loaders/schemas'
], function(WidgetFactory, d3) {
    var get = Ember.get,
        set = Ember.set;

    /*var GraphViewMixin = Ember.Mixin.create({
        didInsertElement: function() {
            // call controller.findItems function when the template is loaded
            //this.controller.findItems();//var findItems = get(this, 'controller.findItems');
            //findItems();
            this._super.apply(this, arguments);
        }
    });*/

    var widget = WidgetFactory('graph', {

        graph_type: null,
        graph_id: null,

        node_class: 'node', // node class
        link_class: 'link', // link class

        force: null, // d3 force element for auto display

        /*viewMixins: [
            GraphViewMixin
        ],*/

        /**
        * Get request server url.
        */
        getGraphUrl: function(graph_type) {
            result = '/' + graph_type + '/graphs/';

            return result;
        },

        /**
        * Get graph with its elements from a foreign server.
        */
        getGraphFromServer: function(graph_type, graph_id){
            _url = this.getGraphUrl(graph_type);
            return new Ember.RSVP.Promise(function(resolve, reject) {
                $.ajax(
                    {
                        url: _url,
                        type: 'POST',
                        data: {
                            'ids': graph_id,
                            'add_elts': true
                        }
                    }
                ).then(resolve, reject);
            });
        },

        /**
        * display nodes in the widget
        */
        findItems: function(){
            // get graph id and graph type
            this.graph_type = this.get('graph_type');
            if (!this.graph_type) this.graph_type = 'topology';
            this.graph_id = this.get('graph_id');
            if (!this.graph_id) this.graph_id = 'test';

            if (this.graph_id !== undefined) {
                // use graph id in getNodes method in order to get nodes
                var promise = this.getGraphFromServer(this.graph_type, this.graph_id);
                var me = this;
                // execute the promise to get nodes
                var nodes = promise.then(function(result) {
                    // get nodes
                    var graph = result.data[0];
                    // with nodes in parameters
                    me.display(graph);
                });
            }
        },

        display: function(graph) {
            // add nodes and links in graph
            graph.nodes = [];
            graph.links = [];
            graph.isRoot = true;
            // used to save nods by ids
            nodes_by_indexes = {};
            /**
            * add graph nodes in d3_graph
            */
            function addNode(node) {
                node.id = node.cid;  // index equals node id
                graph.nodes.push(node);  // push node in d3_graph nodes
                nodes_by_indexes[node.id] = node;
            }
            /**
            * add link in d3_graph
            */
            function addLink(edge) {
                // save count of link_id per targets/sources
                var link_id_count = {};
                // cause a d3 link has one source and one target, we may create as many link as there are composition of sources and targets.
                var sources = edge.sources;
                var targets = edge.targets;
                // save edge weight before being overriden by the force layout
                edge._weight = edge.weight;
                // add edge such as a node between all sources and targets
                addNode(edge);
                // for all sources
                for (var source_index=0; source_index<sources.length; source_index++) {
                    // find the right id related to edge.id, source and count of (edge.id, source)
                    var source = sources[source_index];
                    var link_id = 'source-' + edge.id + '-' + source;
                    var count = link_id_count[link_id];
                    if (count === undefined) {
                        count = 0;
                    } else {
                        count++;
                    }
                    link_id_count[link_id] = count;
                    link_id += '-' + count;
                    // create a pre_link which link a source to the edge
                    var pre_link = {
                        isSource: true,
                        source: source,
                        target: edge.id,
                        elt: edge,
                        pos: source_index,
                        id: link_id
                    };
                    graph.links.push(pre_link);
                }
                // for all targets
                for (var target_index=0; target_index<targets.length; target_index++) {
                    // find the right id related to edge.id, target and count of (edge.id, target)
                    var target = targets[target_index];
                    var link_id = 'target-' + edge.id + '-' + target;
                    var count = link_id_count[link_id];
                    if (count === undefined) {
                        count = 0;
                    } else {
                        count++;
                    }
                    link_id_count[link_id] = count;
                    link_id += '-' + count;
                    // create a post_link which links the edge to a target
                    var post_link = {
                        isSource: false,
                        source: edge.id,
                        target: target,
                        elt: edge,
                        pos: target_index,
                        id: link_id
                    };
                    graph.links.push(post_link);
                }
            }

            // add the graph itself among nodes
            addNode(graph);

            // get loaded graph elts
            var elts = graph._delts;

            for (var elt_index=0; elt_index<elts.length; elt_index++) {
                elt = elts[elt_index];
                // if elt is an edge, add it among edges.
                if (elt._type === 'edge') {
                    addLink(elt);
                } else { // in other cases, add elt among nodes.
                    addNode(elt);
                }
            }

            // resolve sources and targets in links
            for (var link_index=0; link_index<graph.links.length; link_index++) {
                link = graph.links[link_index];
                link.source = nodes_by_indexes[link.source];
                link.target = nodes_by_indexes[link.target];
            }

            var width = 900, height = 500;

            // apply force behavior
            this.force = d3.layout.force().charge(-120).linkDistance(30).size([width, height]);

            // select svg
            var svg = d3.select('div.graph svg g');
            if (svg.size() === 0) {
                /**
                * zoom function
                */
                function zoom() {
                    svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                }
                var zoom = d3.behavior.zoom()
                    //.scaleExtent([1, 8])
                    .on('zoom', zoom)
                ;
                // or create it if it does not exist
                svg = d3.select('div.graph svg')
                    .attr('width', width)
                    .attr('height', height)
                        .append('g')
                            .call(zoom)
                ;
            }

            // apply an overlay for better graph zooming and selection
            var overlay = svg.select('.overlay');
            if (overlay.size() === 0) {
                svg
                    .append("rect")
                        .classed("overlay", true)
                        .attr("width", width)
                        .attr("height", height)
                ;
            }

            // load nodes and links into force
            this.force.nodes(graph.nodes).links(graph.links).start();

            // get link model
            var link_model = svg.selectAll('.link')
                .data(graph.links, function(link) {return link.id;});

            // process links to delete, add and update.
            var links_to_add = link_model.enter();
            this.addLinks(links_to_add);
            var links_to_update = link_model;
            this.updateLinks(links_to_update);
            var links_to_delete = link_model.exit();
            this.delLinks(links_to_delete);

            // get node model
            var node_model = svg.selectAll('.node')
                .data(graph.nodes, function(node) {return node.id;});

            // process nodes to delete, add and update.
            var nodes_to_add = node_model.enter();
            this.addNodes(nodes_to_add);
            var nodes_to_update = node_model;
            this.updateNodes(nodes_to_update);
            var nodes_to_delete = node_model.exit();
            this.delNodes(nodes_to_delete);

            this.force.on('tick', function() {
                svg.selectAll('.link')
                    .attr('x1', function(d) {return d.source.x;})
                    .attr('y1', function(d) {return d.source.y;})
                    .attr('x2', function(d) {return d.target.x;})
                    .attr('y2', function(d) {return d.target.y;})
                ;

                svg.selectAll('.node')
                    .attr('cx', function(d) {return d.x;})
                    .attr('cy', function(d) {return d.y;})
                ;
            });

        },

        addNodes: function(nodes) {
            // create the graphical element
            var shapes = nodes
                .append('circle') // circle representation
                    .classed(this.node_class, true) // set class node
                    .classed('edgenode', function(d) {return d._type === 'edge';})
                ;
            /**
            * node selection function.
            */
            function select(node) {
                if (d3.event.defaultPrevented) return; // click suppressed
                if (node.selected) {
                    d3.select(this)
                        .classed('selected', false)
                        .transition().duration(300)
                            .style('stroke-width', 1)
                            .style('stroke', function(d){return d._type==='edge'? 'none' : 'black';})
                    ;
                } else {
                    d3.select(this)
                        .classed('selected', true)
                        .transition().duration(300)
                            .style('stroke-width', 2)
                            .style('stroke', 'blue')
                    ;
                }
                // update selected flag
                node.selected = !node.selected;
            };
            shapes
                .on('click', select) // add selection behaviour
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
                .style('stroke-width', function(d) { return d._weight;})
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

    return widget;
});
