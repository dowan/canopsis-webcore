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
        'TimestampHelper',
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
         * @widget Statstable
         * @augments Widget
         */
        var widget = WidgetFactory('statstable', {
            init: function() {
                this._super.apply(this, arguments);

                set(this, 'excludeKeys', [
                    '__name__'
                ]);
            },

            updateInterval: function(interval) {
                var from = get(interval, 'timestamp.$gte'),
                    to = get(interval, 'timestamp.$lte');

                if(!isNone(from)) {
                    set(this, 'from', from * 1000);
                }
                else {
                    set(this, 'from', undefined);
                }

                if(!isNone(to)) {
                    set(this, 'to', to * 1000);
                }
                else {
                    set(this, 'to', undefined);
                }

                this.refreshContent();
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

                set(this, 'timewindow', {
                    from: from / 1000,
                    to: to / 1000
                });

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

                $.each(metrics, function(idx, metric) {
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

                this.notifyPropertyChange('users');
                this.notifyPropertyChange('events');
                this.notifyPropertyChange('series');
            },

            getDelaySeries: function(resources, isUser) {
                var series = get(this, 'series'),
                    delayMetrics = ['min', 'max', 'average'],
                    selected = {},
                    sources = ['x'],
                    groups = [];

                var condition = function(cmp) {
                    if (isUser) {
                        return cmp !== '__canopsis__';
                    }
                    else {
                        return cmp === '__canopsis__';
                    }
                };

                $.each(series, function(idx, serie) {
                    var component = get(serie, 'component'),
                        resource = get(serie, 'resource'),
                        metric = get(serie, 'metric');

                    if (condition(component) && delayMetrics.indexOf(metric) >= 0) {
                        if (isNone(resources) || resources.indexOf(resource) >= 0) {
                            var groupname = metric;

                            /* generate chart categories */
                            if (sources.indexOf(component) === -1) {
                                sources.push(component);
                            }

                            /* generate groups in each categories */
                            if (groups.indexOf(groupname) === -1) {
                                groups.push(groupname);
                                set(selected, groupname, []);
                            }

                            /* add point to corresponding category/group */
                            var points = get(serie, 'data'),
                                point = null;

                            if (points.length > 0) {
                                point = points[points.length - 1][1];
                            }

                            get(selected, groupname).push(point);
                        }
                    }
                });

                /* generate chart columns */
                var columns = [sources];

                $.each(selected, function(key, points) {
                    columns.push([key].concat(points));
                });

                return {
                    data: {
                        x: 'x',
                        columns: columns,
                        type: 'bar'
                    },
                    axis: {
                        x: {
                            type: 'category'
                        }
                    }
                };
            },

            /* charts configuration */

            userAlarmSolvedSeries: function() {
                return this.getDelaySeries(['alarm_solved'], true);
            }.property('series'),

            userAlarmAckSeries: function() {
                return this.getDelaySeries(['alarm_ack_delay'], true);
            }.property('series'),

            userAlarmAckSolvedSeries: function() {
                return this.getDelaySeries(['alarm_ack_solved'], true);
            }.property('series'),

            userSessionSeries: function() {
                return this.getDelaySeries(['session_duration'], true);
            }.property('series'),

            alarmSolvedSeries: function() {
                return this.getDelaySeries(['alarm_solved_delay'], false);
            }.property('series'),

            alarmAckSeries: function() {
                return this.getDelaySeries(['alarm_ack_delay'], false);
            }.property('series'),

            alarmAckSolvedSeries: function() {
                return this.getDelaySeries(['alarm_ack_solved_delay'], false);
            }.property('series'),

            alarmCounters: function() {
                var series = get(this, 'series'),
                    alarmMetrics = [
                        'alarm',
                        'alarm_ack',
                        'alarm_solved',
                        'alarm_ack_solved',
                    ],
                    alarmLabels = [
                        'Alarms',
                        'Acknowledged alarms',
                        'Solved alarms',
                        'Solved/Acknowledged alarms'
                    ],
                    selected = {};

                $.each(series, function(idx, serie) {
                    var component = get(serie, 'component'),
                        resource = get(serie, 'resource'),
                        metric = get(serie, 'metric');

                    if (component === '__canopsis__' && alarmMetrics.indexOf(resource) >= 0) {
                        if (isNone(get(selected, metric))) {
                            set(selected, metric, []);
                        }

                        var points = get(serie, 'data'),
                            point = null;

                        if (points.length > 0) {
                            point = points[points.length - 1][1];
                        }

                        get(selected, metric).push(point);
                    }
                });

                var columns = [['x'].concat(alarmLabels)];

                $.each(selected, function(name, points) {
                    columns.push([name].concat(points));
                });

                return {
                    data: {
                        x: 'x',
                        columns: columns,
                        type: 'bar'
                    },
                    axis: {
                        x: {
                            type: 'category'
                        }
                    }
                };
            }.property('series'),

            /* table properties */

            userTable: function() {
                var users = get(this, 'users'),
                    items = [],
                    me = this;

                if (!isNone(users)) {
                    $.each(users, function(key, item) {
                        if (users.hasOwnProperty(key) && me.excludeKeys.indexOf(key) === -1) {
                            var counters = [],
                                ack = get(item, 'alarm_ack');

                            if (!isNone(ack)) {
                                $.each(ack, function(countername, counter) {
                                    if(ack.hasOwnProperty(countername) && me.excludeKeys.indexOf(countername) === -1) {
                                        counters.push(counter);
                                    }
                                });
                            }

                            items.push({
                                user: item,
                                counters: counters
                            });
                        }
                    });
                }

                return items;
            }.property('users'),

            userCounters: function() {
                var users = get(this, 'userTable'),
                    items = [],
                    me = this;

                if (!isNone(users) && users.length > 0) {
                    var counters = get(users[0], 'counters');

                    $.each(counters, function(idx, counter) {
                        items.push(counter.__name__);
                    });
                }

                return items;
            }.property('userTable'),

            eventCounterTotal: function() {
                var events = get(this, 'events.__canopsis__.alarm'),
                    items = [],
                    me = this;

                if (!isNone(events)) {
                    $.each(events, function(key, item) {
                        if (events.hasOwnProperty(key) && me.excludeKeys.indexOf(key) === -1) {
                            items.push(item);
                        }
                    });
                }

                return items;
            }.property('events'),

            eventCounterAck: function() {
                var events = get(this, 'events.__canopsis__.alarm_ack'),
                    items = [],
                    me = this;

                if (!isNone(events)) {
                    $.each(events, function(key, item) {
                        if (events.hasOwnProperty(key) && me.excludeKeys.indexOf(key) === -1) {
                            items.push(item);
                        }
                    });
                }

                return items;
            }.property('events'),

            eventCounterSolved: function() {
                var events = get(this, 'events.__canopsis__.alarm_solved'),
                    items = [],
                    me = this;

                if (!isNone(events)) {
                    $.each(events, function(key, item) {
                        if (events.hasOwnProperty(key) && me.excludeKeys.indexOf(key) === -1) {
                            items.push(item);
                        }
                    });
                }

                return items;
            }.property('events'),

            eventCounterAckSolved: function() {
                var events = get(this, 'events.__canopsis__.alarm_ack_solved'),
                    items = [],
                    me = this;

                if (!isNone(events)) {
                    $.each(events, function(key, item) {
                        if (events.hasOwnProperty(key) && me.excludeKeys.indexOf(key) === -1) {
                            items.push(item);
                        }
                    });
                }

                return items;
            }.property('events')
        }, widgetOptions);

        application.register('widget:statstable', widget);
    }
});
