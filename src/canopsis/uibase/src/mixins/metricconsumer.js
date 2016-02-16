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

Ember.Application.initializer({
    name: 'MetricConsumer',
    after: ['MixinFactory', 'SerieController', 'PerfdataController'],
    initialize: function(container, application) {
        var MixinFactory = container.lookupFactory('factory:mixin'),
            serie = container.lookup('controller:serie'),
            perfdata = container.lookup('controller:perfdata');

        var get = Ember.get;

        /**
         * @mixin MetricConsumer
         * @augments Mixin
         * @description Provide Metric fetching mecanism to widgets.
         */
        var mixin = MixinFactory('metricconsumer', {

            /**
             * @description returns metrics relative to a given filter
             * @method findMetrics
             * @param {object} mfilter
             * @returns Promise
             */
            findMetrics: function(mfilter) {
                var store = get(this, 'widgetDataStore'),
                    query = {filter: mfilter};
                return store.findQuery('ctxmetric', query);
            },

            /**
             * @method aggregateMetrics
             * @param {object} mfilter Filter used to get metrics
             * @param {number} from Beginning of time window
             * @param {number} to End of time window
             * @param {string} method Aggregation method
             * @param {number} interval Aggregation interval in seconds
             * @returns Promise
             */
            aggregateMetrics: function(mfilter, from, to, method, interval) {
                var me = this;

                return new Ember.RSVP.Promise(function(resolve, reject) {

                    if (typeof mfilter === 'object') {
                        // Get metrics with the given filter parameter
                        me.findMetrics(mfilter).then(function (result){
                            /**
                             * @property {array} metrics List of metrics used to request perfdata
                             */
                            var metrics = [],
                                content = get(result, 'content'),
                                total = get(result, 'meta.total');

                            console.log('Received data:', total, content, metrics);

                            for(var i = 0; i < total; i++) {
                                metrics.pushObject(content[i].id);
                            }

                            // Get perdata with metrics found above
                            var promise = perfdata.aggregateMany(metrics, from, to, method, interval);

                            promise.then(function(result) {
                                if (get(result, 'success') === true) {
                                    me.onMetrics(get(result, 'data'));
                                    resolve(result);
                                }
                                else {
                                    console.error('Metric aggregation failed:', get(result, 'data'));
                                    reject(result);
                                }
                            }, function() {
                                console.error('Metric aggregation request failed:', arguments);
                                reject(arguments);
                            });
                        });
                    }
                    else {
                        // Get perdata with metrics found above
                        var promise = perfdata.aggregateMany(mfilter, from, to, method, interval);

                        promise.then(function(result) {
                            if (get(result, 'success') === true) {
                                me.onMetrics(get(result, 'data'));
                                resolve(result);
                            }
                            else {
                                console.error('Metric aggregation failed:', get(result, 'data'));
                                reject(result);
                            }
                        }, function() {
                            console.error('Metric aggregation request failed:', arguments);
                            reject(arguments);
                        });
                    }
                });
            },

            /**
             * @method fetchMetrics
             * @param {object} mfilter Filter used to get metrics
             * @param {number} from - Beginning of time window
             * @param {number} to - End of time window
             * @returns Promise
             */
            fetchMetrics: function(mfilter, from, to) {
                var me = this;

                return new Ember.RSVP.Promise(function(resolve, reject) {

                    if (typeof mfilter === 'object') {
                        // Get metrics with the given filter parameter
                        me.findMetrics(mfilter).then(function (result){
                            /**
                             * @property {array} metrics List of metrics used to request perfdata
                             */
                            var metrics = [],
                                content = get(result, 'content'),
                                total = get(result, 'meta.total');

                            console.log('Received data:', total, content, metrics);

                            for(var i = 0; i < total; i++) {
                                metrics.pushObject(content[i]);
                            }
                            // Get perdata with metrics found above
                            var promise = perfdata.fetchMany(metrics, from, to);

                            promise.then(function(result) {
                                if (get(result, 'success') === true) {
                                    me.onMetrics(get(result, 'data'));
                                    resolve(result);
                                }
                                else {
                                    console.error('Metrics fetching failed:', get(result, 'data'));
                                    reject(result);
                                }
                            }, function() {
                                console.error('Metric fetch request failed:', arguments);
                                reject(arguments);
                            });
                        });
                    }
                    else {
                        var promise = perfdata.fetchMany(metrics, from, to);

                        promise.then(function(result) {
                            if (get(result, 'success') === true) {
                                me.onMetrics(get(result, 'data'));
                                resolve(result);
                            }
                            else {
                                console.error('Metrics fetching failed:', get(result, 'data'));
                                reject(result);
                            }
                        }, function() {
                            console.error('Metric fetch request failed:', arguments);
                            reject(arguments);
                        });
                    }
                });
            },

            /**
             * @abstract
             * @method onMetrics
             * @param {array} metrics - Metrics fetched from PerfDataController
             * Called by ``fetchMetrics()`` and ``aggregateMetrics()`` methods.
             */
            onMetrics: function(metrics) {
                void(metrics);
            },

            /**
             * @method fetchSeries
             * @param {array} series - Series name to fetch
             * @param {number} from - Beginning of time window
             * @param {number} to - End of time window
             * @returns Promise
             */
            fetchSeries: function (series, from, to) {
                var store = get(this, 'widgetDataStore'),
                    me = this;

                var query = {
                    filter: JSON.stringify({
                        crecord_name: {'$in': series}
                    })
                };

                new Ember.RSVP.Promise(function(resolve, reject) {
                    store.findQuery('serie', query).then(function(result) {
                        if(get(result, 'meta.success') !== true) {
                            console.error('Series fetching failed:', get(result, 'content'));
                            reject(result);
                        }
                        else {
                            var queries = [];

                            get(result, 'content').forEach(function(serieconf) {
                                queries.push(serie.fetch(serieconf, from, to));
                            });

                            Ember.RSVP.all(queries).then(function(pargs) {
                                var chartSeries = [];

                                pargs.forEach(function(data, i) {
                                    chartSeries.push({
                                        label: series[i].replace(/ /g, '_'),
                                        points: data
                                    });
                                });

                                me.onSeries(chartSeries);
                                resolve(chartSeries);
                            }, function() {
                                console.error('Series computation failed:', arguments);
                                reject(arguments);
                            });
                        }
                    }, function() {
                        console.log('Series request failed:', arguments);
                        reject(arguments);
                    });
                });
            },

            /**
             * @abstract
             * @method onSeries
             * @param {array} series - Series fetched from SerieController
             * Called by ``fetchSeries()`` method.
             */
            onSeries: function(series) {
                void(series);
            }
        });

        application.register('mixin:metricconsumer', mixin);
    }
});
