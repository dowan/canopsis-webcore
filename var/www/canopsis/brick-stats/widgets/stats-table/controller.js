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
    name: 'StatsTableWidget',
    after: [
        'WidgetFactory',
        'TimeWindowUtils',
        'MetricConsumer',
        'MetricFilterable',
        'HumanReadableHelper',
        'EachKeyComponent',
        'c3jsComponent'
    ],
    initialize: function(container, application) {
        var WidgetFactory = container.lookupFactory('factory:widget'),
            MetricConsumer = container.lookupFactory('mixin:metricconsumer'),
            MetricFilterable = container.lookupFactory('mixin:metricfilterable'),
            TimeWindowUtils = container.lookupFactory('utility:timewindow');

        var get = Ember.get,
            set = Ember.set,
            isNone = Ember.isNone;

        var widgetOptions = {
            mixins: [MetricConsumer, MetricFilterable]
        };

        /**
         * @class StatsTableWidget
         * @augments Widget
         */
        var widget = WidgetFactory('statstable', {
            init: function() {
                this._super.apply(this, arguments);

                set(this, 'excludeKeys', [
                    '__name__'
                ]);
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

                set(this, 'users', {});
                set(this, 'events', {});
                set(this, 'series', []);

                /* find metric IDs */
                var store = get(this, 'widgetDataStore'),
                    me = this;

                store.findQuery('ctxmetric', {
                    filter: this.getMetricFilter()
                }).then(function(result) {
                    var metric_ids = [];

                    get(result, 'content').forEach(function(ctx) {
                        metric_ids.push(get(ctx, 'id'));
                    });

                    if (metric_ids.length > 0) {
                        me.aggregateMetrics(
                            metric_ids,
                            from, to,
                            'last',
                            /* aggregation interval: the whole timewindow for only one point */
                            to - from
                        );
                    }
                });
            },

            onMetrics: function(metrics) {
                var users = get(this, 'users'),
                    events = get(this, 'events'),
                    series = get(this, 'series');

                metrics.forEach(function(metric) {
                    var mid = get(metric, 'meta.data_id').split('/'),
                        points = get(metric, 'points');

                    /* initialize metric value */
                    var npoints = points.length,
                        value = __('No data available');

                    if (npoints) {
                        value = points[npoints - 1][1];
                    }

                    /* compute path of metric */
                    var component = undefined,
                        resource = undefined,
                        metricname = undefined;

                    /* "/metric/<connector>/<connector_name>/<component>/[<resource>/]<name>"
                     * once splitted:
                     *  - ""
                     * - "metric"
                     * - "<connector>"
                     * - "<connector_name>"
                     * - "<component>"
                     * - "<resource>" and/or "<name>"
                     */
                    if (mid.length === 6) {
                        component = mid[4];
                        metricname = mid[5];
                    }
                    else {
                        component = mid[4];
                        resource = mid[5];
                        metricname = mid[6];
                    }

                    /* set metric in users or events dictionary */
                    var varname = component;
                    var context = undefined;

                    if(component === '__canopsis__') {
                        context = events;
                    }
                    else {
                        context = users;
                    }

                    if (isNone(get(context, varname))) {
                        set(context, varname, {
                            __name__: component
                        });
                    }

                    if (!isNone(resource)) {
                        varname += '.' + resource;

                        if (isNone(get(context, varname))) {
                            set(context, varname, {
                                __name__: resource
                            });
                        }
                    }

                    set(context, varname + '.' + metricname, {
                        value: value,
                        __name__: metricname
                    });

                    /* generate serie */
                    var label = [component];

                    if(!isNone(resource)) {
                        label.push(resource);
                    }

                    label.push(metricname);
                    label = label.join('.');

                    series.push({
                        component: component,
                        resource: resource,
                        metric: metricname,
                        data: points
                    });
                });

                set(this, 'users', users);
                set(this, 'events', events);
                set(this, 'series', series);
            },

            /* charts configuration */

            userSeries: function() {
                var series = get(this, 'series'),
                    selected = {},
                    users = ['x'],
                    groups = [];

                $.each(series, function(idx, serie) {
                    var component = get(serie, 'component'),
                        resource = get(serie, 'resource');

                    if (component !== '__canopsis__') {
                        /* generate chart categories */
                        if (users.indexOf(component) === -1) {
                            users.push(component);
                        }

                        /* generate groups in each categories */
                        if (groups.indexOf(resource) === -1) {
                            groups.push(resource);
                            set(selected, resource, []);
                        }

                        /* add point to corresponding category/group */
                        var points = get(serie, 'data'),
                            point = null;

                        if (points.length > 0) {
                            point = points[points.length - 1];
                        }

                        get(selected, resource).push(point)
                    }
                });

                /* generate chart columns */
                var columns = [users];

                $.each(selected, function(key, points) {
                    columns.push([key].concat(points));
                })

                return {
                    data: {
                        x: 'x',
                        columns: columns,
                        groups: groups,
                        type: 'bar'
                    },
                    axis: {
                        x: {
                            type: 'category'
                        }
                    }
                };
            }.property('series'),
        }, widgetOptions);

        application.register('widget:statstable', widget);
    }
});
