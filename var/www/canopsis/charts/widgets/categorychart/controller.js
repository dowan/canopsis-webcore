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

Ember.Application.initializer({
    name: 'CategorychartWidget',
    after: ['WidgetFactory', 'MetricConsumer', 'TimeWindowUtils'],
    initialize: function(container, application) {
        var WidgetFactory = container.lookupFactory('factory:widget'),
            MetricConsumer = container.lookupFactory('mixin:metricconsumer'),
            TimeWindowUtils = container.lookupFactory('utility:timewindow');

        var get = Ember.get,
            set = Ember.set,
            isNone = Ember.isNone;

        var widgetOptions = {
            mixins: [MetricConsumer]
        };

        var Widget = WidgetFactory('categorychart', {
            init: function() {
                this._super._apply(this, arguments);
                
                var props = [
                    'display',
                    'allow_user_display',
                    'use_max_value',
                    'max_value',
                    'show_legend',
                    'show_tooltip',
                    'show_labels',
                    'metric_template',
                    'stacked',
                    'text_left_space',
                    'human_readable',
                ];

                var me = this;

                props.forEach(function(prop) {
                    set(me, 'options.' + prop, get(me, prop));
                });

                set(this, 'chartSeries', {});
            },

            findItems: function() {
                var tw = TimeWindowUtils.getFromTo(
                    get(this, 'time_window'),
                    get(this, 'time_window_offset')
                );
                var from = tw[0],
                    to = tw[1];

                /* live reporting support */
                var liveFrom = get(this, 'from'),
                    liveTo = get(this, 'to');

                if (!isNone(liveFrom)) {
                    from = liveFrom;
                }

                if (!isNone(liveTo)) {
                    to = liveTo;
                }

                var pmetrics = this.aggregateMetrics(
                        get(this, 'metrics'),
                        from, to,
                        'last',
                        /* aggregation interval: the whole timewindow for only one point */
                        to - from
                    ),
                    pseries = this.fetchSeries(get(this, 'series'), from, to);

                var me = this;
                Ember.RSVP.all([pmetrics, pseries]).then(function() {
                    var chartSeries = [];

                    get(me, 'chartSeries').forEach(function(key, serie) {
                        chartSeries.push(serie);
                    });

                    set(me, 'chartComponent.series', chartSeries);
                });
            },

            onMetrics: function(metrics) {
                var me = this;

                metrics.forEach(function(metric) {
                    var mid = get(metric, 'meta.data_id').split('/'),
                        points = get(metric, 'points');

                    /* initialize metric value */
                    var npoints = points.length,
                        value = 0;

                    if (npoints) {
                        value = points[npoints - 1];
                    }

                    /* compute metric name */
                    var metricname = mid[3] + '.' + mid[4];

                    if (mid.length !== 5) {
                        metricname += '.' + mid[5];
                    }

                    set(this, 'chartSeries.' + metricname, {
                        id: mid,
                        serie: [metricname, value]
                    });
                });
            }

            onSeries: function (series) {
                var me = this;

                series.forEach(function(serie) {
                    var points = get(serie, 'points'),
                        label = get(serie, 'label'),
                        value = 0;

                    if (points.length) {
                        value = points[points.length - 1];
                    }

                    set(me, 'chartSeries.' + label, {
                        id: label,
                        serie: [label, value]
                    });
                });
            }
        }, widgetOptions);

        application.register('widget:categorychart', Widget);
    }
});
