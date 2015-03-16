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
    'app/lib/loaders/schemas',
    'app/lib/utils/forms',
    'app/lib/utils/data',
    'canopsis/uibase/widgets/topology/view',
    'canopsis/uibase/widgets/topology/adapter',
    'jqueryui',
], function($, WidgetFactory, schemas, formsUtils, dataUtils, TopologyViewMixin) {
    var get = Ember.get,
        set = Ember.set;

    var widget = WidgetFactory('topology', {

        viewMixins: [
            TopologyViewMixin
        ],

        graph: null, // canopsis graph model

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
            var me = this;
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
                    event.component = get(this, 'model.graph_id');
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
            result = '/' + get(this, 'model.graph_type') + '/graphs/';

            return result;
        },

        /**
        * Get graph with its elements from a foreign server.
        */
        getGraphFromServer: function(success, failure) {
            var _url = this.getGraphUrl();
            var graph_id = get(this, 'model;graph_id');
            var promise = new Ember.RSVP.Promise(function(resolve, reject) {
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
            result = '/' + get(this, 'model.graph_type') + '/elts/';

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
            // load business
            var me = this;
            // get graph_id
            var graph_id = get(this, 'model.graph_id');
            if (graph_id !== undefined) {
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
                                _id: graph_id,
                                cid: graph_id,
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
            result.info.shape[get(this, 'model.graph_id')] = {
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
            var record_type = record.get('_type');
            switch(record_type) {
                case 'edge':
                    break;
                case 'vertice':
                case 'graph':
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
                    break;
                default: break;
            }
            var recordWizard = formsUtils.showNew(
                'modelform',
                record,
                {inspectedItemType: record.get('type')}
            );
            recordWizard.submit.done(
                function(form) {
                    switch(record_type) {
                        case 'edge':
                            break;
                        case 'vertice':
                        case 'graph':
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
                                        task.params.condition.params.state = states.indexOf(in_state);
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
                            break;
                        default: break;
                    }
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
