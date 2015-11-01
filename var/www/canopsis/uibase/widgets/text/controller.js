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
    name: 'TextWidget',
    after: [
        'WidgetFactory',
        'TimeWindowUtils',
        'EventConsumer',
        'MetricConsumer',
        'HumanReadableHelper'
    ],
    initialize: function(container, application) {
        var WidgetFactory = container.lookupFactory('factory:widget'),
            EventConsumer = container.lookupFactory('mixin:eventconsumer'),
            MetricConsumer = container.lookupFactory('mixin:metricconsumer'),
            TimeWindowUtils = container.lookupFactory('utility:timewindow');

        var get = Ember.get,
            set = Ember.set,
            isNone = Ember.isNone;

        var widgetOptions = {
            mixins: [EventConsumer, MetricConsumer]
        };

        var widget = WidgetFactory('text', {
            needs: ['perfdata', 'serie'],

            init: function() {
                this._super.apply(this, arguments);

                set(this, 'store', DS.Store.create({
                    container: get(this, 'container')
                }));

                var template = undefined;

                try {
                    template = Ember.Handlebars.compile(get(this, 'html'));
                }
                catch(err) {
                    template = function() {
                        return '<i>Impossible to render template:</i> ' + err;
                    };
                }

                set(this, 'template', template);
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

                set(this, 'context', {
                    event: {},
                    serie: {},
                    metric: {}
                });
                set(this, 'context.from', from);
                set(this, 'context.to', to);

                var pevents = this.fetchEvents(get(this, 'events')),
                    pmetrics = this.aggregateMetrics(
                        get(this, 'metrics'),
                        from, to,
                        'last',
                        /* aggregation interval: the whole timewindow for only one point */
                        to - from
                    ),
                    pseries = this.fetchSeries(get(this, 'series'), from, to);

                /* wait for all fetch operations */
                var me = this;

                Ember.RSVP.all([pevents, pmetrics, pseries], function() {
                    me.renderTemplate();
                });
            },

            onEvents: function(events, labelsByRk) {
                var me = this;

                events.forEach(function(evt) {
                    var rk = get(evt, 'id');
                    var label = get(labelsByRk, rk);

                    if (!isNone(label)) {
                        set(me, 'context.event.' + label, evt);
                    }
                    else {
                        console.warn('No label found for event, will not be rendered:', rk);
                    }
                });
            },

            onMetrics: function(metrics) {
                var me = this;

                metrics.forEach(function(metric) {
                    var mid = get(metric, 'meta.data_id').split('/'),
                        points = get(metric, 'points');

                    /* initialize metric value for template context */
                    var npoints = points.length,
                        value = __('No data available');

                    if (npoints) {
                        value = points[npoints - 1];
                    }

                    /* compute template context path of metric */
                    var component = undefined,
                        resource = undefined,
                        metricname = undefined;

                    if (mid.length === 5) {
                        component = mid[3];
                        metricname = mid[4];
                    }
                    else {
                        component = mid[3];
                        resource = mid[4];
                        metricname = mid[5];
                    }

                    var varname = 'context.metric.' + component;

                    if (isNone(get(me, varname))) {
                        set(me, varname, {});
                    }

                    if (!isNone(resource)) {
                        varname += '.' + resource;

                        if (isNone(get(me, varname))) {
                            set(me, varname, {});
                        }
                    }

                    set(me, varname + '.' + metricname, value);
                });
            },

            onSeries: function(series) {
                var me = this;

                series.forEach(function(serie) {
                    var points = get(serie, 'points'),
                        label = get(serie, 'label');

                    var value = __('No data available');

                    if (points.length) {
                        value = points[points.length - 1][1];
                    }

                    set(me, 'context.serie.' + label, value);
                });
            },

            renderTemplate: function() {
                var template = get(this, 'template'),
                    context = get(this, 'context');

                var html = new Ember.Handlebars.SafeString(template(context));
                set(this, 'rendered', html);
            }
        }, widgetOptions);

        application.register('widget:text', widget);
    }
});
