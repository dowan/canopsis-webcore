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
* This widget contains graph records (vertices, edges and graphs).
* They are saved in controller.records_by_id dictionary (like record elements).
*
* The process begins in executing the updateModel method.
* This last aims to retrieve a graph with its elements.
* Once the graph is retrieved, all elements including the graph, are
* transformed into schemas records and saved in the dictionary graph._delts where keys are record uid.
* A vertice becomes a node, an edge becomes a set of node and links, and the graph is a node as well.
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

        graph: null, // graph record
        records_by_id: {}, // record elements by id

        graph_cls: 'canopsis.topology.elements.Topology', // default graph class

        default_vertice_cls: 'canopsis.topology.elements.TopoNode', // default vertice class
        default_edge_cls: 'canopsis.topology.elements.TopoEdge', // default edge class

        business: null, // business controller

        graph_div: null, // graph div markup

        graph_elt_type: 'topo', // graph elt type
        vertice_elt_type: 'toponode', // vertice elt type
        edge_elt_type: 'topoedge', // edge elt type

        selected: [], // selected records

        init: function() {
            this._super.apply(this, arguments);
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
        * Add a graph and all its related elements into this records.
        *
        * @param graph graph to add with all inner elements.
        */
        _addGraph: function(graph) {
            var me = this;
            var records_by_id = this.records_by_id;
            // register the graph
            this.graph = graph;
            records_by_id[graph.get('id')] = graph;
            // add all graph elts
            var _delts = graph.get('_delts');
            // and in doing the server request
            Object.keys(_delts).forEach(
                function(elt_id) {
                    var elt = _delts[elt_id];
                    var record = this.newRecord(elt['type'], elt);
                    records_by_id[elt_id] = record;
                },
                me
            );
            // refresh the view
            me.trigger('refresh');
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
                var query = {
                    ids: graph_id,
                    add_elts: true
                };
                var store = this.widgetDataStore;
                store.find('graph', query).then(
                    function(result) {
                        var graph = null;
                        if (result.content.length > 0) {  // if content exists
                            // get graph and elt ids
                            graph = result.content[0];
                            // if old graph exists
                            if (me.graph !== null) {
                                // delete old records
                                var records_to_delete = me.records_by_id.map(
                                    function(record_id) {
                                        var record = me.records_by_id[record_id];
                                        record.delete();
                                        return record.save();
                                    },
                                    me
                                );
                            }
                            me._addGraph(graph);
                        } else {  // if no graph exists
                            me.graph = this.newRecord(me.graph_elt_type);
                        }
                    },
                    function(reason) {
                        console.log(reason);
                    }
                );
            }
        },

        /**
        * return unique id.
        */
        uuid: function(record) {
            var result = ''+Math.random();//this.widgetDataStore.adapterFor('graphelt').generateIdForRecord(record);
            return result;
        },

        /**
        * Delete record(s).
        * @param records record(s) to delete.
        */
        deleteRecords: function(records) {
            // ensure records is an array of records
            if (! Array.isArray(records)) {
                records = [records];
            }
            var me = this;
            var graph_id = this.graph.get('id');
            // delete all records
            records.forEach(
                function(record) {
                    // but the main graph
                    if (record.get('id') === graph_id) {
                        console.error('Impossible to delete the main graph');
                    } else {
                        // let the backend delete records
                        var records_to_delete = records.map(
                            function(record) {
                                record.delete();
                                return record.save();
                            }
                        );
                        RSVP.all(records_to_delete).then(
                            function() {
                                me.trigger('refresh');
                            }
                        );
                    }
                }
            );
        },

        /**
        * Select input record(s) in order to get detail informations.
        *
        * @param records record(s) to select.
        */
        select: function(records) {
            if (! Array.isArray(records)) {
                records = [records];
            }
            records.forEach(
                function(record) {
                    this.selected[record.id] = record;
                },
                this
            )
            this.trigger('refresh');
        },

        /**
        * Unselect input record(s) in order to get detail informations.
        *
        * @param records record(s) to unselect.
        */
        unselect: function(records) {
            if (! Array.isArray(records)) {
                records = [records];
            }
            records.forEach(
                function(record) {
                    delete this.selected[record.id];
                },
                this
            );
            this.trigger('refresh');
        },

        /**
        * Save records.
        *
        * @param records records to save.
        */
        saveRecords: function(records, success, failure, context) {
            // ensure records is an array of records
            if (! Array.isArray(records)) {
                records = [records];
            }
            // save all records in an array of promises
            var promises = records.map(
                function(record) {
                    var info = record.get('info');
                    // save view elt information in the dictionary of view graph_id
                    if (info.view === undefined) {
                        info.view = {};
                    }
                    info.view[get(this, 'model.graph_id')] = record.view;
                    // save the record
                    return record.save();
                }
            );
            // execute promises
            RSVP.all(promises).then(success, context).catch(failure, context);
        },

        /**
        * Convert input elt to a record, or returns it if already a record.
        *
        * @param elt element to convert. If undefined, get default vertice element.
        * @param edit edit record with a form if true.
        * @param success edition success callback. Takes record in parameter.
        * @param failure edition failure callback. Takes record in parameter.
        */
        newRecord: function(type, properties, edit, success, failure, context) {
            var id = null;
            // ensure id exists
            if (properties !== undefined) {
                id = properties.id;
                if (id === undefined) {
                    id = properties.cid;
                    if (id === undefined) {
                        id = this.uuid();
                    }
                }
            } else {
                properties = {};
                id = this.uuid();
            }
            properties.id = id;
            properties.cid = id;
            var result = this.widgetDataStore.createRecord(type, properties);
            function _success(record) {
                var record_id = record.get('id');
                var old_record = this.records_by_id[record_id];
                if (old_record !== undefined) {
                    this.deleteRecords(old_record);
                }
                this.records_by_id[record_id] = record;
                if (success !== undefined) {
                    success.call(context, record);
                }
            }
            function _failure(record) {
                record.delete();
                record.save();
                if (failure !== undefined) {
                    failure.call(context, record);
                }
            }
            if (edit) {
                this.editRecord(result, _success, _failure, this);
            }
            return result;
        },

        /**
        * Edit a record.
        *
        * @param record record to edit. Can be a record id.
        * @param success edition success callback. Takes record in parameter.
        * @param failure edition failure callback. Takes record in parameter.
        */
        editRecord: function(record, success, failure, context) {
            var me = this;
            // ensure record is a record in case of record id
            if (typeof record === 'string') {
                record = this.records_by_id[record];
            }
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
                    // save the record
                    this.saveRecords(record, success, failure, context);
                }
            ).fail(
                function(form) {
                    if (failure !== undefined) {
                        failure.call(context, record);
                    }
                }
            );
        },

    });

    return widget;
});
