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

        var get = Ember.get,
            set = Ember.set,
            isNone = Ember.isNone;

        var mixin = MixinFactory('metricconsumer', {
            aggregateMetrics: function(metrics, from, to, method, interval) {
                var promise = perfdata.aggregateMany(metrics, from, to, method, interval);
                var me = this;

                return promise.then(function(result) {
                    me.onMetrics(get(result, 'data'));
                });
            },

            fetchMetrics: function(metrics, from, to) {
                var promise = perfdata.fetchMany(metrics, from, to);
                var me = this;

                return new Ember.RSVP.Promise(function(resolve, reject) {
                    promise.then(function(result) {
                        if (get(result, 'success') === true) {
                            me.onMetrics(get(result, 'data'));
                            resolve(result);
                        }
                        else {
                            reject(get(result, 'data'));
                        }
                    }
                });
            },

            onMetrics: function(metrics) {
                ;
            },

            fetchSeries: function (series, from, to) {
                var store = get(this, 'widgetDataStore'),
                    me = this;

                var query = {
                    filter: JSON.stringify({
                        crecord_name: {'$in': series}
                    })
                };

                var promise = new Ember.RSVP.Promise(function(resolve, reject) {
                    store.findQuery('serie', query).then(function(result) {
                        var queries = [];

                        if(get(result, 'success') !== true)
                        {
                            reject(get(result, 'content'));
                        }
                        else
                        {
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

                                resolve(chartSeries);
                            }, reject);
                        }
                    }, reject);
                });

                return promise.then(function(series) {
                    me.onSeries(series);
                });
            },

            onSeries: function(series) {
                ;
            }
        });

        application.register('mixin:metricconsumer', mixin);
    }
});