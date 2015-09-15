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
    name: 'MetricController',
    initialize: function(container, application) {
        var get = Ember.get,
            set = Ember.set,
            isNone = Ember.isNone,
            __ = Ember.String.loc;


        var controller = Ember.ObjectController.extend({

            needs: ['serie', 'perfdata'],

            fetchSeriesFromSchemaValues: function (caller, store, from, to, seriesMeta, callback){
                /**
                Builds a series array from form series meta.
                :param store: an Ember store allowing perform ajax queries
                :param from: the from date since metric have to be fetched
                :param to: date until metrics are fetched
                :param seriesMeta: information related to series thare are provided by user forms
                :param callback: called when series are fetched with the resulting series array
                series looks like:
                    [{meta: serieRecord, values: [[timestamp_0, value_0, [...]]]}, [...]]
                **/

                var controller = this,
                    seriesController = get(this, 'controllers.serie');

                var seriesFilter = JSON.stringify({
                    crecord_name: {'$in': seriesMeta}
                });

                console.log('widget text series duration queries', from, to);

                store.findQuery(
                    'serie',
                    {filter: seriesFilter}
                    ).then(function(results) {

                    var metas = get(results, 'content');
                    console.log('series records metas', metas);

                    var seriesQueries = [];
                    var length = metas.length;
                    for (var i=0; i<length; i++) {
                        seriesQueries.push(seriesController.fetch(
                            metas[i], from, to
                        ));
                    }

                    console.log('seriesQueries', seriesQueries);

                    Ember.RSVP.all(seriesQueries).then(function (pargs) {
                        var series = [];
                        console.log('series pargs', pargs);
                        var length = pargs.length;
                        for (var i=0; i<length; i++) {
                            var data = pargs[i];
                            series.push({
                                meta: metas[i].toJson(),
                                values: data
                            });
                        }
                        console.log('series fetched', caller, series);
                        callback(caller, series);
                    });

                });

            },

            fetchStylizedMetrics: function(store, from, to, replace, stylizedmetrics, callback) {

                var series = [],
                    seriesById = {},
                    curveIds = [];

                var fetchDone = function() {
                    curveIds = JSON.stringify(curveIds);

                    console.log('series:', seriesById);
                    console.log('curves:', curveIds);

                    store.findQuery('curve', {ids: curveIds}).then(function(curveResult) {
                        var virtualResult = {
                            meta: {
                                total: series.length
                            },
                            content: series,
                        };

                        callback([virtualResult, curveResult], seriesById, from, to, replace);
                    });
                };

                if(!isNone(stylizedmetrics)) {
                    var metricIds = [];

                    for(var i = 0, l = stylizedmetrics.length ; i < l ; i++) {
                        var metricId = get(stylizedmetrics[i], 'metric');

                        metricIds.push(metricId);
                    }

                    store.findQuery('ctxmetric', {
                        _filter: JSON.stringify({
                            _id: {
                                '$in': metricIds
                            }
                        })
                    }).then(function(result) {
                        var metricsById = {}, i, l;

                        for(i = 0, l = get(result, 'content.length') ; i < l; i++) {
                            var info = get(result, 'content')[i];

                            metricsById[get(info, 'id')] = info;
                        }

                        for(i = 0, l = stylizedmetrics.length; i < l; i++) {
                            var metricId = get(stylizedmetrics[i], 'metric');
                            var metricInfo = metricsById[metricId];

                            var serieconf = Ember.Object.create({
                                id: metricId,
                                virtual: true,
                                crecord_name: get(metricInfo, 'name'),
                                metrics: [metricId],
                                aggregate_method: 'none',
                                unit: get(stylizedmetrics[i], 'unit')
                            });

                            seriesById[metricId] = {
                                style: stylizedmetrics[i],
                                serie: serieconf,
                                curve: undefined
                            };

                            series.push(serieconf);
                            curveIds.push(get(stylizedmetrics[i], 'curve'));
                        }

                        fetchDone();
                    });
                }
                else {
                    fetchDone();
                }
            },

            fetchMetricsFromIds: function (caller, from, to, metricIds, callback) {

                var perfdataController = get(this, 'controllers.perfdata'),
                    perfdataQueries = [],
                    length = metricIds.length;

                for (var i=0; i<length; i++) {
                    perfdataQueries.push(
                        perfdataController.fetch(metricIds[i], from, to)
                    );
                }

                Ember.RSVP.all(perfdataQueries).then(function(pargs) {
                    callback(caller, pargs, from, to);
                });

            },

            fetchStylizedSeries: function(store, from, to, replace, stylizedseries, callback) {

                /* fetch stylized series */
                var series = {};
                var curveIds = [];

                for(var i = 0, l = stylizedseries.length; i < l; i++) {
                    var serieId = get(stylizedseries[i], 'serie');

                    series[serieId] = {
                        style: stylizedseries[i],
                        serie: undefined,
                        curve: undefined
                    };

                    curveIds.push(get(stylizedseries[i], 'curve'));
                }

                var serieIds = JSON.stringify(Object.keys(series));
                curveIds = JSON.stringify(curveIds);

                console.log('series:', serieIds);
                console.log('curves:', curveIds);

                /* load series configuration */

                Ember.RSVP.all([
                    store.findQuery('serie', {ids: serieIds}),
                    store.findQuery('curve', {ids: curveIds})
                ]).then(function(pargs) {
                    callback(pargs, series, from, to, replace);
                });
            }
        });

        application.register('controller:metric', controller);
    }
});
