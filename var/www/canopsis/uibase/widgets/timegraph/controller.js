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
    'app/lib/factories/widget',
    'canopsis/uibase/components/flotchart/component',
    'app/controller/serie'
], function($, Ember, DS, WidgetFactory) {
    var get = Ember.get,
        set = Ember.set;

    var widgetOptions = {};

    var FlotChartViewMixin = Ember.Mixin.create({
        didInsertElement: function() {
            var ctrl = get(this, 'controller');

            console.group('timegraph init');

            var updateGrid = function(evt, ranges) {
                // little hack so chartOptions will always notify its observers
                var chartOptions = get(ctrl, 'chartOptions');

                var opts = {};
                $.extend(opts, chartOptions);

                set(opts, 'xaxis.min', ranges.xaxis.from);
                set(opts, 'xaxis.max', ranges.xaxis.to);
                set(ctrl, 'chartOptions', opts);

                set(ctrl, 'zooming', true);
            };

            // fill chart options
            this.setDefaultChartOptions();

            var graphcontainer = this.$('.flotchart-plot-container .flotchart');
            graphcontainer.bind('plotselected', updateGrid);

            if(get(this, 'controller.config.timenav')) {
                this.setDefaultTimenavOptions();

                var timecontainer = this.$('.flotchart-preview-container .flotchart');
                timecontainer.bind('plotselected', updateGrid);
            }

            console.groupEnd();

            this._super.apply(this, arguments);
        },

        setDefaultChartOptions: function() {
            //get the timestamp, and not the date object
            var now = +new Date();

            var ctrl = get(this, 'controller');
            var config = get(ctrl, 'config');

            var chartOptions = {};
            $.extend(chartOptions, get(ctrl, 'chartOptions'));
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

                xaxis: {
                    min: now - get(ctrl, 'time_window_offset') - get(ctrl, 'time_window'),
                    max: now - get(ctrl, 'time_window_offset')
                },

                xaxes: [{
                    show: true,
                    reserveSpace: true,
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
                    container: this.$('.flotchart-legend-container')
                },
                tooltip: get(config, 'tooltip')
            });

            console.log('Configure chart:', chartOptions);
            set(ctrl, 'chartOptions', chartOptions);
        },

        setDefaultTimenavOptions: function() {
            //get the timestamp, and not the date object
            var now = +new Date();
            var ctrl = get(this, 'controller');
            var config = get(ctrl, 'config');

            var chartOptions = {};
            $.extend(chartOptions, get(ctrl, 'timenavOptions'));
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

                xaxis: {
                    min: now - get(ctrl, 'time_window_offset') - get(ctrl, 'timenav_window'),
                    max: now - get(ctrl, 'time_window_offset')
                },

                xaxes: [{
                    show: true,
                    reserveSpace: true,
                    position: 'bottom',
                    mode: 'time',
                    timezone: 'browser'
                }],

                yaxes: [{
                    show: true,
                    reserveSpace: true
                }],

                legend: {
                    show: false
                },
                tooltip: false
            });

            console.log('Configure time navigation:', chartOptions);
            set(ctrl, 'timenavOptions', chartOptions);
        },

        actions: {
            resetZoom: function() {
                var ctrl = get(this, 'controller');

                this.setDefaultChartOptions();
                this.setDefaultTimenavOptions();

                set(ctrl, 'zooming', false);
            },

            stepBack: function() {
                var ctrl = get(this, 'controller');
                var step = get(ctrl, 'timestep');

                var opts = {};
                $.extend(opts, get(ctrl, 'chartOptions'));

                opts.xaxis.min -= step;
                opts.xaxis.max -= step;

                set(ctrl, 'chartOptions', opts);
            },

            stepForward: function() {
                var ctrl = get(this, 'controller');
                var step = get(ctrl, 'timestep');

                var opts = {};
                $.extend(opts, get(ctrl, 'chartOptions'));

                opts.xaxis.min += step;
                opts.xaxis.max += step;

                set(ctrl, 'chartOptions', opts);
            }
        }
    });

    var widget = WidgetFactory('timegraph', {
        needs: ['serie'],

        viewMixins: [
            FlotChartViewMixin
        ],

        partials: {
            widgetActionButtons: [
                'timegraphbutton-resetzoom'
            ]
        },

        zooming: false,
        chartOptions: undefined,
        timenavOptions: undefined,
        flotSeries: Ember.Object.create({}),
        dataSeries: Ember.A(),

        time_window: function() {
            return get(this, 'config.time_window') * 1000;
        }.property('config.time_window'),

        time_window_offset: function() {
            return get(this, 'config.time_window_offset') * 1000;
        }.property('config.time_window_offset'),

        timenav_window: function() {
            if(get(this, 'config.timenav')) {
                return get(this, 'config.timenav_window') * 1000;
            }
            else {
                return get(this, 'time_window');
            }
        }.property('config.timenav_window'),

        timestep: function() {
            return get(this, 'config.timestep') * 1000;
        }.property('config.timestep'),

        init: function() {
            this._super();
        },

        findItems: function() {
            console.group('Fetch series:');

            var me = this;

            var replace = false;
            var from = get(this, 'lastRefresh');
            var to = +new Date() - get(this, 'time_window_offset');

            if(from === null) {
                replace = true;
                from = to - get(this, 'timenav_window') - get(this, 'time_window_offset');
            }

            console.log('refresh:', from, to, replace);

            /* update axis limits */
            if(!get(this, 'zooming')) {
                var opts = {};
                $.extend(opts, get(this, 'chartOptions'));
                $.extend(opts, {
                    min: to - get(this, 'time_window') - get(this, 'time_window_offset'),
                    max: to
                });

                set(this, 'chartOptions', opts);

                if(get(this, 'timenav')) {
                    opts = {};
                    $.extend(opts, get(this, 'timenavOptions'));
                    $.extend(opts, {
                        min: from,
                        max: to
                    });

                    set(this, 'timenavOptions', opts);
                }
            }

            var store = get(this, 'widgetDataStore');

            /* fetch stylized series */
            var stylizedseries = get(this, 'config.series');
            var series = {};
            var curveIds = [];

            for(var i = 0, l = stylizedseries.length; i < l; i++) {
                var serieId = get(stylizedseries[i], 'serie');

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

                var i, l;

                console.group('Fetch curves:');
                var curvesById = {};

                for(i = 0, l = curveResult.meta.total; i < l; i++) {
                    var curve = curveResult.content[i];
                    curvesById[curve.id] = curve;
                }

                console.log(curvesById)
                console.groupEnd();

                console.group('Fetch series:');
                for(i = 0, l = serieResult.meta.total; i < l; i++) {
                    var serieconf = serieResult.content[i];
                    var serieId = serieconf.id;

                    if(series[serieId] !== undefined) {
                        var config = series[serieId];
                        var curveId = get(config, 'style.curve');

                        if(curvesById[curveId] !== undefined) {
                            set(config, 'curve', curve);
                        }

                        set(config, 'serie', serieconf);
                        me.genFlotSerie(config, from, to);
                    }
                }

                console.log('stylizedseries:', series);
                console.groupEnd();

                console.groupEnd();
            });

            set(this, 'lastRefresh', +new Date());
        },

        genFlotSerie: function(config, from, to, replace) {
            console.group('Generating FlotChart serie:', config);

            var me = this;

            var flotSerie = {
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
