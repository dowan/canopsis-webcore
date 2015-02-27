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

/**
* This widget uses 3 layers of models:
* - Dom element ---> D3 element (node and link) <--> canopsis record.
* Dom element to D3 element: field __data__
* D3 element to canopsis record: elt
* canopsis record to D3 element: d3_elt
* All elements have the same uuid:
* - id: Dom and D3 elements
* - cid/_id: canopsis record.
*
* The process begins in executing the updateModel method.
* This last aims to retrieve a graph with its elements.
* Once the graph is retrieved, all elements including the graph, are
* transformed into schemas records and saved in the dictionary graph._delts where keys are record uid.
* A vertice becomes a node, an edge becomes a set of node and links, and the graph is a node as well.
* Then, D3 elements are created related to those records, and saved in
* this.d3_graph object.
* This last contains two lists respectively for nodes and links of D3, and a
* dictionary of D3 elements by id.
* Finally, in order to retrieve quickly links from an edge node, the elt link
* property refers to its edge. And an edge contains two dictionaries of dictionaries of links by id by neighbour id
* respectivelly named 'sources' and 'targets'.
* Each link knows its position in the d3_graph thanks to the view_pos field.
*/
define([
    'jquery',
    'app/lib/factories/widget',
    'd3',
    'app/lib/loaders/schemas',
    'app/lib/utils/forms',
    'app/lib/utils/data',
    'jqueryui'
], function($, WidgetFactory, d3, schemas, formsUtils, dataUtils) {
    var get = Ember.get,
        set = Ember.set;

    var TopologyViewMixin = Ember.Mixin.create({

        graph: null, // graph model from the controller

        d3_graph: {
            nodes: [],
            links: [],
            data_by_id: {}
        }, // d3 graph with nodes and links and shapes by ids

        selected: [], // selected items

        node_class: 'node', // node class name
        link_class: 'link', // link class name

        toolbox: null, // global toolbox which may be unique

        force: null, // d3 force element for auto display

        panel: null, // display panel

        source: null, // source link data

        toolbox_gap: 50, // toolbox gap between shapes
        duration: 500, // transition duration

        _translate: [0, 0],
        _scale: 1,

        _autoLayout: true,

        _size: [1, 1],
        _charge: -120,
        _chargeDistance: 500,
        _linkDistance: 20,
        _linkStrength: 1,
        _friction: 0.9,
        _theta: 0.8,
        _gravity: 0.1,

        eventZoom: null, // last event zoom fired by d3

        filter: function() {
            return this._filter;
        }.property('filter'),
        filterChanged: function() {
            this._filter = get(this, 'filter');
        }.observes('filter'),
        autoLayout: function() {
            return this._autoLayout;
        }.property('autoLayout'),
        autoLayoutChanged: function() {
            this._autoLayout = get(this, 'autoLayout');
            if (this._autoLayout) {
                this.force.start();
            } else {
                this.force.stop();
            }
        }.observes('autoLayout'),
        size: function() {
            return this._size;
        }.property('size'),
        sizeChanged: function() {
            this._size = this.get('size');
            this.force.size(size);
        }.observes('size'),
        charge: function() {
            return this._charge;
        }.property('charge'),
        chargeChanged: function() {
            this._charge = this.get('charge');
            this.force.charge(charge);
        }.observes('charge'),
        chargeDistance: function() {
            return this._chargeDistance;
        }.property('chargeDistance'),
        chargeDistanceChanged: function() {
            this._chargeDistance = this.get('chargeDistance');
            this.force.chargeDistance(chargeDistance);
        }.observes('chargeDistance'),
        linkDistance: function() {
            return this._linkDistance;
        }.property('linkDistance'),
        linkDistanceChanged: function() {
            this._linkDistance = this.get('linkDistance');
            this.force.linkDistance(linkDistance);
        }.observes('linkDistance'),
        linkStrength: function() {
            return this._linkStrength;
        }.property('linkStrength'),
        linkStrengthChanged: function() {
            this._linkStrength = this.get('linkStrength');
            this.force.linkStrength(linkStrength);
        }.observes('linkStrength'),
        friction: function() {
            return this._friction;
        }.property('friction'),
        frictionChanged: function() {
            this._friction = this.get('friction');
            this.force.friction(friction);
        }.observes('friction'),
        theta: function() {
            return this._theta;
        }.property('theta'),
        thetaChanged: function() {
            this._theta = this.get('theta');
            this.force.theta(theta);
        }.observes('theta'),
        gravity: function() {
            return this._gravity;
        }.property('gravity'),
        gravityChanged: function() {
            this._gravity = this.get('gravity');
            this.force.gravity(gravity);
        }.observes('gravity'),

        rerender: function() {
            this._super.apply(this, arguments);
            this.didInsertElement();
        },

        //Controller -> View Hooks
        registerHooks: function() {
            result = this._super.apply(this, arguments);
            get(this, "controller").on('redraw', this, this.redraw);
            return result;
        },

        unregisterHooks: function() {
            result = this._super.apply(this, arguments);
            get(this, "controller").off('redraw', this, this.redraw);
            return result;
        },

        didInsertElement: function() {
            this._super.apply(this, arguments);
            if (get(this, 'controller').graph === null) {
                return;
            }
            // get controller graph
            this.graph = get(this, 'controller').graph;
            // reinitialize old view
            if (this.d3_graph === undefined) {
                this.d3_graph = {
                    nodes: [],
                    links: [],
                    data_by_id: {}
                };
                get(this, 'controller').d3_graph = this.d3_graph;
            } else { // or remove useless d3 elts from data_by_id
                var graph = this.graph;
                var d3_graph = this.d3_graph;
                var graph_id = get(this, 'controller').graph_id;
                var elts_to_delete = [];
                Object.keys(d3_graph.data_by_id).forEach(
                    function(elt_id) {
                        var elt = d3_graph.data_by_id[elt_id];
                        if (elt.isSource === undefined && elt_id !== graph_id && graph._delts[elt_id] === undefined) {
                            elts_to_delete.push(elt);
                        }
                    }
                );
                get(this, 'controller').d3_graph = this.d3_graph;
                // delete elts
                get(this, 'controller').delete(elts_to_delete, true);
            }
            // update the view
            this.updateModel();
        },

        redraw: function() {
            var me = this;
            var width = get(this, 'controller.width');
            if (!width) width = this.$().width();
            var height = get(this, 'controller.height');
            if (!height) height = width * 9 / 16;
            // apply force behavior
            if (this.force === null) {
                this.force = d3.layout.force()
                    //.size(this._size)
                    .charge(this._charge)
                    .chargeDistance(this._chargeDistance)
                    .linkDistance(this._linkDistance)
                    .linkStrength(this._linkStrength)
                    .friction(this._friction)
                    .theta(this._theta)
                    .gravity(this._gravity)
                ;
            } else {
                // stop force while updating its properties
                this.force.stop();
            }
            this.force.size([width, height]);
            // select svg
            this.panel = d3.select(this.$('svg g')[0]);
            if (this.panel.size() === 0) {
                this.eventZoom = {
                    translate: this._translate,
                    scale: this._scale
                };
                /**
                * zoom function.
                */
                function zoom() {
                    /*_this.eventZoom = d3.event;
                    console.log(_this.eventZoom);
                    if (d3.event.sourceEvent.type !== 'mousemove') {*/
                        if (!me.dragging) {
                            me.panel.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                        }
                    /*} else {
                        var translate = [d3.event.translate[0] * d3.event.scale, d3.event.translate[1] * d3.event.scale];
                        me.panel.attr("transform", "translate(" + translate + ")scale(" + d3.event.scale + ")");
                    }*/
                };
                function drag() {
                    console.log(d3.event);
                    var translate = [
                        me.eventZoom.translate[0] + d3.event.dx,
                        me.eventZoom.translate[1] + d3.event.dy
                    ];
                    me.eventZoom.translate = translate;
                    me.panel.attr('transform', 'translate(' + translate + ') scale(' + me.eventZoom.scale + ')');
                    me.panel.select('.overlay').attr(
                        {
                            'x': -translate[0],
                            'y': -translate[1]
                        }
                    );
                };
                var drag = d3.behavior.drag()
                    //.on('drag',drag)
                    ;
                var zoom = d3.behavior.zoom()
                    //.translate([0, 0])
                    //.scale(1)
                    .scaleExtent([1.5, 8])
                    //.scaleExtent([-10, 10])
                    .on('zoom', zoom)
                ;
                // or create it if it does not exist
                this.panel = d3.select(this.$('svg')[0])
                    .attr(
                        {
                            width: width,
                            height: height
                        }
                    )
                    .append('g')
                        .attr(
                            {
                            //    transform: 'scale(1.5)'
                            }
                        )
                        .on('click', function(){ return me.clickAction(this);})
                        .on('mousemove', function() { return me.moveAction(this);})
                        //.on('mouseover', function() { return me.overAction(this);})
                        .on('mouseout', function() { return me.overAction(this);})
                        .on('dblclick', function() { return me.addHandler();})
                        .call(zoom)
                        //.call(drag)
                ;
            }

            // apply an overlay for better graph zooming and selection
            var overlay = this.panel.select('.overlay');
            if (overlay.size() === 0) {
                this.panel
                    .append("rect")
                        .classed("overlay", true)
                        .attr("width", width)
                        .attr("height", height);
                ;
            }
            // load nodes and links into force
            this.force.nodes(this.d3_graph.nodes).links(this.d3_graph.links);
            // get link model
            var link_model = this.panel.selectAll('.' + this.link_class)
                .data(this.d3_graph.links, function(link) {return link.id;});

            // process links to delete, add and update.
            var links_to_add = link_model.enter();
            this.addLinks(links_to_add);
            var links_to_update = link_model;
            this.updateLinks(links_to_update);
            var links_to_delete = link_model.exit();
            this.delLinks(links_to_delete);

            // get node model
            var node_model = this.panel.selectAll('.' + this.node_class)
                .data(this.d3_graph.nodes, function(node) {return node.id;});

            // process nodes to delete, add and update.
            var nodes_to_add = node_model.enter();
            this.addNodes(nodes_to_add);
            var nodes_to_update = node_model;
            this.updateNodes(nodes_to_update);
            var nodes_to_delete = node_model.exit();
            this.delNodes(nodes_to_delete);

            // refresh selected shapes
            this.refreshSelectedShapes();

            // refresh locked shapes
            this.refreshLockedShapes();

            this.force.on('tick', function() {
                link_model
                    .attr(
                        'x1',
                        function(d) {
                            if (!d.source.x) {
                                d.source.x = 1;
                            }
                            return d.source.x;
                        }
                    )
                    .attr(
                        'y1',
                        function(d) {
                            if (!d.source.y) {
                                d.source.y = 1;
                            }
                            return d.source.y;
                        }
                    )
                    .attr(
                        'x2',
                        function(d) {
                            if (!d.target.x) {
                                d.target.x = 1
                            }
                            return d.target.x;
                        }
                    )
                    .attr(
                        'y2',
                        function(d) {
                            if (!d.target.y) {
                                d.target.y = 1;
                            }
                            return d.target.y;
                        }
                    )
                ;
                node_model
                    .attr("transform", function(d) {
                        if (!d.x) {
                            d.x = 1;
                        }
                        if (!d.y) {
                            d.y = 1;
                        }
                        return "translate(" + (d.x) + "," + (d.y) + ")"; }
                    )
                ;
            });
            if(this._autoLayout) {
                this.force.start();
            }
        },

        updateModel: function() {
            var me = this;
            this.graph = get(this, 'controller').graph;
            // add nodes and links in graph
            // contain nodes by entity_ids
            var nodes_by_entity_ids = {};
            /**
            * Save node related to entity ids in memory.
            */
            function saveRefToEntity(node) {
                // add reference between entity id and node
                if (node.elt.get('info')) {
                    var entity = node.elt.get('info').entity;
                    if (entity !== undefined) {
                        if (nodes_by_entity_ids[entity] === undefined) {
                            nodes_by_entity_ids[entity] = [node];
                        } else {
                            nodes_by_entity_ids[entity].push(node);
                        }
                    }
                }
            };
            // add the graph itself among nodes
            var node = this.vertice2D3Node(this.graph);
            saveRefToEntity(node);
            // get loaded graph elts
            var elts = this.graph._delts;

            Object.keys(elts).forEach(
                function(elt_id) {
                    var elt = elts[elt_id];
                    // get d3 node from elt in ensuring elt is a record
                    d3_node = this.vertice2D3Node(elt);
                    elt = d3_node.elt;
                    // update its reference in _delts
                    elts[elt_id] = elt;
                    var node = null;
                    if (elt.get('_type') === 'edge') {
                        // add links if elt is an edge.
                        this.weaveLinks(d3_node);
                    } else {
                        // initialize weight
                        d3_node._weight = 1;
                    }
                    // register the node in memory
                    saveRefToEntity(d3_node);
                },
                this
            );

            // resolve weight
            this.d3_graph.nodes.forEach(
                function(node, i) {
                    if (node.elt.get('_type') === 'edge') {
                        var source_id = node.elt.get('sources')[0];
                        var source_node = this.d3_graph.data_by_id[source_id];
                        source_node._weight += node.elt.get('weight');
                    }
                    node.index = i;
                    node.entity = undefined;
                },
                this
            );

            // resolve sources and targets in links
            this.d3_graph.links.forEach(
                function(link) {
                    if (typeof link.source === 'string') {
                        link.source = this.d3_graph.data_by_id[link.source];
                    }
                    if (typeof link.target === 'string') {
                        link.target = this.d3_graph.data_by_id[link.target];
                    }
                },
                this
            );

            get(this, 'controller').d3_graph = this.d3_graph;

            // resolve entities
            get(this, 'controller').getEntitiesFromServer(
                Object.keys(nodes_by_entity_ids),
                function(result) {
                    if (result.total !== 0) {
                        result.data.forEach(
                            function(entity) {
                                nodes_by_entity_ids[entity._id].forEach(
                                    function(node) {
                                        node.entity = entity;
                                    }
                                );
                            }
                        );
                    }
                    me.trigger('redraw');
                }
            );
        },

        /**
        * Convert a vertice to a node and add it in the graph model.
        *
        * @param record ember record which corresponds to a vertice.
        * @return d3 node.
        */
        record2Node: function(record) {
            var record_id = record.get('cid');
            var result = this.d3_graph.data_by_id[record_id];
            if (result === undefined) {
                var old_result = record.d3_elt;
                var result = {
                    id: record_id,
                    index: this.d3_graph.nodes.length,
                    _weight: 1,
                    x: old_result === undefined ? 0 : old_result.x,
                    y: old_result === undefined ? 0 : old_result.y,
                    px: old_result === undefined ? 0 : old_result.px,
                    py: old_result === undefined ? 0 : old_result.py,
                    fixed: old_result === undefined ? false : old_result.fixed
                };
                info = record.get('info');
                if (info.shape !== undefined && info.shape[this.graph_id] !== undefined) {
                    var coordinates = info.shape[this.graph_id];
                    if (result.x === undefined) {
                        result.x = coordinates.x;
                        result.y = coordinates.y;
                        result.fixed = coordinates.fixed;
                    }
                    if (result.px === undefined) {
                        result.px = coordinates.px;
                        result.py = coordinates.py;
                    }
                }
                // add result in d3_graph nodes
                result.index = this.d3_graph.nodes.length;
                this.d3_graph.nodes.push(result);
            }
            // save record in the result
            result.elt = record;
            // add a reference to shape from vertice
            record.d3_elt = result;
            // add node reference in d3_graph.data_by_id
            this.d3_graph.data_by_id[result.id] = result;
            return result;
        },

        /**
        * Weave edge links from a d3 elt.
        *
        * @param edge d3 graph edge.
        */
        weaveLinks: function(d3_edge) {
            var _this = this;
            // save count of link_id per targets/sources
            var link_id_count = {};
            var edge = d3_edge.elt;
            // cause a d3 link has one source and one target, we may create as many link as there are composition of sources and targets.
            var sources = edge.get('sources');
            var targets = edge.get('targets');
            // update weight
            d3_edge._weight = edge.get('weight');
            // save links in d3_edge links
            if (d3_edge.sources === undefined) {
                d3_edge.sources = {};
                d3_edge.targets = {};
            }
            var neighbour_counts = {
                sources: {},
                targets: {}
            };
            var d3_graph = this.d3_graph;
            // array of links view pos to delete at the end for better complexity time resolution
            var link_pos_to_delete = [];
            /**
            * Add links in d3_edge.
            * @param key value among targets and sources
            */
            function updateLinks(key) {
                var isSource = key === 'sources';
                var neighbours = edge.get(key);
                neighbours.forEach(
                    function(d) {
                        // get number of time we meet d
                        var neighbour_count = neighbour_counts[key][d];
                        if (neighbour_count === undefined) {
                            neighbour_count = 0;
                            neighbour_counts[key][d] = neighbour_count;
                        }
                        // increment neighbour count
                        neighbour_count++;
                        neighbour_counts[key][d] = neighbour_count;
                        // get d links
                        var links_by_id = d3_edge[key][d];
                        if (links_by_id === undefined) {
                            links_by_id = {};
                            d3_edge[key][d] = links_by_id;
                        }
                        // if a link is missing
                        var links_by_id_length = Object.keys(links_by_id).length;
                        if (links_by_id_length < neighbour_count) {
                            // create it
                            link = {
                                isSource: isSource,
                                source: isSource? d : d3_edge.id,
                                target: (!isSource)? d : d3_edge.id,
                                elt: edge, // save edge
                                id: get(this, 'controller').uuid(), // uuid
                                view_pos: d3_graph.links.length // pos in view
                            };
                            // add in view
                            d3_graph.links.push(link);
                            d3_graph.data_by_id[link.id] = link;
                            // try to inject references to sources
                            var source = d3_graph.data_by_id[link.source];
                            if (source !== undefined) {
                                link.source = source;
                            }
                            // and targets
                            var target = d3_graph.data_by_id[link.target];
                            if (target !== undefined) {
                                link.target = target;
                            }
                            // push link in d3_edge model
                            links_by_id[link.id] = link;
                        }
                    },
                    this
                );
                // remove useless links
                for (vertice_id in d3_edge[key]) {
                    var neighbour_count = neighbour_counts[key][vertice_id];
                    var index = 0; // index to start to remove links
                    if (neighbour_count !== undefined) {
                        index = neighbour_count;
                    }
                    // delete links from model
                    var link_id_to_delete = Object.keys(d3_edge[key][vertice_id]).splice(index);
                    link_id_to_delete.forEach(
                        function(link_id) {
                            var link = d3_graph.data_by_id[link_id];
                            // delete from model
                            delete d3_edge[key][vertice_id][link_id];
                            // delete from view
                            delete d3_graph.data_by_id[link_id];
                            link_pos_to_delete.push(link.view_pos);
                        },
                        this
                    );
                }
            }
            // add links for all sources
            updateLinks.call(this, 'sources');
            // add links for all targets
            updateLinks.call(this, 'targets');
            // delete useless links from view
            if (link_pos_to_delete.length > 0) {
                link_pos_to_delete.sort();
                link_pos_to_delete.forEach(
                    function(d, i) {
                        d3_graph.links.splice(d - i, 1);
                    }
                );
                d3_graph.links.forEach(
                    function(d, i) {
                        d.view_pos = i;
                    }
                );
            }
        },

        /**
        * Refresh the view related to selected data.
        */
        refreshSelectedShapes: function() {
            var selected_id = Object.keys(this.selected);
            if (selected_id.length > 0) {
                // get a list of 'selected' items
                var selected_shapes = this.panel.selectAll('.shapegroup')
                    .data(selected_id, function(d){return d;});
                // select newly selected items
                selected_shapes.classed('selected', true);
                //selected_shapes.transition().duration(this.duration).classed('selected', true);
                // unselect unselected items
                //selected_shapes.exit().transition().duration(this.duration).classed('selected', false);
                selected_shapes.exit().classed('selected', false);
            }
        },

        /**
        * Refresh the view related to locked data.
        */
        refreshLockedShapes: function() {
            this.panel.selectAll('.shapegroup').filter(
                function(d) {
                    return d.fixed;
                }
            ).classed('locked', true);
            this.panel.selectAll('.shapegroup').filter(
                function(d) {
                    return !d.fixed;
                }
            ).classed('locked', false);
        },

        coordinates: function() {
            return d3.mouse(this.panel[0][0]);
        },

        /**
        * Show tool box related to input shape.
        */
        showToolBox: function(shape) {
            if (d3.event.defaultPrevented) {
                return;
            }
            var data = shape.__data__;
            // if toolbox already exists, destroy it.
            //if (this.toolbox !== null) {
            //    this.destroyToolBox(shape);
            //}
            // add a new toolbox with specific node toolbox items
            var toolbox_items = this.getToolBoxItems(data);
            // get coordinates
            var coordinates = data? [data.x, data.y] : this.coordinates();
            var _this = this;
            // create generic toolbox
            this.toolbox = this.panel.selectAll('.toolbox')
                .data(toolbox_items, function(d) {return d.name;});
            // add new toolbox items
            var new_toolbox = this.toolbox.enter()
                .append('g')
                    .style("opacity", 0) // generic style
                    .attr(
                        {
                            id: function(d) { return 'toolbox_' + d.name;}, // id
                            class: function(d) { return 'toolbox ' + d.name;}, // class
                            transform: function(d, i) {
                                var length = 2 * i * Math.PI / toolbox_items.length;
                                var x = coordinates[0] + Math.cos(length) * _this.toolbox_gap;
                                var y = coordinates[1] + Math.sin(length) * _this.toolbox_gap;
                                var translate = 'translate(' + x + ',' + y + ')';
                                var scale = 'scale(' + (1 / _this.eventZoom.scale) + ')';
                                return translate + scale + (d.transform ? d.transform : '');
                            }
                        }
                    )
                ;
            new_toolbox // add shape
                .append('path')
                    .attr(
                        {
                            d: function(d, i) {
                                return d.symbol.size(10 * 64)(d, i);
                            }
                        }
                    )
                    // add text
                    .append('title')
                        .text(function(d) {return d.name;})
                ;
            new_toolbox // add hyperlink with name
                .append('text')
                    .text(function(d) { return d.name});
            // move all toolbox to mouse coordinates
            this.toolbox
            // attach handlers
                .on('click', function(d){return _this[d.name + 'Handler'](data, shape);})
                .transition()
                    .style("opacity", 1) // show them
                    .attr( // and move them
                        {
                            transform: function(d, i) {
                                var length = 2 * i * Math.PI / toolbox_items.length;
                                var x = coordinates[0] + Math.cos(length) * _this.toolbox_gap;
                                var y = coordinates[1] + Math.sin(length) * _this.toolbox_gap;
                                return "translate(" + x + "," + y + ") " + (d.transform ? d.transform : '');
                            }
                        }
                    )
                ;
            // delete old toolbox
            this.toolbox.exit()
                .transition()
                    .duration(this.duration)
                    .style("opacity", 0) // generic exit
                    .remove()
                ;
        },

        /**
        * Destroy toolbox.
        */
        destroyToolBox: function() {
            // delete old toolbox
            if (this.toolbox) {
                this.toolbox
                    .transition()
                        .duration(this.duration)
                        .style("opacity", 0)
                        .remove()
                    ;
            }
        },

        closeHandler: function(data) {
            d3.event.stopPropagation();
            this.destroyToolBox();
        },
        editHandler: function(data) {
            d3.event.stopPropagation();
            get(this, 'controller').edit(data);
            this.destroyToolBox();
        },
        deleteHandler: function(data) {
            d3.event.stopPropagation();
            get(this, 'controller').delete(data);
            this.destroyToolBox();
        },
        linkHandler: function(data, shape) {
            d3.event.stopPropagation();
            this.source = data; // save link source
            //var coordinates = [data.x, data.y];
            /*this.tmpLink = this.panel
                .append('line')
                    .attr(
                        {
                            id: 'tmpLink',
                            x1: coordinates[0],
                            y1: coordinates[1],
                            x2: coordinates[0],
                            y2: coordinates[1]
                        }
                    )
                    .classed('tmpLink', true)
                ;*/
            this.destroyToolBox();
        },
        addHandler: function(data) {
            d3.event.stopPropagation();
            if (this.source === null) {
                var coordinates = this.coordinates();
                function callback(record) {
                    var node = record.d3_elt;
                    node.x = coordinates[0];
                    node.y = coordinates[1];
                    node.px = node.x;
                    node.py = node.y;
                    node.fixed = true;
                    get(this, 'controller').trigger('redraw');
                }
                this.vertice2D3Node(undefined, true, callback, undefined, this);
            } else {
                function success2(record) {
                    get(this, 'controller').trigger('redraw');
                    this.removeTmpLink();
                }
                function failure2(record) {
                    this.removeTmpLink();
                }
                this.addLink(this.source, data, true, success2, failure2, this);
            }
            this.destroyToolBox();
        },
        unselectHandler: function(data) {
            d3.event.stopPropagation();
            get(this, 'controller').unselect(data);
            this.destroyToolBox();
        },
        selectHandler: function(data) {
            d3.event.stopPropagation();
            get(this, 'controller').select(data);
            this.destroyToolBox();
        },
        unlockHandler: function(data) {
            d3.event.stopPropagation();
            this.lock(data);
            this.destroyToolBox();
            get(this, 'controller').trigger('redraw');
        },
        lockHandler: function(data) {
            d3.event.stopPropagation();
            this.lock(data, true);
            this.destroyToolBox();
            get(this, 'controller').trigger('redraw');
        },
        cancelHandler: function(data) {
            d3.event.stopPropagation();
            this.removeTmpLink();
            this.destroyToolBox();
        },
        eventpoolHandler: function(data) {
            document.location.href = "/eventpool/?" + data.elt.get('info').entity;
            this.destroyToolBox();
        },
        saveHandler: function(data) {
            var _this = this;
            function success() {
                _this.destroyToolBox();
            }
            get(this, 'controller').putGraphToServer(success);
        },

        /**
        * Remove tmp link
        */
        removeTmpLink: function() {
            this.source = null;
            if (this.tmpLink) {
                this.tmpLink.remove();
            }
            this.tmpLink = null;
        },

        /**
        * Lock shapes related to input data.
        * @param data data to lock.
        * @param enable if true, lock input data shapes.
        */
        lock: function(data, enable) {
            if (!Array.isArray(data)) {
                data = [data];
            }
            data.forEach(
                function(d) {
                    d.fixed = enable;
                }
            );
            this.refreshLockedShapes();
        },

        /**
        * called when adding nodes.
        */
        addNodes: function(nodes) {
            var _this = this;
            // create the graphical element
            var shapes = nodes
                .append('g')
                    .classed(
                        {
                            shapegroup: true,
                            node: true,
                            edge: function(d) {return d.elt.get('type') === 'topoedge';},
                            topology: function(d) { return d.elt.get('type') === 'topo';}
                        }
                    )
                    .attr(
                        {
                            id: function(d) {return d.id;}
                        }
                    )
                    .on('click', function() {return _this.clickAction(this);})
                    .on('dblclick', function(){return _this.dblClickAction(this);})  // add menu selection
                    .on('mouseover', function() {_this.overAction(this);})
                    .on('mouseout', function() {_this.outAction(this);})
                    .on('mousemove', function() {_this.moveAction(this);})
                ;
            shapes
                .append('path')
                    .classed(
                        {
                            shape: true
                        }
                    )
                ;
            var nodeShapes = shapes.filter(function(d) { return d.elt.get('type') !== 'topoedge';});
            nodeShapes.append('title');  // add title
            nodeShapes.append('text').classed('entity', true);  // add entity name text
            nodeShapes.append('text').classed('operator', true);  // add operator name text
            var edgeShapes = shapes.filter(function(d) { return d.elt.get('type') === 'topoedge';});
            edgeShapes.append('text').classed('weight', true); // add weight text
            // node drag
            var node_drag = this.force.drag
                .on(
                    'dragstart',
                    function (d) {
                        d3.event.sourceEvent.stopPropagation();
                        _this.dragging = true;
                        _this.panel.select(this).classed("dragging", true);
                    }
                )
                .on(
                    'dragend',
                    function (d) {
                        _this.dragging = false;
                        _this.panel.select(this).classed("dragging", false);
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
                .transition()
                    .duration(this.duration)
                    .style('opacity', 0)
                        .remove()
            ;
        },

        /**
        * called during node updating.
        */
        updateNodes: function(nodes) {
            var topology = this.d3_graph.nodes[0];
            var _this = this;
            nodes
                .select('path')
                    .classed(
                        {
                            'ndok': function(d) {return !d.elt.get('info').state;},
                            'ndminor': function(d) {return d.elt.get('info').state === 1;},
                            'ndmajor': function(d) {return d.elt.get('info').state === 2;},
                            'ndcritical': function(d) {return d.elt.get('info').state === 3;}
                        }
                    )
                    .attr(
                        'd',
                        function(d, i) {
                            var f = d3.svg.symbol();
                            if (d.x === undefined) {
                                d.x = 0; d.y = 0;
                            }
                            switch(d.elt.get('type')) {
                                case 'topo':
                                    f = f.type('circle');
                                    if (d.id === _this.graph.get('cid')) {
                                        f = f.size(30 * 64);
                                    } else {
                                        f = f.size((d._weight>=1? d._weight : 1) * 64);
                                    }
                                    break;
                                case 'topoedge': f = f.type('diamond').size(d._weight * 64); break;
                                case 'toponode': f = f.type('square').size((d._weight>=1? d._weight : 1) * 64); break;
                                default: f = f.type('triangle-down');
                            }
                           var result = f(d, i);
                           return result;
                        }
                    )
            ;
            // update a title which is the entity id or graph element id
            nodes.select('title').text(
                function(d) {
                    var result = '';
                    var info = d.elt.get('info');
                    if (info !== undefined) {
                        var entity = info.entity;
                        if (entity !== undefined) {
                            result += entity;
                        }
                    }
                    return result;
                }
            );
            // update an entity id which is the entity id or graph element id
            nodes.select('.entity').text(
                function (d) {
                    var result = '';
                    var info = d.elt.get('info');
                    if (info && info.label) {
                        result += info.label;
                    } else {
                        var entity = d.entity;
                        if (entity !== undefined) {
                            result += entity.cid;
                        }
                    }
                    return result;
                }
            );
            nodes.select('.operator').text(
                function(d) {
                    var result = '';
                    var info = d.elt.get('info');
                    if (info !== undefined) {
                        var operator = info.task;
                        if (operator) {
                            var operator_id = operator.id || operator.cid || operator;
                            if (operator_id === 'canopsis.task.condition.condition') {
                                operator = operator.params.condition;
                                operator_id = operator.id || operator.cid || operator;
                            }
                            operator_id = operator_id.substring(operator_id.lastIndexOf('.') + 1);
                            result += operator_id;
                        }
                        if (result === 'change_state') {  // do not display default operator
                            result = '';
                        }
                    }
                    return result;
                }
            );
            nodes.select('.weight').text(
                function(d) {
                    var result = '';
                    var weight = d.elt.get('weight');
                    if (weight !== undefined && weight !== 1) {
                        result += weight;
                    }
                    return result;
                }
            );
        },

        /**
        * called during link addition.
        */
        addLinks: function(links) {
            var _this = this;
            // create the graphical element
            var shapes = links
                .append('line') // line representation
                    .classed(
                        {
                            shape: true, // set shape link
                            link: true, // set class link
                            targetLink: function(d) { return !d.isSource;}
                        }
                    )
                    .attr('id', function(d) {return d.id;})
                    .on('click', function() {return _this.clickAction(this);})
                    .on('mouseout', function() {_this.outAction(this);})
                    .on('mousemove', function() {_this.moveAction(this);})
                    .on('mouseover', function() { _this.overAction(this);})
            ;
        },

        /**
        * called during link deletion.
        */
        delLinks: function(links) {
            links
                .transition()
                    .duration(this.duration)
                    .style('opacity', 0)
                        .remove()
            ;
        },

        /**
        * called during link updating.
        */
        updateLinks: function(links) {
            var _this = this;
            links
                .classed(
                    {
                        directed: function(d) {
                            return d.elt.get('directed');
                        },
                        'lnok': function(d) {return !d.elt.get('info').state;},
                        'lnminor': function(d) {return d.elt.get('info').state === 1;},
                        'lnmajor': function(d) {return d.elt.get('info').state === 2;},
                        'lncritical': function(d) {return d.elt.get('info').state === 3;}
                    }
                )
                .style(
                    {
                        'stroke-width': function(d) {
                            var result = 1;
                            var weight = d.elt.get('weight');
                            if (weight !== undefined) {
                                result += (weight - 1);
                            }
                            return result;
                        },
                        'marker-end': function(d) {
                            return (d.elt.get('directed') && !d.isSource)? "url(#markerArrow)" : "";
                        }
                    }
                )
            ;
        },

        moveAction: function(shape) {
            if (d3.event.defaultPrevented) return;
            this.overAction(shape);
        },

        overAction: function(shape) {
            if (d3.event.defaultPrevented) return;
            var data = shape.__data__;
            if (data !== undefined) {
                d3_shape = d3.select(shape);
                d3_shape.classed('over', true);
            }
            if (this.source !== null) {
                console.log(data);
                var coordinates = data? [data.x, data.y] : this.coordinates();
                /*this.tmpLink.attr(
                    {
                        x2: coordinates[0],
                        y2: coordinates[1]
                    }
                )
                if (this.checkTargetLink(shape.__data__)) {
                    this.tmpLink.attr(
                        {
                            id: 'tmpLink'
                        }
                    )
                } else {
                    this.tmpLink.attr(
                        {
                            id: 'wrongTmpLink'
                        }
                    )
                }*/
            }
        },

        /**
        * Check if a shape is a good target for a new link.
        *
        * @param shape target shape.
        */
        checkTargetLink: function(data) {
            var result = (data === undefined || (data.elt.get('type') !== 'topoedge' && data.id !== this.source.id));
            return result;
        },

        outAction: function(shape) {
            if (d3.event.defaultPrevented) return;
            d3.select(shape).classed('over', false);
        },

        dblClickAction: function(shape) {
            if (d3.event.defaultPrevented) return;
            d3.event.stopPropagation();
            get(this, 'controller').edit(shape.__data__);
            this.destroyToolBox();
        },

        clickAction: function(shape) {
            if (d3.event.defaultPrevented) return;
            d3.event.stopPropagation();
            this.showToolBox(shape);
        },


        /**
        * Convert a vertice to D3 node.
        *
        * @param vertice vertice to convert.
        * @param edit edit configuartion with a form.
        * @param success edition success callback. Takes record in parameter.
        * @param failure edition failure callback. Takes record in parameter.
        * @return new vertice record.
        */
        vertice2D3Node: function(vertice, edit, success, failure, context) {
            // define a callback
            function processRecord(record) {
                // save result in model
                var record_id = record.get('cid');
                this.graph._delts[record_id] = record;
                var result = this.record2Node(record);
                if (success !== undefined) {
                    success.call(context, record);
                }
                return result;
            }
            // initialize the vertice data
            var record = get(this, 'controller').toRecord(vertice, edit, processRecord, failure, this);
            if (!edit) {
                var result = processRecord.call(this, record);
            }
            return result
        },

        /**
        * Add a link.
        *
        * @param source source link.
        * @param target optional target link.
        * @param edit enable link properties edition.
        * @param success edition success callback. Takes record in parameter.
        * @param failure edition failure callback. Takes record in parameter.
        * @param callback execution context.
        * @return new edge node.
        */
        addLink: function(source, target, edit, success, failure, context) {
            var result = null;
            var source_type = source.elt.get('_type');
            // ensure source and target are ok
            if (source.id === this.graph.get('cid') || !this.checkTargetLink(target)) {
                throw new Exception('Wrong parameters');
            }
            // get a target
            if (target === undefined) {
                // create a callback
                var coordinates = this.coordinates();
                function callback(record) {
                    this.addLink(source, record.d3_elt);
                    var target = record.d3_elt;
                    target.px = target.x = coordinates[0];
                    target.py = target.y = coordinates[1];
                    target.fixed = true;
                    if (success !== undefined) {
                        success.call(context, record);
                    }
                }
                // create a node if target does not exist
                target = this.vertice2D3Node(undefined, edit, callback, failure, this);
                if (edit) return;
            }
            // get result
            // if source is an edge, then edge is source
            if (source_type === 'edge') {
                result = source;
                // and add right now the target
                result.elt.get('targets').push(target.id);
                this.weaveLinks(result);
            } else { // else create a new edge
                function callback2(record) {
                    var edge = record.d3_elt;
                    this.weaveLinks(edge);
                    if (success !== undefined) {
                        success.call(context, record);
                    }
                }
                var edge = this.vertice2D3Node(
                    {
                        type: get(this, 'controller').edge_elt_type,
                        sources: [source.id],
                        targets: [target.id],
                        weight: 1,
                        directed: true,
                        _type: 'edge',
                        _cls: get(this, 'controller').default_edge_cls
                    },
                    edit,
                    callback2,
                    failure,
                    this
                );
                if (!edit) {
                    callback2.call(this, edge.elt);
                }
            }
            return result;
        },

        /**
        * Create a new toolbox item with a name, a symbol and a transformation.
        * @param name toolbox item name
        * @param symbol see d3.svg.symbol().type().
        * @param transform transformation attribute.
        */
        newToolBoxItem: function(name, symbol, transform) {
            var result = {
                name: name,
                symbol: d3.svg.symbol().type(symbol),
                transform: transform,
                type: 'toolbox'
            };
            return result
        },

        /**
        * Get toolbox names by node.
        *
        */
        getToolBoxItems: function(data) {
            var result = [];
            if (this.source !== null) {
                result.push(
                    this.newToolBoxItem('close', 'triangle-down'),
                    this.newToolBoxItem('cancel', 'cross', 'rotate(45)'),
                    this.newToolBoxItem('add', 'cross')
                )
            } else {
                // default result
                result.push(
                    this.newToolBoxItem('close', 'triangle-down')
                );

                if (data !== undefined && data.elt) { // is it a node
                    var info = data.elt.get('info');
                    if (info) {
                        if (info.entity) {
                            result.push(this.newToolBoxItem('eventpool', 'triangle-up'))
                        }
                    }
                    if (this.selected[data.id] !== undefined) {
                        result.push(this.newToolBoxItem('unselect', 'diamond'));
                    } else {
                        result.push(this.newToolBoxItem('select', 'diamond'));
                    }
                    if (data.fixed) {
                        result.push(this.newToolBoxItem('unlock'));
                    } else {
                        result.push(this.newToolBoxItem('lock'));
                    }
                    if (data.id !== this.graph.get('cid')) { // all nodes but topology
                        result.push(
                            this.newToolBoxItem('link', 'triangle-up'), // new link
                            this.newToolBoxItem('delete', 'cross', 'rotate(45)') // elt deletion
                        );
                    }
                    //if (data.elt.get('type') !== 'topology') { // all elts but topologies
                        result.push(this.newToolBoxItem('edit', 'square')); // edit elt
                    //}
                } else {
                    result.push(
                        this.newToolBoxItem('save', 'square'), // save model
                        this.newToolBoxItem('add', 'cross') // add elt
                    );
                }
            }

            return result;
        }
    });

    var widget = WidgetFactory('topology', {

        viewMixins: [
            TopologyViewMixin
        ],

        graph: null, // canopsis graph model

        graph_type: 'topology', // graph type
        graph_id: null,  // graph id

        width: null,  // view width
        height: null,  // view height

        graph_cls: 'canopsis.topology.elements.Topology', // default graph class

        default_vertice_cls: 'canopsis.topology.elements.TopoNode', // default vertice class
        default_edge_cls: 'canopsis.topology.elements.TopoEdge', // default edge class

        business: null, // business controller

        graph_div: null, // graph div markup

        graph_elt_type: 'topo', // graph elt type
        vertice_elt_type: 'toponode', // vertice elt type
        edge_elt_type: 'topoedge', // edge elt type

        layout: 'natural', // layout

        init: function() {
            this._super.apply(this, arguments);
        },

        /**
        * Get request server url to get graph.
        */
        getSendEventUrl: function() {
            result = '/event';

            return result;
        },

        /**
        * Update node information related to backend activity.
        */
        updateNode: function(node) {
            // save node

            // process node
            var _url = this.getSendEventUrl();
            var _this = this;
            var event = {
                'connector': 'canopsis',
                'connector_name': 'engine',
                'event_type': node.get('type'),
                'state': node.get('info').state ? node.get('info').state : 0,
                'state_type': 1,
                'cid': node.get('cid'),
                'type': nod.get('type')
            };
            var type = node.get('_type');
            switch(type) {
                case 'graph':
                    event.source_type = 'component';
                    event.component = event.cid;
                    break;
                case 'vertice':
                    event.source_type = 'resource';
                    event.component = this.graph_id;
                    event.resource = event.cid;
                    break;
                default:
                    console.error('type ' + type + ' can not be updated.');
            }
            var promise = new Ember.RSVP.Promise(function(resolve, reject) {
                $.ajax(
                    {
                        url: _url,
                        type: 'POST',
                        data: {
                            'event': event
                        }
                    }
                ).then(resolve, reject);
            });
            promise.then(success, failure);
        },

        /**
        * Get request server url to get graph.
        */
        getGraphUrl: function() {
            result = '/' + this.graph_type + '/graphs/';

            return result;
        },

        /**
        * Get graph with its elements from a foreign server.
        */
        getGraphFromServer: function(success, failure) {
            var _url = this.getGraphUrl();
            var _this = this;
            var promise = new Ember.RSVP.Promise(function(resolve, reject) {
                $.ajax(
                    {
                        url: _url,
                        type: 'POST',
                        data: {
                            'ids': _this.graph_id,
                            'add_elts': true
                        }
                    }
                ).then(resolve, reject);
            });
            promise.then(success, failure);
        },

        /**
        * Get entities from a foreign server.
        * @param entity_ids list of entity ids from where get entities.
        * @param success handler to request success.
        * @param failure handler to request failure.
        */
        getEntitiesFromServer: function(entity_ids, success, failure) {
            if (entity_ids.length > 0) {
                var promise = new Ember.RSVP.Promise(function(resolve, reject) {
                    $.ajax(
                        {
                            url: '/context/ids',
                            type: 'POST',
                            data: {
                                'ids': JSON.stringify(entity_ids),
                            }
                        }
                    ).then(resolve, reject);
                });
                promise.then(success, failure);
            } else {
                success({total: 0});
            }
        },

        /**
        * Get request server url to put graph.
        */
        putGraphUrl: function() {
            result = '/' + this.graph_type + '/elts/';

            return result;
        },

        /**
        * Put graph with its elements to a foreign server.
        * @param success handler to request success.
        * @param failure handler to request failure.
        */
        putGraphToServer: function(success, failure) {
            var _url = this.putGraphUrl();
            var graph = this.toElt(this.graph);
            graph.elts = [];
            var elts = [graph];
            Object.keys(this.graph._delts).forEach(
                function(elt_id) {
                    var record = this.graph._delts[elt_id];
                    // push only nodes and edges
                    if (record.get('type') !== 'topo') {
                        var elt = this.toElt(record);
                        elts.push(elt);
                        graph.elts.push(elt.cid);
                    }
                },
                this
            );
            var promise = new Ember.RSVP.Promise(function(resolve, reject) {
                $.ajax(
                    {
                        url: _url,
                        type: 'PUT',
                        data: {elts: JSON.stringify(elts)}
                    }
                ).then(resolve, reject);
            });
            promise.then(success, failure);
        },

        /**
        * display nodes in the widget
        */
        findItems: function() {
            // get graph id and graph type
            this.graph_type = this.get('model.graph_type');
            if (!this.graph_type) this.graph_type = 'topology';
            this.graph_id = this.get('model.graph_id');
            if (!this.graph_id) this.graph_id = 'test';

            // load business
            // business_name = this.graph_type + 'Component';
            // this.business = eval(business_name);

            var me = this;
            if (this.graph_id !== undefined) {
                // use graph id in getNodes method in order to get nodes
                this.getGraphFromServer(
                    function(result) {
                        // get graph or a default graph
                        var graph = null;
                        if (result.total === 0) {
                            graph = {
                                _delts: {},
                                type: me.graph_elt_type,
                                _type: 'graph',
                                _id: me.graph_id,
                                cid: me.graph_id,
                                _cls: me.graph_cls,
                                info: {
                                    task: {
                                        cid: 'canopsis.topology.rule.action.worst_state',
                                        params: {
                                            update_entity: true
                                        }
                                    }
                                },
                                elts: []
                            };
                        } else {
                            graph = result.data[0];
                            // if old graph exists
                            if (me.graph !== null) {
                                // delete old elements
                                var elts_to_delete = [];
                                Object.keys(me.graph._delts).forEach(
                                    function(elt_id) {
                                        // in case of old element
                                        if (graph._delts[elt_id] === undefined) {
                                            var elt = me.graph._delts[elt_id];
                                            elts_to_delete.push(elt.d3_elt);
                                        }
                                    },
                                    this
                                );
                                me.delete(elts_to_delete);
                            }
                        }
                        // convert graph such as a record
                        me.graph = me.toRecord(graph);
                        // refresh the view
                        me.trigger('refresh');
                    }
                );
            }
        },

        /**
        * return unique id.
        */
        uuid: function() {
            return '' + Math.random();
        },

        /**
        * Edit input elt properties.
        *
        * @param data data to edit.
        */
        edit: function(data, success, failure, context) {
            function callback(record) {
                this.trigger('refresh');
                if (success !== undefined) {
                    success.call(context, record);
                }
            }
            var elt = data.elt;
            this.editRecord(elt, callback, failure, this);
        },

        /**
        * Delete a selected element or all elements related to input data.
        * @param data array of data to delete if not undefined.
        */
        delete: function(datum, doNotUpdateModel) {
            //ensure data is an array of data
            if (! Array.isArray(datum)) {
                datum = [datum];
            }
            // arrays of link/node to delete once at the end for better complexity time reasons
            var links_data_to_delete = [];
            var nodes_data_to_delete = [];

            datum.forEach(
                function(data) {
                    // forbid to delete the main topology
                    if (data.id === this.graph.get('cid')) {
                        console.error('Impossible to delete the main topology');
                    } else if (data.isSource !== undefined) { // is data a target link ?
                        var key = data.isSource? 'sources' : 'targets';
                        var key_s = key.substring(0, key.length - 1);
                        // delete from sources/targets
                        var bound_nodes = data.elt.get(key);
                        var neighbour = data[key_s];
                        var index = bound_nodes.indexOf(neighbour.id);
                        bound_nodes.splice(index, 1);
                        // delete data from view
                        delete data.elt.d3_elt[key][neighbour.id][data.id];
                        // reference link position in d3_graph.links
                        links_data_to_delete.push(data);
                    } else { // data is a node/edge/topology
                        // add data into nodes_data_to_delete for future cleaning
                        nodes_data_to_delete.push(data);
                        // delete nodes
                        if (data.elt.get('_type') === 'edge') { // in case of an edge
                            // get all link_data in order to remove them
                            ['sources', 'targets'].forEach(
                                function(key) {
                                    var neighbours = data[key];
                                    Object.keys(neighbours).forEach(
                                        function(neighbour_id) {
                                            var links_by_id = neighbours[neighbour_id];
                                            Object.keys(links_by_id).forEach(
                                                function(link_id) {
                                                    var link_data = links_by_id[link_id];
                                                    // add link in the right to deleting them later
                                                    links_data_to_delete.push(link_data);
                                                }
                                            );
                                        }
                                    );
                                },
                                this
                            );
                        } else {
                            // delete links from edges
                            // let's iterate on dict of data by id in the view
                            var nodes = this.d3_graph.nodes;
                            var elts_to_delete = []; // for time execution reason, we save in memory all elts to delete in order to delete them once at the end
                            nodes.forEach(
                                function(edge) {
                                    // if elt is an edge
                                    if (edge.elt.get('_type') === 'edge') {
                                        // iterate on sources/targets
                                        ['sources', 'targets'].forEach(
                                            function(key) {
                                                var links_by_id = edge[key][data.id];
                                                if (links_by_id !== undefined) {
                                                    var link_ids = Object.keys(links_by_id);
                                                    var tmp_elts_to_delete = [];
                                                    for (var index=0; index<link_ids.length; index++) {
                                                        var link_id = link_ids[index];
                                                        var link_data = links_by_id[link_id];
                                                        if (link_data.isSource) {
                                                            // if source, add edge and all links to delete
                                                            tmp_elts_to_delete = [edge];
                                                            break;
                                                        } else {
                                                            // if not source, add target link only
                                                            tmp_elts_to_delete.push(link_data);
                                                        }
                                                    }
                                                    // fill elts_to_delete with tmp_elts_to_delete
                                                    tmp_elts_to_delete.forEach(
                                                        function(d) {
                                                            elts_to_delete.push(d);
                                                        }
                                                    );
                                                }
                                            },
                                            this
                                        );
                                    }
                                },
                                this
                            );
                            // delete once edges and links
                            if (elts_to_delete.length > 0) {
                                // without update the model at the end
                                this.delete(elts_to_delete, true);
                            }
                        }
                    }
                },
                this
            );
            // delete link shapes from view once
            if (links_data_to_delete.length > 0) {
                links_data_to_delete.sort(function(a, b) { return a.view_pos - b.view_pos;});
                links_data_to_delete.forEach(
                    function(d, i) {
                        // delete link from view
                        var pos = d.view_pos - i;
                        this.d3_graph.links.splice(pos, 1);
                        delete this.d3_graph.data_by_id[d.id];
                    },
                    this
                );
                // delete shapes
                //var links_to_delete = this.panel.selecAll('.'+this.link_class).data(links_data_to_delete, function(d) { return d.id});
                //this.delLinks(links_to_delete);
                // update view pos
                for(var pos = links_data_to_delete[0].view_pos; pos < this.d3_graph.links.length; pos++) {
                    this.d3_graph.links[pos].view_pos = pos;
                };
            }
            // delete node shapes from view once
            if (nodes_data_to_delete.length > 0) {
                nodes_data_to_delete.sort(function(a, b) { return a.index - b.index;});
                nodes_data_to_delete.forEach(
                    function(d, i) {
                        // delete node from model
                        delete this.graph._delts[d.id];
                        // and from view
                        index = d.index - i;
                        this.d3_graph.nodes.splice(index, 1);
                        delete this.d3_graph.data_by_id[d.id];
                    },
                    this
                );
                // delete shapes
                //var nodes_to_delete = this.panel.selectAll('.'+this.node_class).data(nodes_data_to_delete, function(d) { return d.id});
                //this.delNodes(nodes_to_delete);
                // update indexes
                for (index=nodes_data_to_delete[0].index; index < this.d3_graph.nodes.length; index++) {
                    this.d3_graph.nodes[index].index = index;
                }
            }
            // update model if asked
            if (!doNotUpdateModel) {
                this.trigger('refresh');
            }
        },

        /**
        * Select input data in order to get detail informations.
        *
        * @param data array of data.
        */
        select: function(data) {
            if (! Array.isArray(data)) {
                data = [data];
            }
            data.forEach(
                function(d) {
                    this.selected[d.id] = d;
                },
                this
            )
            this.refreshSelectedShapes();
        },

        /**
        * Unselect input data in order to get detail informations.
        *
        * @param data array of data.
        */
        unselect: function(data) {
            if (! Array.isArray(data)) {
                data = [data];
            }
            data.forEach(
                function(d) {
                    delete this.selected[d.id];
                },
                this
            );
            this.refreshSelectedShapes();
        },

        /**
        * Convert a record into a graph element.
        *
        * @param record record to convert into a graph element.
        */
        toElt: function(record) {
            var result = {
                _id: record.get('_id'),
                cid: record.get('cid'),
                _type: record.get('_type'),
                type: record.get('type'),
                _cls: record.get('_cls'),
                info: record.get('info')
            };
            var record_type = record.get('_type');
            if (record_type === 'edge') {
                result.weight = record.get('weight');
                result.sources = record.get('sources');
                result.targets = record.get('targets');
                result.directed = record.get('directed');
            }
            // save coordinates in the dictionary of shape.graph_id
            if (result.info.shape === undefined) {
                result.info.shape = {};
            }
            result.info.shape[this.graph_id] = {
                x: record.d3_elt.x,
                y: record.d3_elt.y,
                px: record.d3_elt.px,
                py: record.d3_elt.py,
                fixed: record.d3_elt.fixed
            }
            return result;
        },

        /**
        * Convert input elt to a record, or returns it if already a record.
        *
        * @param elt element to convert. If undefined, get default vertice element.
        * @param edit edit record with a form if true.
        * @param success edition success callback. Takes record in parameter.
        * @param failure edition failure callback. Takes record in parameter.
        */
        toRecord: function(elt, edit, success, failure, context) {
            var result = elt;
            if (!elt) {
                var uuid = this.uuid();
                elt = {
                    _id: uuid,
                    cid: uuid,
                    type: this.vertice_elt_type,
                    _type: 'vertice',
                    _cls: this.default_vertice_cls,
                    info: {
                        entity: '',
                        operator: ''
                    },
                };
            }
            // if elt is a record
            if (elt.store === undefined) {
                if (elt.cid === undefined) {
                    var uuid = this.uuid();
                    elt.cid = uuid;
                    elt._id = uuid;
                    if (!elt._type) {
                        elt._type = 'vertice';
                        elt.type = this.vertice_elt_type;
                    }
                    if (!elt._cls) {
                        elt._cls = this.default_vertice_cls;
                    }
                    if (!elt.info) {
                        elt.info = {
                            entity: '',
                            operator: '',
                            state: 0
                        };
                    }
                }
                var result = dataUtils.getStore().createRecord(
                    elt.type,
                    elt
                );
            }
            if (edit) {
                this.editRecord(result, success, failure, context);
            }
            return result;
        },

        /**
        * Edit a record.
        *
        * @param record record to edit.
        * @param success edition success callback. Takes record in parameter.
        * @param failure edition failure callback. Takes record in parameter.
        */
        editRecord: function(record, success, failure, context) {
            // fill operator data from record
            var states = ['ok', 'minor', 'major', 'critical'];
            function get_short_id(task) {
                var task_id = task.cid || task;
                var lastIndex = task_id.lastIndexOf('.');
                var result = task_id.substring(lastIndex + 1);
                return result;
            }
            var info = record.get('info');
            if (info !== undefined) {
                // set entity
                var entity = info.entity;
                if (entity !== undefined) {
                    record.set('entity', entity);
                }
                // set label
                var label = info.label;
                if (label !== undefined) {
                    record.set('label', label);
                }
                var task = info.task;
                if (task !== undefined) {
                    var operator = task.cid || task;
                    if (operator !== undefined) {
                        var operator_name = get_short_id(task);
                        if (operator_name === 'condition') {  // at least / nok
                            var params = task.params;
                            if (params !== undefined) {
                                var condition = params.condition;
                                if (condition !== undefined) {
                                    var condition_name = get_short_id(condition.cid || condition);
                                    record.set('operator', condition_name);
                                    var cond_params = condition.params;
                                    if (cond_params !== undefined) {
                                        // set in_state
                                        if (condition_name === 'nok') {
                                            record.set('operator', 'nok');
                                        } else {
                                            var in_state = cond_params.state;
                                            var f = cond_params.f;
                                            if (f === 'canopsis.topology.rule.condition.is_nok') {
                                                in_state = 'nok';
                                            } else {
                                                if (in_state !== undefined) {
                                                    in_state = states[in_state];
                                                    record.set('in_state', in_state);
                                                }
                                            }
                                        }
                                        // set min_weight
                                        var min_weight = cond_params.min_weight;
                                        if (min_weight !== undefined) {
                                            record.set('min_weight', min_weight);
                                        }
                                        // set then_state
                                        var statement = params.statement;
                                        if (statement !== undefined) {
                                            var statement_name = get_short_id(statement);
                                            if (statement_name === 'change_state') {
                                                var statement_params = statement.params;
                                                if (statement_params !== undefined) {
                                                    var then_state = statement_params.state;
                                                    then_state = states[then_state];
                                                    record.set('then_state', then_state);
                                                }
                                            } else {
                                                var then_state = statement_name;
                                                record.set('then_state', then_state);
                                            }
                                        }
                                        // set else_state
                                        var _else = params._else;
                                        if (_else !== undefined) {
                                            var _else_name = get_short_id(_else);
                                            if (_else_name === 'change_state') {
                                                var _else_params = _else.params;
                                                if (_else_params !== undefined) {
                                                    var else_state = _else_params.state;
                                                    else_state = states[else_state];
                                                    record.set('else_state', else_state);
                                                }
                                            } else {
                                                var else_state = _else_name;
                                                record.set('else_state', else_state);
                                            }
                                        }
                                    }
                                }
                            }
                        } else {  // simple task
                            record.set('operator', operator_name);
                        }
                    }
                }
            }
            var recordWizard = formsUtils.showNew(
                'modelform',
                record,
                {inspectedItemType: record.get('type')}
            );
            recordWizard.submit.done(
                function(form) {
                    var info = record.get('info');
                    if (info !== undefined) {
                        var task = info.task;
                        if (task === undefined) {
                            info.task = {};
                            task = info.task;
                        }
                    } else {
                        info = {
                            task: {}
                        }
                        var task = info.task;
                    }
                    // set entity
                    var entity = record.get('entity');
                    if (entity !== undefined) {
                        info.entity = entity;
                    }
                    // set label
                    var label = record.get('label');
                    if (label !== undefined) {
                        info.label = label;
                    }
                    var operator = record.get('operator');
                    switch(operator) {
                        case 'change_state':
                        case 'worst_state':
                        case 'best_state':
                            task.cid = 'canopsis.topology.rule.action.' + operator;
                            task.params = {};
                            break;
                        case '_all':
                        case 'at_least':
                        case 'nok':
                            task.cid = 'canopsis.task.condition.condition';
                            task.params = {};
                            task.params.condition = {
                                cid: 'canopsis.topology.rule.condition.' + operator,
                                params: {}
                            };
                            // set min_weight
                            if (operator === '_all') {
                                task.params.condition.params.min_weight = null;
                            } else {
                                var min_weight = record.get('min_weight');
                                task.params.condition.params.min_weight = min_weight;
                            }
                            // set in_state
                            var in_state = record.get('in_state');
                            if (in_state === 'nok') {
                                task.params.condition.params.f = 'canopsis.topology.rule.condition.is_nok';
                                task.params.condition.params.state = null;
                            } else {
                                task.params.condition.params.state = in_state;
                            }
                            // set then_state
                            var then_state = record.get('then_state');
                            task.params.statement = {
                                cid: 'canopsis.topology.rule.action.',
                                params: {}
                            };
                            switch(then_state) {
                                case 'worst_state':
                                case 'best_state':
                                    task.params.statement.cid += then_state;
                                    break;
                                default:
                                    then_state = states.indexOf(then_state);
                                    task.params.statement.cid += 'change_state';
                                    task.params.statement.params.state = then_state;
                            }
                            // set else_state
                            var else_state = record.get('else_state');
                            task.params._else = {
                                cid: 'canopsis.topology.rule.action.',
                                params: {}
                            };
                            switch(else_state) {
                                case 'worst_state':
                                case 'best_state':
                                    task.params._else.cid += else_state;
                                    break;
                                default:
                                    else_state = states.indexOf(else_state);
                                    task.params._else.cid += 'change_state';
                                    task.params._else.params.state = else_state;
                            }
                            break;
                        default: break;
                    }
                    // update info
                    record.set('info', info);
                    record.save();
                    if (success !== undefined) {
                        success.call(context, record);
                    }
                }
            );
            recordWizard.submit.fail(
                function(form) {
                    if (failure !== undefined) {
                        failure.call(context, record);
                    }
                }
            );
        },

        actions: {
            save: function() {
                this.putGraphToServer();
            },
        }

    });

    return widget;
});
