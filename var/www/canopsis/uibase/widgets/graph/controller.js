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
    'jsplumb',
    'cy',
    'app/lib/loaders/schemas'
], function(WidgetFactory, d3, jsplumb, cy) {
    var get = Ember.get,
        set = Ember.set;

    var GraphViewMixin = Ember.Mixin.create({
        didInsertElement: function() {
            // call controller.findItems function when the template is loaded
            //this.controller.findItems();//var findItems = get(this, 'controller.findItems');
            //findItems();
            this._super.apply(this, arguments);
        }
    });

    var widget = WidgetFactory('graph', {

        nodes: null,  // graph nodes
        selected: {}, // selected nodes

        overlay: [1],  // is overlay displayed
        svg: true, // is svg loaded

        graph: null,  // graph

        viewMixins: [
            GraphViewMixin
        ],

        /**
        * Get graph nodes
        */
        getNodes: function(graphid){
            return new Ember.RSVP.Promise(function(resolve, reject) {
                $.ajax(
                    {
                        url: '/topology-nodes/' + graphid,
                        type: 'GET'
                    }
                ).then(resolve, reject);
            });
        },

        /**
        * display nodes in the widget
        */
        findItems: function(){
            // get graphid
            var graphid = this.get('graphid');

            if (graphid !== null) {
                // use graph id in getNodes method in order to get nodes
                var promise = this.getNodes(graphid);
                var me = this;
                // execute the promise to get nodes
                var nodes = promise.then(function(result) {
                    // get nodes
                    var nodes = result.data;
                    // update nodes in this
                    me.set('nodes', nodes);
                    // get library
                    var library = me.get('library');
                    // load the right display method
                    var displayFunction = me.get('display' + library);
                    // with nodes in parameters
                    displayFunction.call(me, nodes);
                });
            }
        },

        displayd3: function(nodes) {
            // construct a d3 graph data
            var graph = this.graph;
            if (graph === null) {
                graph = {
                    'nodes': nodes,
                    'links': []
                };
            }

            // fill graph.links
            for(var i=0; i<nodes.length; i++) {
                var node = nodes[i];
                var next = node.next;
                if (next !== undefined) {
                    node.weight = next.length;
                    for (var j=0; j<next.length; j++) {
                        node_id = next[j];
                        for (k=0; k<nodes.length; k++) {
                            var next_node = nodes[k];
                            if (node_id === next_node['cid']) {
                                var link = {'source': i, 'target': k};
                                var isFound = false;
                                for (var l=0; l<graph.links.length; l++) {
                                    _link = graph.links[l];
                                    isFound = (link.source === _link.source && link.target === _link.target);
                                    if (isFound) {
                                        break;
                                    }
                                }
                                if (! isFound) {
                                    graph.links.push(link);
                                }
                            }
                        }
                    }
                }
            }

            var width = 900, height = 500;

            // apply force behavior
            var force = d3.layout.force().charge(-120).linkDistance(30).size([width, height]);

            /**
            * zoom function
            */
            function zoom() {
                svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            }
            var zoom = d3.behavior.zoom()
                .scaleExtent([1, 8]).on('zoom', zoom);

            // select svg
            var svg = d3.select('div.graph svg g');
            if (svg.size() === 0) {
                svg = d3.select('div.graph')
                    .append('svg')
                        .attr('width', width)
                        .attr('height', height)
                        .append('g')
                            .call(zoom)
                    ;
            }

            var overlay = svg.select('.overlay');
            if (overlay.size() === 0) {
                svg.append("rect")
                    .attr("class", "overlay")
                    .attr("width", width)
                    .attr("height", height)
                ;
            }

            // load nodes and links into force
            force.nodes(graph.nodes).links(graph.links).start();

            var link = svg.selectAll('.link')
                .data(graph.links).enter()
                .append('line')
                    .attr('class', 'link')
                    .style('stroke', 'green');
            link = svg.selectAll('.link');
            function select(d) {
                if (d.selected) {
                    d.selected = false;
                    d3.select(this)
                        .transition().duration(300)
                            .style('stroke-width', 1)
                            .style('stroke', 'black');
                } else {
                    d.selected = true;
                    d3.select(this)
                        .transition().duration(300)
                            .style('stroke-width', 2)
                            .style('stroke', 'blue');
                }
            }
            function gotoeventpool(d){
                alert("let's go to the event pool: " + d.entity_id);
            }
            // node drag
            var nodedrag = force.drag
                .on('dragstart', function (d) {
                    d3.event.sourceEvent.stopPropagation();
                    d3.select(this).classed("dragging", true);
                })
                .on('dragend', function (d) {
                    d3.select(this).classed("dragging", false);
                })
                ;
            // generate new node container
            var node = svg.selectAll('.node')
                .data(graph.nodes).enter()
                .append('circle')  // node representation
                    .attr('class', 'node')  // every node circle is a node
                    .on('dblclick', gotoeventpool)
                    .on('click', select)
                    .attr('r', function(d) {
                            return (d.next === undefined || d.next.length === 0) ? 1 : (d.next.length + 1);
                        }
                    )
                    .style('fill', function(d) { // set default color to green
                            return (d.state === undefined || d.state === 1) ? 'green' : 'red'
                        }
                    )
                    .call(nodedrag)  // ensure drag of circle
                ;

            node.append('title') // add a title which is the entity id
                    .text(
                        function(d){
                            return d.name ? d.name : d.entity_id;
                        }
                    )
                ;
            node = svg.selectAll('.node');
            force.on('tick', function() {
                svg.selectAll('.link').attr('x1', function(d) {return d.source.x;})
                    .attr('y1', function(d) {return d.source.y;})
                    .attr('x2', function(d) {return d.target.x;})
                    .attr('y2', function(d) {return d.target.y;});

                svg.selectAll('.node').attr('cx', function(d) {return d.x;})
                    .attr('cy', function(d) {return d.y;});
            });

            function playtransition() {
                svg.selectAll('.node').transition().duration(1000).style('fill',
                    function(d, i) {
                        return (Math.random() > 0.5) ? 'green' : 'red';
                    });
                svg.selectAll('.link').transition().duration(1000).style('stroke',
                    function(d, i) {
                        return (Math.random() > 0.5) ? 'green' : 'red';
                    });
            }

            d3.select('.graphplay').on('click', playtransition);

        },

        displaycy: function(nodes) {
            debugger;
            /**
             * Sample HTML5 page for network visualization with cytoscape.js
             *
             * @type {string}
             */
            $(function(){ // on dom ready

                var params = {
                    container: document.getElementById('div.graph'),

                    style: cytoscape.stylesheet()
                        .selector('node')
                            .css({'content': 'data(id)'})
                        .selector('edge')
                            .css({
                                'target-arrow-shape': 'triangle',
                                'width': 4,
                                'line-color': '#ddd',
                                'target-arrow-color': '#ddd'
                            })
                        .selector('.highlighted')
                            .css({
                                'background-color': '#61bffc',
                                'line-color': '#61bffc',
                                'target-arrow-color': '#61bffc',
                                'transition-property': 'background-color, line-color, target-arrow-color',
                                'transition-duration': '0.5s'
                            }),
                    layout: {
                        name: 'breadthfirst',
                        directed: true,
                        roots: '#a',
                        padding: 10
                    },
                    elements: {'nodes': [], 'edges': []}
                };

                for (var i=0; i<nodes.length; i++) {
                    var node = nodes[i];
                    node.data = {id: node._id, weight: node.weight, label: node.cid};
                    params.elements.nodes.push(data);
                    var next = node.next;
                    for (var j=0; j<next.length; j++) {
                        target_id = next[j];
                        var edge = {data: {id: (node._id + target_id), source: node._id, target: target_id}};
                        params.elements.edges.push(edge);
                    }
                }


                var cy = cytoscape(params);

                var bfs = cy.elements().bfs('#a', function(){}, true);

                var i = 0;
                var highlightNextEle = function(){
                  bfs.path[i].addClass('highlighted');

                  if( i < bfs.path.length ){
                    i++;
                    setTimeout(highlightNextEle, 1000);
                  }
                };

                // kick off first highlight
                highlightNextEle();

            }); // on dom ready
        }

    });

    return widget;
});
