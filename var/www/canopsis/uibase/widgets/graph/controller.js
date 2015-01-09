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
    'app/lib/utils/forms'
], function($, WidgetFactory, d3, schemas, formsUtils) {
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

        graph: null, // canopsis graph model
        d3_graph: null, // d3 graph model

        graph_type: 'topology', // graph type
        graph_id: null,  // graph id

        graph_cls: 'canopsis.graph.elements.Graph', // default graph class

        node_class: 'node', // node class name
        link_class: 'link', // link class name

        force: null, // d3 force element for auto display

        toolbox: null, // global toolbox which may be unique

        selected: [], // selected items

        business: null, // business controller

        panel: null, // display panel

        /*viewMixins: [
            GraphViewMixin
        ],*/

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
            _url = this.getGraphUrl();
            var promise = new Ember.RSVP.Promise(function(resolve, reject) {
                $.ajax(
                    {
                        url: _url,
                        type: 'POST',
                        data: {
                            'ids': this.graph_id,
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
            var promise = new Ember.RSVP.Promise(function(resolve, failure) {
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
            _url = this.saveGraphUrl(graph_type);
            var promise = new Ember.RSVP.Promise(function(resolve, reject) {
                var elts = [this.graph];
                Object.keys(this.graph._delts).forEach(
                    function(elt_id) {
                        var elt = this.graph._delts[elt_id];
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
            this.graph_type = this.get('graph_type');
            if (!this.graph_type) this.graph_type = 'topology';
            this.graph_id = this.get('graph_id');
            if (!this.graph_id) this.graph_id = 'test';

            // load business
            // business_name = this.graph_type + 'Component';
            // this.business = eval(business_name);

            var _this = this;

            if (this.graph_id !== undefined) {
                // use graph id in getNodes method in order to get nodes
                var promise = this.getGraphFromServer(this.graph_type, this.graph_id);
                // execute the promise
                var nodes = promise.then(function(result) {
                    // get graph or a default graph
                    this.graph = result.total === 0 ?
                        {
                            elts: [],
                            _delts: {},
                            _type: this.graph_type,
                            _id: this.graph_id, // mongo id
                            _cls: this.graph_cls, // class
                            cid: this.graph_id, // canopsis id
                            data: {}
                        }
                        :
                        result.data[0];
                    // with nodes in parameters
                    _this.updateModel();
                });
            }
        },

        updateModel: function() {
            // add nodes and links in graph
            this.d3_graph = {
                nodes: [],
                links: []
            };
            // used to save nods by ids
            var nodes_by_indexes = {};
            // contain nodes by entity_ids
            var nodes_by_entity_ids = {};
            /**
            * Add graph vertice in d3_graph.
            *
            * @param graph vertice.
            * @return d3 node.
            */
            function addNode(vertice) {
                var d3_node = {
                    id: node.cid
                };
                // add reference between entity id and d3_node
                if (vertice.entity) {
                    if (nodes_by_entity_ids[vertice.entity] === undefined) {
                        nodes_by_entity_ids[vertice.entity] = [d3_node];
                    } else {
                        nodes_by_entity_ids[vertice.entity].push(d3_node);
                    }
                }
                // add d3_node in d3_graph nodes
                this.d3_graph.nodes.push(d3_node);
                // order d3_node by id
                nodes_by_indexes[d3_node.id] = d3_node;
                // save vertice
                d3_node.elt = vertice;
                return d3_node;
            }
            /**
            * Add edge in d3_graph.
            *
            * @param edge graph edge.
            */
            function addLinks(edge) {
                // save count of link_id per targets/sources
                var link_id_count = {};
                // cause a d3 link has one source and one target, we may create as many link as there are composition of sources and targets.
                var sources = edge.sources;
                var targets = edge.targets;
                // add edge such as a node between all sources and targets
                addNode(edge);
                /**
                * Add a link to the d3 graph.
                *
                * @param isSource true if link is a source link
                */
                var addLink = function (isSource) {
                    return function(vertice_id, vertice_index) {
                        // find the right id related to edge.id, target and count of (edge.id, target)
                        var link_id = isSource + '-' + edge.id + '-' + vertice_id;
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
                            source: isSource? vertice_id : edge.id,
                            target: !isSource? vertice_id : edge.id,
                            elt: edge, // save edge
                            pos: vertice_index, // pos in graph model
                            id: link_id
                        };
                        this.d3_graph.links.push(link);
                    };
                };
                // add links for all sources
                sources.forEach(addLink(true));
                // add links for all targets
                targets.forEach(addLink(false));
            }

            // add the graph itself among nodes
            addNode(this.graph);

            // get loaded graph elts
            var elts = this.graph._delts;

            Object.keys(elts).forEach(
                function(elt_id) {
                    var elt = elts[elt_id];
                    if (elt._type === 'edge') {
                        addLinks(elt); // add links if elt is an edge.
                    } else {
                        addNode(elt); // add node in other cases.
                    }
                }
            );

            // resolve sources and targets in links
            this.d3_graph.links.forEach(
                function(link) {
                    link.source = nodes_by_indexes[link.source];
                    link.target = nodes_by_indexes[link.target];
                }
            );

            // resolve entities
            elts.forEach(
                function (elt_id) {
                    var elt = elts[elt_id];
                    if (elt.entity) {
                        var nodes = nodes_by_entity_ids[elt.entity];
                    }
                }
            );

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
                    _this.updateView();
                }
            );
        },

        updateView: function() {

            var width = 900, height = 500;

            // apply force behavior
            this.force = d3.layout.force().charge(-120).linkDistance(30).size([width, height]);

            // select svg
            this.panel = d3.select('div.graph svg g');
            if (this.panel.size() === 0) {
                /**
                * zoom function
                */
                function zoom() {
                    this.panel.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                }
                var zoom = d3.behavior.zoom()
                    //.scaleExtent([1, 8])
                    .on('zoom', zoom)
                ;
                // or create it if it does not exist
                this.panel = d3.select('div.graph svg')
                    .attr('width', width)
                    .attr('height', height)
                        .append('g')
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
            this.force.nodes(this.d3_graph.nodes).links(this.d3_graph.links).start();

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
                elt.type + 'form',
                elt
            );
            recordWizard.submit.then(
                function(form) {
                    var record = get(form, 'formContext');
                    record.save();
                    widget.trigger('refresh');
                    widget.startRefresh();
                }
            );
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
            this.deleteData(data_to_delete);
            // then delete data from the view
            // select shapes to delete which corresponds to data or this if data is undefined
            var shapes_to_delete = this.panel.select('.shape').data(data, function(d){return d.id;});
            this.deleteShapes(shapes_to_delete);
        },

        /**
        * Delete data from model.
        *
        * @param data data to delete.
        */
        deleteData: function(data) {
            data.forEach(
                function(d) {
                    delete this.graph._delts[d.cid];
                }
            );
        },

        /**
        * Delete shapes from view.
        *
        * @param shapes shapes to delete.
        */
        deleteShapes: function(shapes) {
            shapes.transition().duration(300).remove();
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
            // get a list of 'selected' items
            var selected = this.panel.select('.selected')
                .data(this.selected, function(d){return d.id;});
            // unselect unselected items
            selected.exit().transition().duration(300).classed('selected', false);
            // select newly selected items
            selected.enter().transition().duration(300).classed('selected', true);
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
            this.refreshSelectedShapes();
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
            this.refreshSelectedShapes();
        },

        dblClickNode: function(widget) {
            if (d3.event.preventDefault()) return;
            widget.edit(this);
        },

        clickNode: function(widget) {
            if (d3.event.preventDefault()) return;
            if (widget.source === undefined) {
                widget.getNodeToolBoxItems(widget);
            } else {
                widget.addLink(widget.source, this.__data__);
            }
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
        getNodeToolBoxItems: function(data) {
            // default result
            var result = [
                'close', // close toolbox
                'edit', // edit node
                // 'copy', // copy node
                'delete' // delete node
            ];

            if (data.elt) {
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

        showToolBox: function() {
            if (d3.event.preventDefault()) {
                return;
            }

        },

        /**
        * Show tool box related to input shape.
        */
        showNodeToolBox: function(widget) {
            if (d3.event.preventDefault()) {
                return;
            }
            // if toolbox already exists, destroy it.
            if (widget.toolbox !== null) {
                widget.destroyToolBox();
            }
            // add a new toolbox with specific node toolbox items
            var toolbox_items = widget.getToolBoxItems(this.__data__);
            // get coordinates
            var coordinates = d3.mouse(this);
            // create generic toolbox
            widget.toolbox = this.panel.select(this)
                .data(toolbox_items).enter()
                .append('circle')
                    .classed('toolbox', true)
                    .attr(
                        {
                            class: function(d) {return d+'-tb';},
                            cx: function(d, i) {return coordinates[0] + Math.cos(i) * d.weight;},
                            cy: function(d, i) {return coordinates[1] + Math.sin(i) * d.weight;},
                            r: 2
                        }
                    )
                ;
            widget.updateToolBox();
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

        closeHandler: function(widget) {
            widget.destroyToolBox();
        },
        editHandler: function(widget) {
            widget.edit(this);
        },
        deleteHandler: function(widget) {
            widget.delete(this.__data__);
        },
        linkHandler: function(widget) {
            widget.addLink();
        },
        nodeHandler: function(widget) {
            widget.addNode();
        },
        unselectHandler: function(widget) {
            widget.unselect(this.__data__);
        },
        selectHandler: function(widget) {
            widget.select(this.__data__);
        },
        unlockHandler: function(widget) {
            this.fixed = false;
        },
        lockHandler: function(widget) {
            this.fixed = true;
        },
        eventpoolHandler: function(widget) {
            alert('go to event pool with ' + this.__data__.elt.entity);
        },

        /**
        *
        */
        updateToolBox: function() {
            var _this = this;
            this.toolbox_items
                .on('click', function(d) {return _this[d+'Handler'](_this);})
                .text(function(d) {return d;})
            ;
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
                            node: function(d) {return d.elt.type === 'node'},
                            edgenode: function(d) {return d.elt.type === 'edge';}
                        }
                    )
                ;
            var _this = this;
            shapes
                .on('click', function() {return _this.clickNode(_this);})
                .on('dblclick', function(){return _this.dblClickNode(_this);})  // add menu selection
                .on('mouseover', function() {this.panel.select(this).classed('over', true);})
                .on('mouseout', function() {this.panel.select(this).classed('over', false);})
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
                        this.panel.select(this).classed("dragging", true);
                    }
                )
                .on(
                    'dragend',
                    function (d) {
                        this.panel.select(this).classed("dragging", false);
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
                        var result = undefined;
                        switch(d.elt.type) {
                            case 'node':
                            case 'edge':
                                switch(d.elt.state) {
                                    case 0: result = 'green'; break; // ok
                                    case 1: result = 'yellow'; break; // warning
                                    case 2: result = 'red'; break; // critical
                                    case 3:
                                    default: result = 'white'; // unknown
                                }
                                break;
                            case 'operator': result = 'blue'; break;
                            case 'selector': result = 'gray'; break;
                            case 'topology': result = 'black'; break;
                        }
                        return result;
                    }
                )
                .attr(
                    'r',
                    function(d) { return d.id === this.graph.cid? 5 : d.weight;}
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
                    .on('mouseover', function() {this.panel.select(this).classed('over', true);})
                    .on('mouseout', function() {this.panel.select(this).classed('over', false);})
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
            var _this = this;
            links
                .classed('directed', function(d) {return _this.graph[d.id].directed;})
                .style(
                    {
                        'stroke-width': function(d) { return _this.graph[d.id]._weight;},
                        'stroke': 'green',
                        'marker-end': function(d) {
                            return (_this.graph[d.id].directed && !d.isSource)? "url(#markerArrow)" : "";
                        }
                    }
                )
            ;
        }

    });

    return widget;
});
