/*
 * Copyright (c) 2015 "Capensis" [http://www.capensis.com]
 *
 * This file is part of Canopsis.
 *
 * Canopsis is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Canopsis is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Canopsis. If not, see <http://www.gnu.org/licenses/>.
 */

define([
    'ember',
    'ember-data',
    'canopsis/canopsis-backend-ui-connector/adapters/perfmeta'
], function(Ember, DS) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    var component = Ember.Component.extend({
        columns: [{
            'name': 'name', 'title': __('Metric')
        },{
            'name': 'warn', 'title': __('Warning')
        },{
            'name': 'crit', 'title': __('Critical')
        },{
            'name': 'state', 'title': __('State')
        }],

        init: function() {
            this._super.apply(this, arguments);

            set(this, 'componentDataStore', DS.Store.create({
                container: this.get('container')
            }));

            this.refreshContent();
        },

        refreshContent: function() {
            var store = get(this, 'componentDataStore'),
                perfdata = get(this, 'controllers.perfdata'),
                cmp = this;

            var query = {
                _filter: JSON.stringify({
                    connector: get(this, 'controller.record.connector'),
                    connector_name: get(this, 'controller.record.connector_name'),
                    component: get(this, 'controller.record.component'),
                    resource: get(this, 'controller.record.resource'),
                    type: 'metric',
                    internal: (get(this, 'controller.record.connector') === 'Engine')
                })
            };

            store.findQuery('context', query).then(function(result) {
                var metrics = get(result, 'content'),
                    metricsById = {},
                    query = {metric_id: []};

                metrics.forEach(function(metric) {
                    var metric_id = get(metric, '_id');

                    query.metric_id.push(metric_id);
                    set(metricsById, metric_id, metric);
                });

                query.metric_id = JSON.stringify(query.metric_id);

                var adapter = getCanopsis().Application.__container__.lookup('adapter:perfmeta');
                adapter.createRecord('perfmeta', undefined, {data: query}).then(
                    function(response) {
                        var metas = response.data[0];

                        var content = Ember.A();

                        for(var metric_id in metas) {
                            var metric_metas = metas[metric_id];
                            var metric = get(metricsById, metric_id);

                            var meta = {
                                timestamp: 0
                            };

                            metric_metas.forEach(function(metric_meta) {
                                if (get(meta, 'timestamp') <= get(metric_meta, 'timestamp')) {
                                    meta = metric_meta;
                                }
                            });

                            var item = get(meta, 'value');
                            set(item, 'name', get(metric, 'name'));

                            content.pushObject(Ember.Object.create(item));
                        }

                        set(cmp, 'content', content);
                    }
                );
            });
        },

        actions: {
        }
    });


    Ember.Application.initializer({
        name:"component-perfalert",
        initialize: function(container, application) {
            application.register('component:component-perfalert', component);
        }
    });

    return component;
});
