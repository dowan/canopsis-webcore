/**
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

Ember.Application.initializer({
    name: 'PerfdataController',
    after: 'DataUtils',
    initialize: function(container, application) {
        var dataUtils = container.lookupFactory('utility:data');

        var get = Ember.get,
            set = Ember.set;

        /**
         * Manage metric data fetch from API with possible aggregation in canopsis UI
         * @class PerfdataController
         **/

        var controller = Ember.ObjectController.extend({
            needs: ['application'],

            /**
             * Fetch metric data from api depending metric_id, start and stop date
             * @param {string} metric_id the metric data identifier to fetch
             * @param {int} tstart start date to fetch metric
             * @param {int} tend stop date to fetch metric
             **/
            fetch: function(metric_id, tstart, tend) {
                var applicationController = get(this, 'controllers.application');
                applicationController.addConcurrentLoading('perfdata');

                var pojoAdapter = dataUtils.getEmberApplicationSingleton().__container__.lookup('adapter:pojo');
                var requestOptions = {
                    'metric_id': metric_id,
                    'timewindow': JSON.stringify({
                        'start': tstart / 1000,
                        'stop': tend / 1000,
                        'timezone': new Date().getTimezoneOffset()
                    }),
                    'timeserie': JSON.stringify({
                        'aggregation': 'NONE'
                    })
                };

                //createRecord is used as it is a POST request
                var promise = pojoAdapter.createRecord('perfdata', undefined, requestOptions);

                promise.then(function() {
                    applicationController.removeConcurrentLoading('perfdata');
                }, function() {
                    applicationController.removeConcurrentLoading('perfdata');
                });

                return promise;
            },

            /**
             * Fetch many metric data at once
             * @param {array} metrics is a metric id array
             * @param {int} tstart start date to fetch metric
             * @param {int} tend stop date to fetch metric
             **/

            fetchMany: function(metrics, tstart, tend) {
                return this.fetch(JSON.stringify(metrics), tstart, tend);
            },

            /**
             * Fetch aggregated metric data
             * @param {string} metric_id is the metric identifier to fetch and aggregate
             * @param {int} tstart start date to fetch metric
             * @param {int} tend stop date to fetch metric
             * @param {string} method aggregation method to apply to the fetched data
             * @param {string} interval aggregation interval to apply to the fetched data
             **/

            aggregate: function(metric_id, tstart, tend, method, interval) {
                var applicationController = get(this, 'controllers.application');
                applicationController.addConcurrentLoading('perfdata');

                //FIXME refactor this to stop using getCanopsis
                var pojoAdapter = dataUtils.getEmberApplicationSingleton().__container__.lookup('adapter:pojo');
                var requestOptions = {
                    'metric_id': metric_id,
                    'timewindow': JSON.stringify({
                        'start': tstart / 1000,
                        'stop': tend / 1000,
                        'timezone': new Date().getTimezoneOffset()
                    }),
                    'timeserie': JSON.stringify({
                        'aggregation': method,
                        'period': {
                            'second': interval
                        }
                    })
                };

                //createRecord is used as it is a POST request
                var promise = pojoAdapter.createRecord('perfdata', undefined, requestOptions);

                promise.then(function() {
                    applicationController.removeConcurrentLoading('perfdata');
                }, function() {
                    applicationController.removeConcurrentLoading('perfdata');
                });

                return promise;
            },


            /**
             * Fetch many aggregated metric data at once
             * @param {array} metrics metric identifier list to fetch and aggregate
             * @param {int} tstart start date to fetch metric
             * @param {int} tend stop date to fetch metric
             * @param {string} method aggregation method to apply to the fetched data
             * @param {string} interval aggregation interval to apply to the fetched data
             **/

            aggregateMany: function(metrics, tstart, tend, method, interval) {
                return this.aggregate(JSON.stringify(metrics), tstart, tend, method, interval);
            }
        });

        application.register('controller:perfdata', controller);
    }
});
