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
    'jquery',
    'app/lib/factories/widget',
    'd3',
    'app/lib/loaders/schemas',
    'app/lib/utils/forms',
    'app/lib/utils/data'
], function($, WidgetFactory, d3, schemas, formsUtils, dataUtils) {
    var get = Ember.get,
        set = Ember.set;

    var GraphViewMixin = Ember.Mixin.create({

        node_class: 'node', // node class name
        link_class: 'link', // link class name

        toolbox: null, // global toolbox which may be unique

        force: null, // d3 force element for auto display

        panel: null, // display panel

        /*
        didInsertElement: function() {
            var graph_div = this.$('div .graph');
            // call controller.findItems function when the template is loaded
            if (graph_div !== undefined) {
                // save reference to controller
                this.controller = this.get('controller');
                this.controller.findItems();
                this.stopRefresh();
            }
            this._super.apply(this, arguments);
        },*/

        rerender: function() {
            this._super.apply(this, arguments);
            this.d3_graph = this.controller.d3_graph;
            var width = this.$().width(), height = this.$().height();
            // apply force behavior
            this.force = d3.layout.force().charge(-120).linkDistance(30).size([width, height]);
            // select svg
            this.panel = d3.select('#' + this.elementId + ' svg g');
            if (this.panel.size() === 0) {
                /**
                * zoom function.
                */
                function zoom() {
                    this.panel.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                }
                var zoom = d3.behavior.zoom()
                    //.scaleExtent([1, 8])
                    .on('zoom', zoom)
                ;
                var _this = this;
                // or create it if it does not exist
                this.panel = d3.select('#' + this.elementId + ' svg')
                    .attr('width', width)
                    .attr('height', height)
                    .append('g')
                        .on('click', function(){return this.clickAction(_this);})
                        .call(zoom)
                ;
            }

            // apply an overlay for better graph zooming and selection
            var overlay = this.panel.select('.overlay');
            if (overlay.size() === 0) {
                this.panel
                    .append("rect")
                        .classed("overlay", true)
                        .attr("width", width)
                        .attr("height", height)
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

            this.force.on('tick', function() {
                //this.panel.selectAll('.link')
                link_model
                    .attr('x1', function(d) {return d.source.x;})
                    .attr('y1', function(d) {return d.source.y;})
                    .attr('x2', function(d) {return d.target.x;})
                    .attr('y2', function(d) {return d.target.y;})
                ;
                //this.panel.selectAll('.node')
                node_model
                    .attr('cx', function(d) {return d.x;})
                    .attr('cy', function(d) {return d.y;})
                ;
            });
            this.force.start();
        },

        /**
        * Refresh the view related to selected data.
        *
        * If node is already selected, unselect it.
        *
        * @param widget related caller.
        * @param node
        */
        refreshSelectedShapes: function() {
            var selected = this.controller.selected;
            if (selected.length > 0) {
                // get a list of 'selected' items
                var selected_shapes = this.panel.select('.shape')
                    .data(selected, function(d){return d.id;});
                // select newly selected items
                selected_shapes.enter().transition().duration(300).classed('selected', true);
                // unselect unselected items
                selected_shapes.exit().transition().duration(300).classed('selected', false);
            }
        },


        /**
        * Show tool box related to input shape.
        */
        showToolBox: function(shape) {
            if (d3.event.preventDefault()) {
                return;
            }
            // if toolbox already exists, destroy it.
            if (this.toolbox !== null) {
                this.destroyToolBox();
            }
            // add a new toolbox with specific node toolbox items
            var toolbox_items = this.controller.getToolBoxItems(shape.__data__);
            // get coordinates
            var coordinates = d3.mouse(shape);
            var _this = this;
            // create generic toolbox
            this.toolbox = this.panel.select(shape)
                .data(toolbox_items, function(d) {return d;}).enter()
                    // add circles
                    .append('circle')
                        // with toolbox class
                        .classed('toolbox', true)
                        .attr(
                            {
                                class: function(d) {return d+'-tb';}, // with specific class
                                cx: function(d, i) {return coordinates[0] + Math.cos(i) * d.weight;},
                                cy: function(d, i) {return coordinates[1] + Math.sin(i) * d.weight;},
                                r: 2
                            }
                        )
                        // attach handlers
                        .on('click', function(d){return _this[d+'Handler'](_this)});
                    ;
            this.toolbox
                // add text
                .text(function(d) {return d;})
            ;
        },

        /**
        * Destroy toolbox.
        */
        destroyToolBox: function() {
            // delete old toolbox
            if (this.toolbox !== null) {
                this.toolbox
                    .transition()
                        .duration(300)
                        .remove()
                    ;
            }
        },

        closeHandler: function(view) {
            view.destroyToolBox();
        },
        editHandler: function(view, data) {
            view.controller.edit(data);
        },
        deleteHandler: function(view, data) {
            view.controller.delete(data);
        },
        linkHandler: function(view, data) {
            view.addLink();
        },
        nodeHandler: function(view, data) {
            view.addNode();
        },
        unselectHandler: function(view, data) {
            view.controller.unselect(data);
        },
        selectHandler: function(view, data) {
            view.controller.select(data);
        },
        unlockHandler: function(view, data) {
            void(view);
            data.fixed = false;
        },
        lockHandler: function(view, data) {
            void(view);
            data.fixed = true;
        },
        eventpoolHandler: function(view, data) {
            alert('go to event pool with ' + this.__data__.elt.entity);
        },

        /**
        * called when adding nodes.
        */
        addNodes: function(nodes) {
            // create the graphical element
            var shapes = nodes
                .append('circle') // circle representation
                    .classed(
                        {
                            shape: true,
                            node: true,
                            edge: function(d) {return d.elt.type === 'edge';}
                        }
                    )
                ;
            var _this = this;
            shapes
                .on('click', function() {return _this.clickNode(_this);})
                .on('dblclick', function(){return _this.dblClickNode(_this);})  // add menu selection
                .on('mouseover', function() {_this.panel.select(this).classed('over', true);})
                .on('mouseout', function() {_this.panel.select(this).classed('over', false);})
                ;
            // add a title which is the entity id or graph element id
            shapes.append('title')
                .text(
                    function(d) {
                        return d.elt.entity ? d.elt.entity : d.id;
                    }
                )
            ;
            // node drag
            var node_drag = this.force.drag
                .on(
                    'dragstart',
                    function (d) {
                        d3.event.sourceEvent.stopPropagation();
                        _this.panel.select(this).classed("dragging", true);
                    }
                )
                .on(
                    'dragend',
                    function (d) {
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
                .transition(500)
                .remove()
            ;
        },

        /**
        * called during node updating.
        */
        updateNodes: function(nodes) {
            var topology = this.d3_graph.nodes[0];
            nodes
                .style(
                    'fill',
                    function(d) { // set default color to green
                        var result = 'green';
                        if (d.elt.data) {
                            switch(d.elt.type) {
                                case 'node':
                                case 'edge':
                                    switch(d.elt.data.state) {
                                        case 0: result = 'green'; break; // ok
                                        case 1: result = 'yellow'; break; // warning
                                        case 2: result = 'red'; break; // critical
                                        case 3:
                                        default: result = 'green'; // unknown
                                    }
                                    break;
                                case 'operator': result = 'blue'; break;
                                case 'selector': result = 'gray'; break;
                                case 'topology': result = 'black'; break;
                            }
                        }
                        return result;
                    }
                )
                .attr(
                    'r',
                    function(d) { return d.id === topology.id? 5 : d.weight;}
                )
            ;
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
                        }
                    )
                    .on('mouseover', function() {_this.panel.select(this).classed('over', true);})
                    .on('mouseout', function() {_this.panel.select(this).classed('over', false);})
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
                .style(
                    {
                        'stroke-width': function(d) { return d.elt.weight;},
                        'stroke': 'green',
                        'marker-end': function(d) {
                            return (d.elt.directed && !d.isSource)? "url(#markerArrow)" : "";
                        }
                    }
                )
            ;
        },


        dblClickAction: function(view) {
            if (d3.event.preventDefault()) return;
            view.controller.edit(this);
        },

        clickAction: function(view) {
            if (d3.event.preventDefault()) return;
            if (view.source === undefined) {
                view.showToolBox(this);
            } else {
                view.addLink(view.source, this.__data__);
            }
        },

         /**
        * Disable shapes auto-layout.
        * @param shapes shapes to disable auto-layout.
        */
        lock: function(shapes) {
            if (typeof shapes === 'string') {
                shapes = [shapes];
            }
            shapes.forEach(
                function(elt){elt.__data__.fixed = true;}
            );
        },

        /**
        * Enable shapes auto-layout.
        * @param shapes shapes to enable auto-layout.
        */
        unlock: function(shapes) {
            if (typeof shapes === 'string') {
                shapes = [shapes];
            }
            shapes.forEach(
                function(elt){elt.__data__.fixed = false;}
            );
        },

    });

    var widget = WidgetFactory('graph', {

        graph: null, // canopsis graph model
        d3_graph: null, // d3 graph model

        graph_type: 'topology', // graph type
        graph_id: null,  // graph id

        graph_cls: 'canopsis.graph.elements.Graph', // default graph class

        selected: [], // selected items

        business: null, // business controller

        graph_div: null, // graph div markup

        viewMixins: [
            GraphViewMixin
        ],

        /*init: function() {
            //this._super.apply(this, arguments);
        },*/

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
                            url: '/context/',
                            type: 'POST',
                            data: {
                                '_filter': {'id': {'$in': entity_ids}},
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
            var _url = this.saveGraphUrl(graph_type);
            var _this = this;
            var promise = new Ember.RSVP.Promise(function(resolve, reject) {
                var elts = [_this.graph];
                Object.keys(_this.graph._delts).forEach(
                    function(elt_id) {
                        var elt = _this.graph._delts[elt_id];
                        elts.push(elt);
                    }
                );
                $.ajax(
                    {
                        url: _url,
                        type: 'PUT',
                        data: {
                            'elts': elts
                        }
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

            var _this = this;
            if (this.graph_id !== undefined) {
                // use graph id in getNodes method in order to get nodes
                this.getGraphFromServer(
                    function(result) {
                    // get graph or a default graph
                    _this.graph = result.total === 0 ?
                        {
                            elts: [],
                            _delts: {},
                            _type: _this.graph_type,
                            _id: _this.graph_id, // mongo id
                            _cls: _this.graph_cls, // class
                            cid: _this.graph_id, // canopsis id
                            data: {}
                        }
                        :
                        result.data[0];
                    // with nodes in parameters
                    _this.updateModel();
                });
            }
        },

        /**
        * Convert a vertice to a node and add it in the graph model.
        *
        * @param graph vertice.
        * @return d3 node.
        */
        vertice2Node: function(vertice, nodes_by_indexes, nodes_by_entity_ids) {
            var d3_node = {
                id: vertice.cid
            };
            // add d3_node in d3_graph nodes
            this.d3_graph.nodes.push(d3_node);
            // save vertice
            d3_node.elt = vertice;
            return d3_node;
        },

        /**
        * Convert an edge to linjks and add them in d3_graph.
        *
        * @param edge graph edge.
        * @return edge node.
        */
        edge2Links: function(edge) {
            // save count of link_id per targets/sources
            var link_id_count = {};
            // cause a d3 link has one source and one target, we may create as many link as there are composition of sources and targets.
            var sources = edge.sources;
            var targets = edge.targets;
            // add edge such as a node between all sources and targets
            var result = this.vertice2Node(edge);
            var d3_graph = this.d3_graph;
            /**
            * Add a link to the d3 graph.
            *
            * @param isSource true if link is a source link
            */
            var addLink = function (isSource) {
                return function(vertice_id, vertice_index) {
                    // find the right id related to edge.id, target and count of (edge.id, target)
                    var link_id = isSource + '-' + result.id + '-' + vertice_id;
                    var count = link_id_count[link_id];
                    if (count === undefined) {
                        count = 0;
                    } else {
                        count++;
                    }
                    link_id_count[link_id] = count;
                    link_id += '-' + count;
                    // create a post_link which links the edge to a target
                    var link = {
                        isSource: isSource,
                        source: isSource? vertice_id : result.id,
                        target: !isSource? vertice_id : result.id,
                        elt: edge, // save edge
                        pos: vertice_index, // pos in graph model
                        id: link_id
                    };
                    d3_graph.links.push(link);
                };
            };
            // add links for all sources
            sources.forEach(addLink(true));
            // add links for all targets
            targets.forEach(addLink(false));
            return result;
        },

        updateModel: function() {
            // add nodes and links in graph
            this.d3_graph = {
                nodes: [],
                links: []
            };
            // used to save nodes by ids
            var nodes_by_indexes = {};
            // contain nodes by entity_ids
            var nodes_by_entity_ids = {};
            /**
            * Save node in memory.
            */
            var storeNode = function(node) {
                // add reference between entity id and node
                if (node.elt.entity) {
                    if (nodes_by_entity_ids[node.elt.entity] === undefined) {
                        nodes_by_entity_ids[node.elt.entity] = [node];
                    } else {
                        nodes_by_entity_ids[node.elt.entity].push(node);
                    }
                }
                // order d3_node by id
                nodes_by_indexes[node.id] = node;
            };

            // add the graph itself among nodes
            var node = this.vertice2Node(this.graph);
            storeNode(node);

            // get loaded graph elts
            var elts = this.graph._delts;

            Object.keys(elts).forEach(
                function(elt_id) {
                    var elt = elts[elt_id];
                    var node = null;
                    if (elt._type === 'edge') {
                        node = this.edge2Links(elt); // add links if elt is an edge.
                    } else {
                        node = this.vertice2Node(elt); // add node in other cases.
                    }
                    storeNode(node); // register the node in memory
                },
                this
            );

            // resolve sources and targets in links
            this.d3_graph.links.forEach(
                function(link) {
                    link.source = nodes_by_indexes[link.source];
                    link.target = nodes_by_indexes[link.target];
                }
            );

            // resolve entities
            var _this = this;
            this.getEntitiesFromServer(
                Object.keys(nodes_by_entity_ids),
                function(result) {
                    if (result.total !== 0) {
                        result.data.forEach(
                            function(entity) {
                                nodes_by_entity_ids[entity.cid].forEach(
                                    function(node) {
                                        node.entity = entity;
                                    }
                                );
                            }
                        );
                    }
                    _this.trigger('refresh');
                    //_this.startRefresh();
                }
            );
        },

        /**
        * Edit input elt properties.
        *
        * @param data data to edit. If undefined, data is this.__data__
        */
        edit: function(data, widget) {
            if (data === undefined) { // if handler result
                elt = this.__data__;
            } else { // if called by the controller
                widget = this;
            }
            var elt = data.elt;
            var recordWizard = formsUtils.showNew(
                'modelform',
                elt
            );
            recordWizard.submit.done(
                function(form) {
                    elt.save();
                    this.updateModel();
                }
            );
        },

        /**
        * Delete a selected element or all elements related to input data.
        * @param data array of data to delete if not undefined.
        */
        delete: function(data) {
            var data_to_delete = data;
            // initialize data
            if (data_to_delete === undefined) { // if data does not exist
                data_to_delete = [this.__data__]; // get data from this
            }
            else if (typeof(data_to_delete) === 'string') { // if data is a string
                data_to_delete = [data]; // transform it into an array
            }
            // start to delete data from model
            data.forEach(
                function(d) {
                    delete this.graph._delts[d.cid];
                }
            );
            // then delete data from the view
            // select shapes to delete which corresponds to data or this if data is undefined
            this.updateModel();
        },

        /**
        * Select input data in order to get detail informations.
        *
        * @param data array of data.
        */
        select: function(data) {
            if (typeof data === 'string') {
                data = [data];
            }
            data.forEach(
                function(d) {
                    var selected_index = this.selected.indexOf(d.id);
                    this.selected.splice(selected_index);
                }
            );
            this.updateModel();
        },

        /**
        * Unselect input data in order to get detail informations.
        *
        * @param data array of data.
        */
        unselect: function(data) {
            if (typeof data === 'string') {
                data = [data];
            }
            data.forEach(
                function(d) {
                    var selected_index = this.selected.indexOf(d.id);
                    this.selected.push(d.id);
                }
            );
            this.updateModel();
        },

        addNode: function() {
            var vertice = {
                cid: Math.random() + '',
                type: 'node',
                _cls: 'canopsis.topology.elements.Node'
            };
            this.graph._delts[vertice.cid] = vertice;
            this.graph.elts.push(vertice);
            return result
        },

        addLink: function(source, target) {
            if (target.elt === undefined) {
                // create a node if target does not exist
                target = this.addNode();
            }
            if (source.elt.type === 'node') {
                if (target.elt.type === 'node') {
                    // create an edge
                    var edge = {
                        cid: Math.random() + '',
                        source: source.id,
                        target: target.id,
                        _cls: 'canopsis.topology.elements.Edge'
                    };
                    this.graph._delts[edge.cid] = edge;
                    this.graph.elts.push(edge.cid);
                } else {
                    // create a link
                    target.elt.sources.push(source.id);
                }
            } else { // if source is an edge
                // add target in edge targets
                source.elt.targets.push(target.id);
            }
        },

        /**
        * Get toolbox names by node.
        *
        */
        getToolBoxItems: function(data) {
            // default result
            var result = [
                'close', // close toolbox
                'edit', // edit node
                // 'copy', // copy node
                'delete' // delete node
            ];

            if (data.elt) { // is it a node
                result.push('link'); // new link
                if ($.inArray(data.id, this.selected)) {
                    result.push('unselect');
                } else {
                    result.push('select');
                }
                if (data.fixed) {
                    result.push('unlock');
                } else {
                    result.push('lock');
                }
                if (data.entity) {
                    result.push('eventpool');
                }
            } else {
                result.push('node'); // new node
            }

            return result;
        },

    });

    return widget;
});
