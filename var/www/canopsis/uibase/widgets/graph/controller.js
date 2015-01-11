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

    var widget = WidgetFactory('graph', {

        d3_graph: {nodes: [], links: []}, // d3 graph with nodes and links

        node_class: 'node', // node class name
        link_class: 'link', // link class name

        toolbox: null, // global toolbox which may be unique

        force: null, // d3 force element for auto display

        panel: null, // display panel

        firstCall: true, // flag while rerender has not been called

        source: null, // source link data

        _size: [1, 1],
        _charge: -120,
        _chargeDistance: 500,
        _linkDistance: 20,
        _linkStrength: 1,
        _friction: 0.9,
        _theta: 0.8,
        _gravity: 0.1,

        size: function() {
            return this._size;
        },
        sizeChanged: function() {
            this._size = this.get('size');
            this.force.size(size);
        }.observes('size'),
        charge: function() {
            return this._charge;
        },
        chargeChanged: function() {
            this._charge = this.get('charge');
            this.force.charge(charge);
        }.observes('charge'),
        chargeDistance: function() {
            return this._chargeDistance;
        },
        chargeDistanceChanged: function() {
            this._chargeDistance = this.get('chargeDistance');
            this.force.chargeDistance(chargeDistance);
        }.observes('chargeDistance'),
        linkDistance: function() {
            return this._linkDistance;
        },
        linkDistanceChanged: function() {
            this._linkDistance = this.get('linkDistance');
            this.force.linkDistance(linkDistance);
        }.observes('linkDistance'),
        linkStrength: function() {
            return this._linkStrength;
        },
        linkStrengthChanged: function() {
            this._linkStrength = this.get('linkStrength');
            this.force.linkStrength(linkStrength);
        }.observes('linkStrength'),
        friction: function() {
            return this._friction;
        },
        frictionChanged: function() {
            this._friction = this.get('friction');
            this.force.friction(friction);
        }.observes('friction'),
        theta: function() {
            return this._theta;
        },
        thetaChanged: function() {
            this._theta = this.get('theta');
            this.force.theta(theta);
        }.observes('theta'),
        gravity: function() {
            return this._gravity;
        },
        gravityChanged: function() {
            this._gravity = this.get('gravity');
            this.force.gravity(gravity);
        }.observes('gravity'),

        rerender: function() {
            var _this = this;
            this._super.apply(this, arguments);
            this.d3_graph = this.d3_graph;
            var width = 1000, height = 1000;
            // apply force behavior
            if (this.force === null) {
                this.force = d3.layout.force()
                    .size(this._size)
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
            this.panel = d3.select('#' + this.get('id') + ' svg g');
            if (this.panel.size() === 0) {
                /**
                * zoom function.
                */
                function zoom() {
                    _this.panel.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                }
                var zoom = d3.behavior.zoom()
                    .scaleExtent([1.5, 10])
                    .on('zoom', zoom)
                ;
                // or create it if it does not exist
                this.panel = d3.select('#' + this.get('id') + ' svg')
                    .attr(
                        {
                            width: width,
                            height: height
                        }
                    )
                    .append('g')
                        .attr(
                            {
                                transform: 'scale(1.5)'
                            }
                        )
                        .on('click', function(){ return _this.clickAction(this);})
                        .on('mousemove', function() { return _this.moveAction(this);})
                        //.on('mouseover', function() { return _this.overAction(this);})
                        .on('mouseout', function() { return _this.overAction(this);})
                        .on('dblclick', function() { return _this.addHandler();})
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

            this.force.on('tick', function() {
                link_model
                    .attr('x1', function(d) {return d.source.x;})
                    .attr('y1', function(d) {return d.source.y;})
                    .attr('x2', function(d) {return d.target.x;})
                    .attr('y2', function(d) {return d.target.y;})
                ;
            node_model
                .attr("transform", function(d) { return "translate(" + (d.x) + "," + (d.y) + ")"; })
                ;
            });
            // disable first call
            if (this.firstCall) {
                this.firstCall = false;
                this.force.start();
            } else { // or resume force
                this.force.start();
            }
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
            var selected_id = Object.keys(this.selected);
            if (selected_id.length > 0) {
                // get a list of 'selected' items
                var selected_shapes = this.panel.selectAll('.shapegroup')
                    .data(selected_id, function(d){return d;});
                // select newly selected items
                selected_shapes.classed('selected', true);
                //selected_shapes.transition().duration(300).classed('selected', true);
                // unselect unselected items
                //selected_shapes.exit().transition().duration(300).classed('selected', false);
                selected_shapes.exit().classed('selected', false);
            }
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
            var coordinates = data? [data.x, data.y] : d3.mouse(shape);
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
                                var gap = 15;
                                var x = coordinates[0] + Math.cos(length) * gap, y = coordinates[1] + Math.sin(length) * gap;
                                return "translate(" + x + "," + y + ") " + (d.transform ? d.transform : '');
                            }
                        }
                    )
                    // attach handlers
                    .on('click', function(d){return _this[d.name + 'Handler'](data, shape);})
                ;
            new_toolbox // add shape
                .append('path')
                    .attr(
                        {
                            d: function(d, i) {
                                return d.symbol(d, i);
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
                .transition()
                    .style("opacity", 1) // show them
                    .attr( // and move them
                        {
                            transform: function(d, i) {
                                var length = 2 * i * Math.PI / toolbox_items.length;
                                var gap = 15;
                                var x = coordinates[0] + Math.cos(length) * gap, y = coordinates[1] + Math.sin(length) * gap;
                                return "translate(" + x + "," + y + ") " + (d.transform ? d.transform : '');
                            }
                        }
                    )
                ;
            // delete old toolbox
            this.toolbox.exit()
                .transition()
                    .duration(500)
                    .style("opacity", 0) // generic exit
                    .remove()
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
                        .duration(500)
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
            this.edit(data);
            this.destroyToolBox();
        },
        deleteHandler: function(data) {
            d3.event.stopPropagation();
            this.delete(data);
            this.destroyToolBox();
        },
        linkHandler: function(data, shape) {
            d3.event.stopPropagation();
            this.source = data; // save link source
            var coordinates = [data.x, data.y];
            this.tmpLink = this.panel
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
                ;
        },
        addHandler: function(data) {
            d3.event.stopPropagation();
            var node = this.addNode(undefined, true);
            var coordinates = d3.mouse(this.panel[0][0]);
            node.x = coordinates[0];
            node.y = coordinates[1];
            node._weight = 1;
            node.fixed = true;
            this.updateModel();
            this.destroyToolBox();
        },
        unselectHandler: function(data) {
            d3.event.stopPropagation();
            this.unselect(data);
            this.destroyToolBox();
        },
        selectHandler: function(data) {
            d3.event.stopPropagation();
            this.select(data);
            this.destroyToolBox();
        },
        unlockHandler: function(data) {
            d3.event.stopPropagation();
            data.fixed = false;
            this.panel.selectAll('.shapegroup').data([data], function(d) { return d.id;}).classed('locked', false);
            this.destroyToolBox();
        },
        lockHandler: function(data) {
            d3.event.stopPropagation();
            data.fixed = true;
            this.panel.selectAll('.shapegroup').data([data], function(d) { return d.id;}).classed('locked', true);
            this.destroyToolBox();
        },
        cancelHandler: function(data) {
            d3.event.stopPropagation();
            this.removeTmpLink();
            this.destroyToolBox();
        },

        removeTmpLink: function() {
            this.source = null;
            this.tmpLink.remove();
            this.tmpLink = null;
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
                            edge: function(d) {return d.elt.get('type') === 'edge';},
                            topology: function(d) { return d.elt.get('type') === 'topology';}
                        }
                    )
                    .attr(
                        {
                            id: function(d) {return d.id;}
                        }
                    )
                    .on('click', function() {return _this.clickAction(this);})
                    .on('dblclick', function(){return _this.dblClickAction(this);})  // add menu selection
                    //.on('mouseover', function() {_this.overAction(this);})
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
            // add a title which is the entity id or graph element id
            shapes.append('title')
                .text(
                    function(d) {
                        return d.id;
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
            var _this = this;
            nodes
                .select('path')
                    .style(
                        'fill',
                        function(d) { // set default color to green
                            var result = 'green';
                            if (d.elt.get('info')) {
                                switch(d.elt.get('type')) {
                                    case 'node':
                                    case 'edge':
                                        switch(d.elt.get('info').state) {
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
                        'd',
                        function(d, i) {
                            var f = d3.svg.symbol();
                            if (d.x === undefined) {
                                d.x = 0; d.y = 0;
                            }
                            switch(d.elt.get('type')) {
                                case 'topology':
                                    f = f.type('circle');
                                    if (d.id === _this.graph.cid) {
                                        f = f.size(5 * 64);
                                    } else {
                                        f = f.size((d._weight>=1? d._weight : 1) * 64);
                                    }
                                    break;
                                case 'edge': f = f.type('diamond').size(d._weight * 64); break;
                                case 'node': f = f.type('square').size((d._weight>=1? d._weight : 1) * 64); break;
                                default: f = f.type('triangle-down');
                            }
                           var result = f(d, i);
                           return result;
                        }
                    )
            ;
            nodes // add entity name redirection
                .filter(
                    function(d) {
                        return d.elt && d.elt.get('entity')
                    }
                )
                .append('a')
                    .attr(
                        {
                            'xlink:href': function(d) { return '/eventpool?' + d.elt.get('entity');},
                            'target': '_blank'
                        }
                    )
                    .append('text')
                        .text(
                            function(d) {
                                return d.elt.get('entity') ? d.elt.get('entity') : d.id;
                            }
                        )
            ;
            /*nodes // remove unused entity names
                .filter(
                    function(d) {
                        return ! (d.elt && d.elt.get('entity'))
                    }
                )
                .select('a').remove();*/
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
                    .attr('id', function(d) {return d.id;})
                    .on('click', function() {return _this.clickAction(this);})
                    //.on('mouseover', function() {_this.overAction(this);})
                    .on('mouseout', function() {_this.outAction(this);})
                    .on('mousemove', function() {_this.moveAction(this);})
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
                .classed('directed', function(d) {return d.elt.get('directed');})
                .style(
                    {
                        'stroke-width': function(d) { return d._weight? d._weight : 1;},
                        'stroke': 'green',
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
                var coordinates = data? [data.x, data.y] : d3.mouse(this.panel[0][0]);
                /*this.tmpLink.attr(
                    {
                        x2: coordinates[0],
                        y2: coordinates[1]
                    }
                )*/
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
                }
            }
        },

        /**
        * Check if a shape is a good target for a new link.
        *
        * @param shape target shape.
        */
        checkTargetLink: function(data) {
            var result = (data === undefined || (data.elt.get('type') !== 'edge' && data.id !== this.source.id));
            return result;
        },

        outAction: function(shape) {
            if (d3.event.defaultPrevented) return;
            d3.select(shape).classed('over', false);
        },

        dblClickAction: function(shape) {
            if (d3.event.defaultPrevented) return;
            d3.event.stopPropagation();
            this.edit(shape.__data__);
        },

        clickAction: function(shape) {
            if (d3.event.defaultPrevented) return;
            d3.event.stopPropagation();
            if (this.source === null) {
                this.showToolBox(shape);
            } else if (this.checkTargetLink(shape.__data__)) {
                this.addLink(this.source, shape.__data__, true);
                this.removeTmpLink();
                this.updateModel();
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

        /*******************************
        * business part
        */

        graph: null, // canopsis graph model

        graph_type: 'topology', // graph type
        graph_id: null,  // graph id

        graph_cls: 'canopsis.graph.elements.Graph', // default graph class

        selected: [], // selected items

        business: null, // business controller

        graph_div: null, // graph div markup

        nodes_by_id: {}, // d3 graph node by id

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
                            type: _this.graph_type,
                            _type: 'graph',
                            _id: _this.graph_id, // mongo id
                            _cls: _this.graph_cls, // class
                            cid: _this.graph_id, // canopsis id
                            _id: _this.graph_id,
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
        vertice2Node: function(vertice) {
            vertice = this.toRecord(vertice);
            var result = this.nodes_by_id[vertice.get('cid')];
            if (result === undefined) {
                var result = {
                    id: vertice.get('cid'),
                    elt: vertice,
                    index: this.d3_graph.nodes.length
                };
                // add result in d3_graph nodes
                this.d3_graph.nodes.push(result);
                // add node reference in nodes_by_id
                this.nodes_by_id[result.id] = result;
            }
            return result;
        },

        /**
        * Convert an edge to linjks and add them in d3_graph.
        *
        * @param edge graph edge.
        * @return edge node.
        */
        edge2Links: function(edge) {
            var _this = this;
            edge = this.toRecord(edge);
            // save count of link_id per targets/sources
            var link_id_count = {};
            // cause a d3 link has one source and one target, we may create as many link as there are composition of sources and targets.
            var sources = edge.get('sources');
            var targets = edge.get('targets');
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
                    var link = _this.nodes_by_id[link_id];
                    if (link === undefined) {
                        link = {
                            isSource: isSource,
                            source: isSource? vertice_id : result.id,
                            target: !isSource? vertice_id : result.id,
                            elt: edge, // save edge
                            pos: vertice_index, // pos in graph model
                            id: link_id
                        };
                        d3_graph.links.push(link);
                        _this.nodes_by_id[link.id] = link;
                    }
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
            // contain nodes by entity_ids
            var nodes_by_entity_ids = {};
            /**
            * Save node in memory.
            */
            var storeNode = function(node) {
                // add reference between entity id and node
                if (node.elt.get('entity')) {
                    if (nodes_by_entity_ids[node.elt.entity] === undefined) {
                        nodes_by_entity_ids[node.elt.entity] = [node];
                    } else {
                        nodes_by_entity_ids[node.elt.entity].push(node);
                    }
                }
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
                    node._weight = 0;
                },
                this
            );

            // resolve weight
            this.d3_graph.nodes.forEach(
                function(node) {
                    if (node.elt.get('type') === 'edge') {
                        node._weight = node.elt.get('weight');
                        var source_id = node.elt.get('sources')[0];
                        var source_node = this.nodes_by_id[source_id];
                        if (source_node._weight === undefined) {
                            source_node._weight = 0;
                        }
                        source_node._weight += node.elt.get('weight');
                    } else {
                        if (node._weight === undefined) {
                            node._weight = 0;
                        }
                    }
                },
                this
            );

            // resolve sources and targets in links
            this.d3_graph.links.forEach(
                function(link) {
                    if (typeof link.source === 'string') {
                        link.source = this.nodes_by_id[link.source];
                        link.target = this.nodes_by_id[link.target];
                    }
                },
                this
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
                    _this.rerender();
                }
            );
        },

        /**
        * Edit input elt properties.
        *
        * @param data data to edit.
        */
        edit: function(data) {
            var elt = data.elt;
            this.toRecord(elt, true);
            this.rerender();
        },

        /**
        * Delete a selected element or all elements related to input data.
        * @param data array of data to delete if not undefined.
        */
        delete: function(data) {
            // forbid to delete the main topology
            if (data.id === this.graph.id) {
                throw new Exception("Impossible to delete topology!");
            }
            //ensure data is an array of data
            if (! Array.isArray(data)) {
                data = [data];
            }
            // start to delete data from model
            data.forEach(
                function(d) {
                    delete this.graph._delts[d.id];
                    var pos = this.graph.elts.indexOf(d.id);
                    this.graph.elts.splice(pos);
                    d.elt.destroyRecord();
                    // delete view
                    delete this.nodes_by_id[d.id];
                    var d_type = d.elt.get('type');
                    switch(d_type) {
                        case 'node':
                        case 'topology':
                        case 'edge':
                    }
                    this.d3_graph.nodes.forEach(
                        function(node, i) {
                            if (i>d.index) {
                                node.index--;
                            }
                        }
                    );
                    this.d3_graph.nodes.splice(d.index);
                },
                this
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
        * Convert input elt to a record, or returns it if already a record.
        *
        * @param elt element to convert.
        * @param edit edit record with a form if true.
        */
        toRecord: function(elt, edit) {
            var result = elt;
            // if elt is a record
            if (elt.store === undefined) {
                if (elt.data !== undefined) {
                    elt.info = elt.data;
                    delete elt.data;
                }
                var result = dataUtils.getStore().createRecord(
                    elt.type,
                    elt
                );
            }
            if (edit) {
                var recordWizard = formsUtils.showNew(
                    'modelform',
                    result
                );
                recordWizard.submit.done(
                    function(form) {
                        result.save();
                    }
                );
            }
            return result;
        },

        /**
        * Add a node with input configuration or from a form.
        * @param conf default configuration.
        * @param edit edit configuartion with a form.
        * @return new vertice record.
        */
        addNode: function(conf, edit) {
            // initialize the vertice data
            if (!conf) {
                var uuid = '' + Math.random();
                conf = {
                    _id: uuid,
                    cid: uuid,
                    type: 'node'
                };
            }
            if(conf.cid === undefined) {
                var uuid = '' + Math.random();
                conf.cid = conf._id? conf._id : uuid;
                if (conf._id === undefined) {
                    conf._id = uuid;
                }
            }
            if(conf.type === undefined) {
                conf.type = 'node';
            }
            var record = this.toRecord(conf, edit);
            // save result in model
            this.graph._delts[record.get('cid')] = record;
            this.graph.elts.push(record.get('cid'));
            var result = this.vertice2Node(record);
            return result
        },

        /**
        * Add a link.
        *
        * @param source source link.
        * @param target optional target link.
        * @param edit enable link properties edition.
        */
        addLink: function(source, target, edit) {
            var source_type = source.elt.get('type');
            // ensure source and target are ok
            if (source.id === this.graph.cid || !this.checkTargetLink(target)) {
                throw new Exception('Wrong parameters');
            }
            // first we need to get/create an edge
            var edge = null;
            // get a target
            if (target === undefined) {
                // create a node if target does not exist
                target = this.addNode(undefined, edit);
            }
            // if source is an edge, then edge is source
            if (source_type === 'edge') {
                edge = source;
                // and add right now the target
                edge.elt.get('targets').push(target.id);
            } else { // else create a new edge
                edge = this.addNode(
                    {
                        type: 'edge',
                        sources: [source.id],
                        targets: [target.id],
                        weight: 1
                    },
                    edit
                );
            }
            return edge;
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
                    this.newToolBoxItem('cancel', 'cross', 'rotate(45)'),
                    this.newToolBoxItem('add', 'cross')
                )
            } else {
                // default result
                result.push(
                    this.newToolBoxItem('close', 'triangle-down')
                );

                if (data !== undefined && data.elt) { // is it a node
                    if (this.selected[data.id] !== undefined) {
                        result.push(this.newToolBoxItem('unselect'));
                    } else {
                        result.push(this.newToolBoxItem('select'));
                    }
                    if (data.fixed) {
                        result.push(this.newToolBoxItem('unlock'));
                    } else {
                        result.push(this.newToolBoxItem('lock'));
                    }
                    if (data.id !== this.graph.cid) { // all nodes but topology
                        result.push(this.newToolBoxItem('link', 'triangle-up')); // new link
                        result.push(this.newToolBoxItem('delete', 'cross', 'rotate(45)')); // elt deletion
                    }
                    if (data.elt.get('type') !== 'topology') { // all elts but topologies
                        result.push(this.newToolBoxItem('edit')); // edit elt
                    }
                } else {
                    result.push(this.newToolBoxItem('add', 'cross')); // add elt
                }
            }

            return result;
        },

    });

    return widget;
});
