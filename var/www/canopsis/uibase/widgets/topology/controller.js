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
* They are saved in controller.recordsById dictionary (like record elements).
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
        recordsById: {}, // record elements by id

        graph_cls: 'canopsis.topology.elements.Topology', // default graph class

        defaultVerticeCls: 'canopsis.topology.elements.TopoNode', // default vertice class
        defaultEdgeCls: 'canopsis.topology.elements.TopoEdge', // default edge class

        graphEltType: 'topo', // graph elt type
        verticeEltType: 'toponode', // vertice elt type
        edgeEltType: 'topoedge', // edge elt type

        selected: [], // selected records

        init: function() {
            this._super.apply(this, arguments);
        },

        /**
        * Get entities from a foreign server.
        * @param entityIds list of entity ids from where get entities.
        * @param success handler to request success.
        * @param failure handler to request failure.
        */
        getEntitiesFromServer: function(entityIds, success, failure) {
            if (entityIds.length > 0) {
                var promise = new Ember.RSVP.Promise(function(resolve, reject) {
                    $.ajax(
                        {
                            url: '/context/ids',
                            type: 'POST',
                            data: {
                                'ids': JSON.stringify(entityIds),
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
            var recordsById = this.recordsById;
            // register the graph
            this.graph = graph;
            recordsById[graph.get('id')] = graph;
            // add all graph elts
            var _delts = graph.get('_delts');
            // and in doing the server request
            Object.keys(_delts).forEach(
                function(elt_id) {
                    var elt = _delts[elt_id];
                    elt.id = elt_id;
                    var record = this.widgetDataStore.createRecord(
                        elt['type'], elt
                    );
                    recordsById[elt_id] = record;
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
            // get graphId
            var graphId = get(this, 'model.graph_id');
            if (graphId !== undefined) {
                var query = {
                    ids: graphId,
                    add_elts: true
                };
                this.widgetDataStore.find('graph', query).then(
                    function(result) {
                        var graph = null;
                        if (result.content.length > 0) {  // if content exists
                            // get graph and elt ids
                            graph = result.content[0];
                            // if old graph exists
                            if (me.graph !== null) {
                                // delete old records
                                var recordsToDelete = me.recordsById.map(
                                    function(recordId) {
                                        var record = me.recordsById[recordId];
                                        return record.destroyRecord();
                                    },
                                    me
                                );
                            }
                            me._addGraph(graph);
                        } else {  // if no graph exists
                            me.graph = this.newRecord(me.graphEltType);
                        }
                    },
                    function(reason) {
                        var graph = me.widgetDataStore.createRecord(
                            me.graphEltType, {id: graphId}
                        );
                        graph.save().then(function(record){me._addGraph(record)});
                    }
                );
            }
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
            var graphId = this.graph.get('id');
            // delete all records
            records.forEach(
                function(record) {
                    // but the main graph
                    if (record.get('id') === graphId) {
                        console.error('Impossible to delete the main graph');
                    } else {
                        // let the backend delete records
                        var recordsToDelete = records.map(
                            function(record) {
                                return record.destroyRecord();
                            }
                        );
                        Ember.RSVP.all(recordsToDelete).then(
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
                    // save view elt information in the dictionary of view graphId
                    if (info.view === undefined) {
                        info.view = {};
                    }
                    info.view[get(this, 'model.graph_id')] = record.view;
                    // save the record
                    return record.save();
                }
            );
            // execute promises
            Ember.RSVP.all(promises).then(success, context).catch(failure, context);
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
            var result = this.widgetDataStore.createRecord(type, properties);
            function _success(record) {
                var recordId = record.get('id');
                var oldRecord = this.recordsById[recordId];
                if (oldRecord !== undefined) {
                    this.deleteRecords(oldRecord);
                }
                this.recordsById[recordId] = record;
                if (success !== undefined) {
                    success.call(context, record);
                }
            }
            function _failure(reason) {
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
                record = this.recordsById[record];
            }
            // fill operator data from record
            var recordType = record.get('_type');
            switch(recordType) {
                case 'edge':
                    break;
                case 'vertice':
                case 'graph':
                    var states = ['ok', 'minor', 'major', 'critical'];
                    function getShortId(task) {
                        var taskId = task.cid || task;
                        var lastIndex = taskId.lastIndexOf('.');
                        var result = taskId.substring(lastIndex + 1);
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
                                var operatorName = getShortId(task);
                                if (operatorName === 'condition') {  // at least / nok
                                    var params = task.params;
                                    if (params !== undefined) {
                                        var condition = params.condition;
                                        if (condition !== undefined) {
                                            var conditionName = getShortId(condition.cid || condition);
                                            record.set('operator', conditionName);
                                            var condParams = condition.params;
                                            if (condParams !== undefined) {
                                                // set inState
                                                if (conditionName === 'nok') {
                                                    record.set('operator', 'nok');
                                                } else {
                                                    var inState = condParams.state;
                                                    var f = condParams.f;
                                                    if (f === 'canopsis.topology.rule.condition.is_nok') {
                                                        inState = 'nok';
                                                    } else {
                                                        if (inState !== undefined) {
                                                            inState = states[inState];
                                                            record.set('in_state', inState);
                                                        }
                                                    }
                                                }
                                                // set minWeight
                                                var minWeight = condParams.minWeight;
                                                if (minWeight !== undefined) {
                                                    record.set('min_weight', minWeight);
                                                }
                                                // set thenState
                                                var statement = params.statement;
                                                if (statement !== undefined) {
                                                    var statement_name = getShortId(statement);
                                                    if (statement_name === 'change_state') {
                                                        var statementParams = statement.params;
                                                        if (statementParams !== undefined) {
                                                            var thenState = statementParams.state;
                                                            thenState = states[thenState];
                                                            record.set('then_state', thenState);
                                                        }
                                                    } else {
                                                        var thenState = statement_name;
                                                        record.set('then_state', thenState);
                                                    }
                                                }
                                                // set elseState
                                                var _else = params._else;
                                                if (_else !== undefined) {
                                                    var _elseName = getShortId(_else);
                                                    if (_elseName === 'change_state') {
                                                        var _elseParams = _else.params;
                                                        if (_elseParams !== undefined) {
                                                            var elseState = _elseParams.state;
                                                            elseState = states[elseState];
                                                            record.set('else_state', elseState);
                                                        }
                                                    } else {
                                                        var elseState = _elseName;
                                                        record.set('else_state', elseState);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                } else {  // simple task
                                    record.set('operator', operatorName);
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
                    switch(recordType) {
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
                                    // set minWeight
                                    if (operator === '_all') {
                                        task.params.condition.params.minWeight = null;
                                    } else {
                                        var minWeight = record.get('minWeight');
                                        task.params.condition.params.minWeight = minWeight;
                                    }
                                    // set inState
                                    var inState = record.get('inState');
                                    if (inState === 'nok') {
                                        task.params.condition.params.f = 'canopsis.topology.rule.condition.is_nok';
                                        task.params.condition.params.state = null;
                                    } else {
                                        task.params.condition.params.state = states.indexOf(inState);
                                    }
                                    // set thenState
                                    var thenState = record.get('thenState');
                                    task.params.statement = {
                                        cid: 'canopsis.topology.rule.action.',
                                        params: {}
                                    };
                                    switch(thenState) {
                                        case 'worst_state':
                                        case 'best_state':
                                            task.params.statement.cid += thenState;
                                            break;
                                        default:
                                            thenState = states.indexOf(thenState);
                                            task.params.statement.cid += 'change_state';
                                            task.params.statement.params.state = thenState;
                                    }
                                    // set elseState
                                    var elseState = record.get('elseState');
                                    task.params._else = {
                                        cid: 'canopsis.topology.rule.action.',
                                        params: {}
                                    };
                                    switch(elseState) {
                                        case 'worst_state':
                                        case 'best_state':
                                            task.params._else.cid += elseState;
                                            break;
                                        default:
                                            elseState = states.indexOf(elseState);
                                            task.params._else.cid += 'change_state';
                                            task.params._else.params.state = elseState;
                                    }
                                    break;
                                default: break;
                            }
                            // update info
                            record.set('info', info);
                            break;
                        default: break;
                    }
                    function _success(record) {
                        record = record[0];
                        me.trigger('refresh');
                        if (success !== undefined) {
                            success.call(context, record);
                        }
                    }
                    function _failure(record) {
                        if (failure !== undefined) {
                            failure.call(context, record);
                        }
                    }
                    // save the record
                    me.saveRecords(record, _success, _failure, me);
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
