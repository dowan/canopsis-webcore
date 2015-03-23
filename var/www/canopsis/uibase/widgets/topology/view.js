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
* View model
* ----------
*
* This widget uses 2 layers of models:
* - Dom element ---> view element (node and link).
* View elements are stored in the shapes_by_id dictionary where ids correspond to controller record ids.
* Dom element to view element: field __data__
* view element to canopsis record: using view id in controller.records_by_id.
* Both Dom and view elements have the same id.
*
* A view element contains such view properties:
* - hidden: if True, the element is not displayed.
* - fixed: if True, the element is not impacted by the auto-layout.
* - x, y: respective abscisse and ordinate coordinates.
*
* All view elements are saved in the property shapes_by_id.
* nodes and links properties are dedicated to the layout engine.
* The process begins updating the view model, then in drawing shapes.
* During update, records are retrieved form the model, and if existing id already exist in view model, the view keeps existing view properties (coordinates, etc.) and update business properties (dynamic weight, etc.).
* Drawing step can be fired by the 'redraw' event from the controller.
*
* Layout
* ------
*
* Several layouts are provided.
*
* All respect common properties:
* - size: screen size.
* - translate: translation information.
* - scale: zoom information.
*
* And specific properties are given in the 'layout' property:
* - type: a string value corresponding to the layout type among force, cluster, tree, pack and partition.
* - activated: a boolean value which specifies if the auto layout is activated.
* - {force, cluster, pack, partition, tree}: dedicated layout properties.
* - engine: auto layout engine.
*
* Therefore, if you want the current layout properties 'P', you have to do view.layout[view.layout.type].P.
*
* Toolbox
* -------
*
* A toolbox is provided in order to enrich interaction with the graph. Its instance is managed in the toolbox property. This last contains data or null if toolbox is not activated.
*/
define([
    'jquery',
    'd3',
    'jqueryui'
], function($, d3) {
    var get = Ember.get,
        set = Ember.set;

    var TopologyViewMixin = Ember.Mixin.create({

        shapes_by_id: {}, // dictionary of shapes by id

        nodes: [], // list of nodes
        links: [], // list of links

        node_class: 'node', // node class name
        link_class: 'link', // link class name
        edge_class: 'edge', // edge class name

        toolbox: null, // global toolbox which may be unique

        _layout: {
            type: 'force', // current layout type
            force: null,
            tree: null,
            cluster: null,
            partition: null,
            pack: null,
            activated: true, // if true, layout is activated,
            engine: null, // layout engine
        }, // current layout parameters

        panel: null, // display panel

        source: null, // source position in multi selection (link, multi-select, etc.)

        toolbox_gap: 50, // toolbox gap between shapes
        duration: 500, // transition duration in ms

        translate: [0, 0], // translation
        scale: 1, // layout scale

        _default_layout: {
            partition: {
                sort: function comparator(a, b) {
                    var result = d3.ascending(a.name, b.name);
                    return result;
                },
                children: function children(d) {
                    return d.sources;
                },
            }, // default pack layout parameters

            pack: {
                sort: function comparator(a, b) {
                    var result = d3.ascending(a.name, b.name);
                    return result;
                },
                children: function children(d) {
                    return d.sources;
                },
            }, // default pack layout parameters

            cluster: {
                separation: function separation(a, b) {
                    var result = (a.parent == b.parent ? 1 : 2) / a.depth;
                    return result;
                },
                nodeSize: null,
                sort: function comparator(a, b) {
                    var result = d3.ascending(a.name, b.name);
                    return result;
                },
                children: function children(d) {
                    return d.sources;
                },

            }, // default tree layout parameters

            tree: {
                separation: function separation(a, b) {
                    var result = (a.parent == b.parent ? 1 : 2) / a.depth;
                    return result;
                },
                nodeSize: null,
                sort: function comparator(a, b) {
                    var result = d3.ascending(a.name, b.name);
                    return result;
                },
                children: function children(d) {
                    return d.sources;
                },

            }, // default tree layout parameters

            force: {
                charge: -120, // charge
                chargeDistance: 500, // charge distance
                linkDistance: 20, // link distance
                linkStrength: 1, // link strength
                friction: 0.9, // friction
                theta: 0.8, // theta
                gravity: 0.1, // gravity
            }, // default force parameters
        }, // default layout parameters

        filter: function() {
            return this._filter;
        }.property('filter'),
        filterChanged: function() {
            this._filter = get(this, 'filter');
        }.observes('filter'),
        autoLayout: function() {
            return this._layout.activated;
        }.property('autoLayout'),
        autoLayoutChanged: function() {
            this._layout.activated = get(this, 'autoLayout');
            if (this._layout.activated) {
                this._layout.engine.start();
            } else {
                this._layout.engine.stop();
            }
        }.observes('autoLayout'),
        charge: function() {
            return this._layout[this._layout.type].charge;
        }.property('charge'),
        chargeChanged: function() {
            this._layout[this._layout.type].charge = this.get('charge');
            this._layout.engine.charge(this._layout[this._layout.type].charge);
        }.observes('charge'),
        chargeDistance: function() {
            return this._layout[this._layout.type].chargeDistance;
        }.property('chargeDistance'),
        chargeDistanceChanged: function() {
            this._layout[this._layout.type].chargeDistance = this.get('chargeDistance');
            this._layout.engine.chargeDistance(this._layout[this._layout.type].chargeDistance);
        }.observes('chargeDistance'),
        linkDistance: function() {
            return this._layout[this._layout.type].linkDistance;
        }.property('linkDistance'),
        linkDistanceChanged: function() {
            this._layout[this._layout.type].linkDistance = this.get('linkDistance');
            this._layout.engine.linkDistance(this._layout[this._layout.type].linkDistance);
        }.observes('linkDistance'),
        linkStrength: function() {
            return this._layout[this._layout.type].linkStrength;
        }.property('linkStrength'),
        linkStrengthChanged: function() {
            this._layout[this._layout.type].linkStrength = this.get('linkStrength');
            this._layout.engine.linkStrength(this._layout[this._layout.type].linkStrength);
        }.observes('linkStrength'),
        friction: function() {
            return this._layout[this._layout.type].friction;
        }.property('friction'),
        frictionChanged: function() {
            this._layout[this._layout.type].friction = this.get('friction');
            this._layout.engine.friction(this._layout[this._layout.type].friction);
        }.observes('friction'),
        theta: function() {
            return this._layout[this._layout.type].theta;
        }.property('theta'),
        thetaChanged: function() {
            this._layout[this._layout.type].theta = this.get('theta');
            this._layout.engine.theta(this._layout[this._layout.type].theta);
        }.observes('theta'),
        gravity: function() {
            return this._layout[this._layout.type].gravity;
        }.property('gravity'),
        gravityChanged: function() {
            this._layout[this._layout.type].gravity = this.get('gravity');
            this._layout.engine.gravity(this._layout[this._layout.type].gravity);
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
            // update the view
            this.updateModel();
        },

        /**
        * Update the view model related to model records.
        */
        updateModel: function() {
            // get global reference to this in updateModel function
            var me = this;
            // get record elements by id
            var records_by_id = get(this, 'controller').records_by_id;
            // add nodes and links in graph
            // contain nodes by entity_ids
            var nodes_by_entity_ids = {};
            /**
            * Save node related to entity ids in memory.
            */
            function saveRefToEntity(node) {
                var node_id = node.id;
                var info = records_by_id[node_id].get('info');
                // add reference between entity id and node
                if (info) {
                    var entity = info.entity;
                    if (entity !== undefined) {
                        if (nodes_by_entity_ids[entity] === undefined) {
                            nodes_by_entity_ids[entity] = [node];
                        } else {
                            nodes_by_entity_ids[entity].push(node);
                        }
                    }
                }
            };

            Object.keys(records_by_id).forEach(
                function(record_id) {
                    var record = records_by_id[record_id];
                    // get record shape from record
                    var record_shape = this.get_node(record);
                    // update its reference in shapes_by_id
                    this.shapes_by_id[record_id] = record_shape;
                    if (record.get('_type') === 'edge') {
                        // add links if record is an edge.
                        this.weaveLinks(record_shape);
                    } else {
                        // initialize weight
                        record_shape._weight = 1;
                    }
                    // register the node in memory
                    saveRefToEntity(record_shape);
                },
                this
            );

            // resolve weight
            this.nodes.forEach(
                function(node, i) {
                    var node_id = node.id;
                    var record = records_by_id[node_id];
                    if (record.get('_type') === 'edge') {
                        var source_id = record.get('sources')[0];
                        var source_node = this.shapes_by_id[source_id];
                        source_node._weight += record.get('weight');
                    }
                    node.index = i;
                    node.entity = undefined;
                },
                this
            );

            // resolve sources and targets in links
            this.links.forEach(
                function(link) {
                    if (typeof link.source === 'string') {
                        link.source = this.shapes_by_id[link.source];
                    }
                    if (typeof link.target === 'string') {
                        var parent_shape = this.shapes_by_id[link.target];
                        link.parent = link.target = parent_shape;
                    }
                },
                this
            );

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

        redraw: function() {
            // get global reference to this for inner functions
            var me = this;
            // calculate the right size
            var width = get(this, 'controller.model.width');
            if (!width) width = this.$().width();
            var height = get(this, 'controller.model.height');
            if (!height) height = width * 9 / 16;
            // get the right layout
            var layout_type = get(this, 'controller.model.layout');
            var layout = this._layout;
            layout.type = layout_type;
            // initialize the engine if necessary
            var engine = layout.engine;
            if (layout[layout_type] === null) {
                // initialize layout with default properties
                engine = layout.engine = d3.layout[layout_type]();
                layout[layout_type] = this._default_layout[layout_type];
            }
            // apply layout properties
            Object.keys(layout[layout_type]).forEach(
                function(layout_property_id) {
                    engine[layout_property_id](layout[layout_type][layout_property_id]);
                }
            );
            // apply size
            engine.size([width, height]);
            // get panel
            this.panel = d3.select(this.$('svg .panel')[0]);
            if (this.panel.size() === 0) {
                /**
                * zoom function.
                */
                function zoom() {
                    /*me.eventZoom = d3.event;
                    console.log(me.eventZoom);
                    if (d3.event.sourceEvent.type !== 'mousemove') {*/
                        if (!me.dragging) {
                            me.translate = d3.event.translate;
                            me.scale = d3.event.scale;
                            me.panel.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                        }
                    /*} else {
                        var translate = [d3.event.translate[0] * d3.event.scale, d3.event.translate[1] * d3.event.scale];
                        me.panel.attr("transform", "translate(" + translate + ")scale(" + d3.event.scale + ")");
                    }*/
                };
                function drag() {
                    var translate = [
                        me.translate[0] + d3.event.dx,
                        me.translate[1] + d3.event.dy
                    ];
                    me.translate = translate;
                    me.panel.attr('transform', 'translate(' + translate + ') scale(' + me.scale + ')');
                    me.panel.select('.overlay')
                        .attr(
                            {
                                'x': -translate[0],
                                'y': -translate[1]
                            }
                        )
                    ;
                };
                var drag = d3.behavior.drag()
                    //.on('drag',drag)
                    ;
                var zoom = d3.behavior.zoom()
                    //.translate([0, 0])
                    //.scale(1)
                    .scaleExtent([1.5, 8])
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
                        .classed(
                            {
                                panel: true
                            }
                        )
                        .attr(
                            {
                            //    transform: 'scale(1.5)'
                            }
                        )
                        .on('click', function(){ return me.clickAction(this); })
                        .on('mousemove', function() { return me.moveAction(this); })
                        //.on('mouseover', function() { return me.overAction(this);})
                        .on('mouseout', function() { return me.overAction(this); })
                        .on('dblclick', function() { return me.addHandler(); })
                        .call(zoom)
                        //.call(drag)
                ;
            }
            // recover translate and scale
            this.panel.attr("transform", "translate(" + this.translate + ")scale(" + this.scale + ")");

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
            // load nodes and links into engine layout
            engine.nodes(this.nodes).links(this.links);
            // get link model
            var link_model = this.panel.selectAll('.' + this.link_class)
                .data(this.links, function(link) {return link.id;});

            // process links to delete, add and update.
            var links_to_add = link_model.enter();
            this.addLinks(links_to_add);
            var links_to_update = link_model;
            this.updateLinks(links_to_update);
            var links_to_delete = link_model.exit();
            this.delLinks(links_to_delete);

            // get node model
            var node_model = this.panel.selectAll('.' + this.node_class)
                .data(this.nodes, function(node) { return node.id; });

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

            engine.on(
                'tick',
                function() {
                    // do something only if auto layout
                    if (layout.activated) {
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
                            .attr(
                                {
                                    "transform": function(d) {
                                        return "translate(" + d.x + "," + d.y + ")";
                                    }
                                }
                            )
                        ;
                    }
                }
            );
            // finish to run the layout
            if(layout.activated) {
                engine.start();
            }
        },

        /**
        * Weave edge links from a d3 elt.
        *
        * @param edge d3 graph edge.
        */
        weaveLinks: function(d3_edge) {
            var me = this;
            // save count of link_id per targets/sources
            var link_id_count = {};
            var records_by_id = get(this, 'controller').records_by_id;
            var id = d3_edge.id;
            var edge = records_by_id[id];
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
                                edge: d3_edge,
                                type: 'link',
                                isSource: isSource,
                                source: isSource? d : id,
                                target: (!isSource)? d : id,
                                id: get(this, 'controller').uuid(), // uuid
                                view_pos: this.links.length, // pos in view
                            };
                            // add in view
                            this.links.push(link);
                            this.shapes_by_id[link.id] = link;
                            // try to inject references to sources
                            var source = this.shapes_by_id[link.source];
                            if (source !== undefined) {
                                link.source = source;
                            }
                            // and targets
                            var target = this.shapes_by_id[link.target];
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
                            var link = this.shapes_by_id[link_id];
                            // delete from model
                            delete d3_edge[key][vertice_id][link_id];
                            // delete from view
                            delete this.shapes_by_id[link_id];
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
                        this.links.splice(d - i, 1);
                    }
                );
                this.links.forEach(
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
            var selected = get(this, 'controller').selected;
            if (selected.length > 0) {
                // get a list of 'selected' items
                var selected_shapes = this.panel.selectAll('.shapegroup')
                    .data(selected, function(d){ return d; });
                // select newly selected items
                selected_shapes.classed('selected', true);
                // unselect old selected
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
            var result = [1, 1];
            if (this.panel !== null) {
                result = d3.mouse(this.panel[0][0]);
            }
            return result;
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
            var me = this;
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
                                var x = coordinates[0] + Math.cos(length) * me.toolbox_gap;
                                var y = coordinates[1] + Math.sin(length) * me.toolbox_gap;
                                var translate = 'translate(' + x + ',' + y + ')';
                                var scale = 'scale(' + (1 / me.scale) + ')';
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
                .on('click', function(d){
                    me[d.name + 'Handler'](data, shape);
                    me.destroyToolBox();
                })
                .transition()
                    .style("opacity", 1) // show them
                    .attr( // and move them
                        {
                            transform: function(d, i) {
                                var length = 2 * i * Math.PI / toolbox_items.length;
                                var x = coordinates[0] + Math.cos(length) * me.toolbox_gap;
                                var y = coordinates[1] + Math.sin(length) * me.toolbox_gap;
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
        },
        editHandler: function(data) {
            d3.event.stopPropagation();
            get(this, 'controller').editRecord(data.id);
        },
        deleteHandler: function(data) {
            d3.event.stopPropagation();
            // ensure data is an array
            if (!Array.isArray(data)) {
                data = [data];
            }
            // save records to delete
            var records_to_del = [];
            var records_by_id = get(this, 'controller').records_by_id;
            data.forEach(
                function(d) {
                    var record = records_by_id[d.id];
                    // delete links
                    if (d.isSource !== undefined) {
                        var dest = d.isSource ? 'source' : 'target';
                        var dests = record.get(dest + 's');
                        var index = dests.indexOf(d[dest]);
                        dests.splice(index, 1);
                        // update the record
                        record.set(dest+'s', dests);
                    } else {  // push record in records to delete
                        records_to_del.push(record);
                    }
                }
            );
            if (records_to_del.length > 0) {
                get(this, 'controller').delete(records_to_del);
            }
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
        },
        addHandler: function(data) {
            d3.event.stopPropagation();
            if (this.source === null) { // add a new node
                function callback(record) {
                    this.get_node(record);
                }
                var controller = get(this, 'controller');
                var record = controller.newRecord(controller.vertice_elt_type, undefined, true, callback);
            } else {
                function success(record) {
                    get(this, 'controller').trigger('redraw');
                    this.removeTmpLink();
                }
                function failure(record) {
                    this.removeTmpLink();
                }
                this.addLink(this.source, data, true, success2, failure2, this);
            }
        },
        unselectHandler: function(data) {
            d3.event.stopPropagation();
            get(this, 'controller').unselect(data.id);
        },
        selectHandler: function(data) {
            d3.event.stopPropagation();
            get(this, 'controller').select(data.id);
        },
        unlockHandler: function(data) {
            d3.event.stopPropagation();
            this.lock(data);
        },
        lockHandler: function(data) {
            d3.event.stopPropagation();
            this.lock(data, true);
        },
        cancelHandler: function(data) {
            d3.event.stopPropagation();
            this.removeTmpLink();
        },
        eventpoolHandler: function(data) {
            document.location.href = "/eventpool/?" + data.elt.get('info').entity;
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
            var me = this;
            var records_by_id = get(this, 'controller').records_by_id;
            // create the graphical element
            var shapes = nodes
                .append('g')
                    .classed(
                        {
                            shapegroup: true,
                            node: true,
                            edge: function(d) {
                                var record = records_by_id[d.id];
                                return record.get('_type') === 'edge';
                            },
                            graph: function(d) {
                                var record = records_by_id[d.id];
                                return record.get('_type') === 'graph';
                            }
                        }
                    )
                    .attr(
                        {
                            id: function(d) {return d.id;}
                        }
                    )
                    .on('click', function() {return me.clickAction(this);})
                    .on('dblclick', function(){return me.dblClickAction(this);})  // add menu selection
                    .on('mouseover', function() {me.overAction(this);})
                    .on('mouseout', function() {me.outAction(this);})
                    .on('mousemove', function() {me.moveAction(this);})
                ;
            shapes
                .append('path')
                    .classed(
                        {
                            shape: true
                        }
                    )
                ;
            var nodeShapes = shapes.filter(function(d) {
                var record = records_by_id[d.id];
                return record.get('_type') !== 'edge';
            });
            nodeShapes.append('title');  // add title
            nodeShapes.append('text').classed('entity', true);  // add entity name text
            nodeShapes.append('text').classed('operator', true);  // add operator name text
            var edgeShapes = shapes.filter(function(d) {
                var record = records_by_id[d.id];
                return record.get('_type') === 'edge';
            });
            edgeShapes.append('text').classed('weight', true); // add weight text
            // node drag
            var node_drag = this._layout.engine.drag
                .on(
                    'dragstart',
                    function (d) {
                        d3.event.sourceEvent.stopPropagation();
                        me.dragging = true;
                        me.panel.select(this).classed("dragging", true);
                    }
                )
                .on(
                    'dragend',
                    function (d) {
                        me.dragging = false;
                        me.panel.select(this).classed("dragging", false);
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
            var me = this;
            var records_by_id = get(this, 'controller').records_by_id;
            var graph_id = get(this, 'controller.model.graph_id');
            nodes
                .select('path')
                    .classed(
                        {
                            'ndok': function(d) {
                                var record = records_by_id[d.id];
                                return !record.get('info').state;
                            },
                            'ndminor': function(d) {
                                var record = records_by_id[d.id];
                                return record.get('info').state === 1;
                            },
                            'ndmajor': function(d) {
                                var record = records_by_id[d.id];
                                return record.get('info').state === 2;
                            },
                            'ndcritical': function(d) {
                                var record = records_by_id[d.id];
                                return record.get('info').state === 3;
                            }
                        }
                    )
                    .attr(
                        'd',
                        function(d, i) {
                            var f = d3.svg.symbol();
                            if (d.x === undefined) {
                                d.x = 0; d.y = 0;
                            }
                            var record = records_by_id[d.id];
                            switch(record.get('_type')) {
                                case 'graph':
                                    f = f.type('circle');
                                    if (d.id === graph_id) {
                                        f = f.size(30 * 64);
                                    } else {
                                        f = f.size((d._weight>=1? d._weight : 1) * 64);
                                    }
                                    break;
                                case 'edge': f = f.type('diamond').size(d._weight * 64); break;
                                case 'vertice': f = f.type('square').size((d._weight>=1? d._weight : 1) * 64); break;
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
                    var record = records_by_id[d.id];
                    var info = record.get('info');
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
                    var record = records_by_id[d.id];
                    var info = record.get('info');
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
                    var record = records_by_id[d.id];
                    var info = record.get('info');
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
                    var record = records_by_id[d.id];
                    var weight = record.get('weight');
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
            var me = this;
            var diagonal = d3.svg.diagonal.radial()
    .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });
            // create the graphical element
            var shapes = links
                .append('path') // line representation
                    .classed(
                        {
                            shape: true, // set shape link
                            link: true, // set class link
                            targetLink: function(d) { return !d.isSource; }
                        }
                    )
                    .attr(
                        {
                            'id': function(d) { return d.id; },
                            'd': diagonal
                        }
                    )
                    .on('click', function() { return me.clickAction(this); })
                    .on('mouseout', function() {me.outAction(this);})
                    .on('mousemove', function() {me.moveAction(this);})
                    .on('mouseover', function() { me.overAction(this);})
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
            var me = this;
            var records_by_id = get(this, 'controller').records_by_id;
            links
                .classed(
                    {
                        directed: function(d) {
                            var record = records_by_id[d.edge.id];
                            return record.get('directed');
                        },
                        'lnok': function(d) {
                            var record = records_by_id[d.edge.id];
                            return !record.get('info').state;
                        },
                        'lnminor': function(d) {
                            var record = records_by_id[d.edge.id];
                            return record.get('info').state === 1;
                        },
                        'lnmajor': function(d) {
                            var record = records_by_id[d.edge.id];
                            return record.get('info').state === 2;
                        },
                        'lncritical': function(d) {
                            var record = records_by_id[d.edge.id];
                            return record.get('info').state === 3;
                        }
                    }
                )
                .style(
                    {
                        'stroke-width': function(d) {
                            var result = 1;
                            var record = records_by_id[d.edge.id];
                            var weight = record.get('weight');
                            if (weight !== undefined) {
                                result += (weight - 1);
                            }
                            return result;
                        },
                        'marker-end': function(d) {
                            var record = records_by_id[d.edge.id];
                            return (record.get('directed') && !d.isSource)? "url(#markerArrow)" : "";
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
            var record = records_by_id[data.id || data];
            var result = (data === undefined || (record.get('type') !== 'topoedge' && data.id !== this.source.id));
            return result;
        },

        outAction: function(shape) {
            if (d3.event.defaultPrevented) return;
            d3.select(shape).classed('over', false);
        },

        dblClickAction: function(shape) {
            if (d3.event.defaultPrevented) return;
            d3.event.stopPropagation();
            get(this, 'controller').editRecord(shape.__data__.id);
            this.destroyToolBox();
        },

        clickAction: function(shape) {
            if (d3.event.defaultPrevented) return;
            d3.event.stopPropagation();
            this.showToolBox(shape);
        },

        /**
        * Get a node from a record and register it in this.shapes_by_id and nodes.
        * If node does not exist, create it.
        *
        * @param record source record.
        * @return record node.
        */
        get_node: function(record) {
            // get record id
            var record_id = record.get('id');
            // get result in this memory
            var result = this.shapes_by_id[record_id];
            // get graph_id
            var graph_id = get(this, 'controller.model.graph_id');
            // get node from db
            var record_node = undefined;
            var view = record.get('info').view;
            if (view !== undefined) {
                record_node = view[grap_id];
            }
            // create a new node if it does not exist
            if (result === undefined) {
                // if old node does not exist
                if (record_node === undefined) {
                    // get current mouse coordinates
                    var coordinates = this.coordinates();
                    // apply mouse coordinates to the result
                    result = {
                        fixed: false, // new node is fixed
                        hidden: false, // and displayed,
                        id: record_id, // with record id
                        index: this.nodes.length,
                        type: record.get('type')
                    }
                    // add node in nodes
                    this.nodes.push(result);
                } else { // result becomes old node
                    result = record_node;
                }
                // update this shapes_by_id
                this.shapes_by_id[record_id] = result;
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
            var graph_id = get(this, 'controller.model.graph_id');
            // ensure source and target are ok
            if (source.id === graph_id || !this.checkTargetLink(target)) {
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
                target = this.get_node(undefined, edit, callback, failure, this);
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
                var edge = this.get_node(
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
            var graph_id = get(this, 'controller.model.graph_id');
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

                if (data !== undefined && data.type !== 'link') { // is it a node
                    var record = get(this, 'controller').records_by_id[data.id];
                    var info = record.get('info');
                    if (info) {
                        if (info.entity) {
                            result.push(this.newToolBoxItem('eventpool', 'triangle-up'))
                        }
                    }
                    if (get(this, 'controller').selected[data.id] !== undefined) {
                        result.push(this.newToolBoxItem('unselect', 'diamond'));
                    } else {
                        result.push(this.newToolBoxItem('select', 'diamond'));
                    }
                    if (data.fixed) {
                        result.push(this.newToolBoxItem('unlock'));
                    } else {
                        result.push(this.newToolBoxItem('lock'));
                    }
                    if (data.id !== graph_id) { // all nodes but topology
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
                        this.newToolBoxItem('add', 'cross') // add elt
                    );
                }
            }

            return result;
        }
    });

    return TopologyViewMixin;

});
