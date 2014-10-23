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
    'ember',
    'ember-data',
    'app/application',
    'app/lib/factories/widget',
    'app/components/flotchart/component',
    'app/controller/serie'
], function($, Ember, DS, Application, WidgetFactory) {
    var get = Ember.get,
        set = Ember.set;

    var widgetOptions = {};
    var FlotChartViewMixin = Ember.Mixin.create({
        didInsertElement: function() {
            //get the timestamp, and not the date object

            var now = +new Date();
            var config = get(this, 'controller.config');

            console.group('timegraph init');

            // fill chart options
            set(this, 'controller.timenav', get(config, 'timenav'));

            chartOptions = get(this, 'controller.chartOptions') || {};
            $.extend(chartOptions, {
                zoom: {
                    interactive: false
                },

                selection: {
                    mode: 'x'
                },

                crosshair: {
                    mode: 'x'
                },

                grid: {
                    hoverable: true,
                    clickable: true
                },

                xaxes: [{
                    show: true,
                    reserveSpace: true,
                    min: now - get(config, 'time_window_offset') - get(config, 'time_window'),
                    max: now - get(config, 'time_window_offset'),
                    position: 'bottom',
                    mode: 'time',
                    timezone: 'browser'
                }],

                yaxes: [{
                    show: true,
                    reserveSpace: true
                }],

                legend: {
                    hideable: true,
                    legend: get(config, 'legend'),
                    container: this.$('.flotchart-legend-container'),
                    labelFormatter: function(label, series){
                        var id = series.chart.id;
                        return '<span style="text-decoration: underline;" onClick="enableSerie(\''+ label +'\', \''+ id +'\' , this); return false;">'+label+'</span>';
                    }
                },
/*
                tooltip: {
                    show: get(config, 'tooltip'),
                    template_tooltip: "<strong> #label </strong><br> : <strong> #y </strong>(USD)"
                }
*/
                tooltip: get(config, 'tooltip')
            });

            console.log('Configure chart:', chartOptions);
            set(this, 'controller.chartOptions', chartOptions);

            console.groupEnd();

            this._super.apply(this, arguments);
        }
    });

    var widget = WidgetFactory('timegraph', {
        needs: ['serie'],

        viewMixins: [
            FlotChartViewMixin
        ],

        chartOptions: undefined,
        flotSeries: Ember.Object.create({}),
        dataSeries: Ember.A(),

        timenav: false,

        init: function() {
            this._super();
        },

        findItems: function() {
            console.group('Fetch series:');

            var me = this;

            var replace = false;
            var from = get(this, 'lastRefresh');
            var to = +new Date() - get(this, 'config.time_window_offset');

            if(from === null) {
                replace = true;
                from = to - get(this, 'config.time_window') - get(this, 'config.time_window_offset');
            }

            console.log('refresh:', from, to, replace);

            var store = get(this, 'widgetDataStore');

            /* fetch stylized series */
            var stylizedseries = get(this, 'config.series');
            var series = {};
            var curveIds = [];

            for(var i = 0, l = stylizedseries.length; i < l; i++) {
                var serieId = stylizedseries[i].serie;

                series[serieId] = {
                    style: stylizedseries[i],
                    serie: undefined,
                    curve: undefined
                };

                curveIds.push(stylizedseries[i].curve);
            }

            var serieIds = JSON.stringify(Object.keys(series));
            curveIds = JSON.stringify(curveIds);

            console.log('series:', serieIds);
            console.log('curves:', curveIds);

            console.groupEnd();

            /* load series configuration */
            Ember.RSVP.all([
                store.findQuery('serie', {ids: serieIds}),
                store.findQuery('curve', {ids: curveIds})
            ]).then(function(pargs) {
                console.group('Generate FlotChart series');

                var serieResult = pargs[0]; // arguments of first promise
                var curveResult = pargs[1]; // arguments of second promise

                var i, li;

                console.log('Fetch curves');
                for(i = 0, li = curveResult.meta.total; i < li; i++) {
                    var curve = curveResult.content[i];

                    for(var j = 0, lj = serieResult.meta.total; j < lj; j++) {
                        var serieconf = serieResult.content[j];

                        var serieId = serieconf.id;

                        if(series[serieId] !== undefined) {
                            var config = series[serieId];

                            if(get(config, 'style.curve') === curve.id) {
                                set(config, 'curve', curve);
                                /*when a filter mongo contain serveral times the same id, only one instance of this object will be returned.
                                So, if two series use the same curve, only one curve will be returned by "store.findQuery('curve', {ids: curveIds})"
                                Since there will be only one instance of each used curve, we have to find for each curve all series that use it.*/
                               //break;
                            }
                        }
                    }
                }

                console.log('Fetch series');
                set(me, 'flotSeries', Ember.Object.create({}));

                for(i = 0, li = serieResult.meta.total; i < li; i++) {
                    var serieconf = serieResult.content[i];

                    var serieId = serieconf.id;

                    if(series[serieId] !== undefined) {
                        var config = series[serieId];
                        set(config, 'serie', serieconf);

                        me.genFlotSerie(config, from, to);
                    }
                }

                console.groupEnd();
            });
        },

        genFlotSerie: function(config, from, to, replace) {
            console.group('Generating FlotChart serie:', config);
            var me = this;
            var flotSerie = {
                template_tooltip: "<strong> #label </strong><br> : <strong> #y </strong>(USD)",
                chart: this.get("chart"),
                label: get(config, 'serie.crecord_name'),
                color: get(config, 'style.color'),
                lines: {
                    show: get(config, 'curve.lines'),
                    used: get(config, 'curve.lines'),
                    lineWidth: get(config, 'curve.line_width'),
                    fill: (get(config, 'curve.areas') ? get(config, 'curve.area_opacity') : false)
                },
                bars: {
                    show: get(config, 'curve.bars'),
                    used: get(config, 'curve.bars'),
                    barWidth: get(config, 'curve.bar_width')
                },
                points: {
                    show: get(config, 'curve.points'),
                    used: get(config, 'curve.points'),
                    symbol: get(config, 'curve.point_shape')
                },
                xaxis: parseInt(get(config, 'style.xaxis')),
                yaxis: parseInt(get(config, 'style.yaxis')),
                clickable: true,
                hoverable: true
            };

            var oldSerie = get(this, 'flotSeries.' + get(config, 'style.serie'));

            if(oldSerie !== undefined && !replace) {
                flotSerie.data = oldSerie.data;
            }
            else {
                flotSerie.data = [];
            }

            console.log('flotserie:', flotSerie);
            console.log('Fetch perfdata and compute serie');

            var ctrl = get(this, 'controllers.serie');
            ctrl.getDataSerie(get(config, 'serie'), from, to).then(function(data) {
                console.log('getDataSerie:', data);

                flotSerie.data = flotSerie.data.concat(data);

                set(me, 'flotSeries.' + get(config, 'style.serie'), flotSerie);
                me.recomputeDataSeries();
            });

            console.groupEnd();
        },

        recomputeDataSeries: function() {
            var flotSeries = get(this, 'flotSeries');
            var series = [];

            var serieIds = Object.keys(flotSeries);

            for(var i = 0, l = serieIds.length; i < l; i++) {
                var serieId = serieIds[i];

                series.push(flotSeries[serieId]);
            }

            console.log('dataSeries:', series);
            set(this, 'dataSeries', series);
        }
    }, widgetOptions);

    return widget;
});
