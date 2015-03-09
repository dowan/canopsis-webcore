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

define([
    'jquery',
    'ember',
    'ember-data'
], function($, Ember, DS) {

    var get = Ember.get,
        set = Ember.set;


    var controller = Ember.ObjectController.extend({
        needs: ['application'],

        fetch: function(metric_id, tstart, tend) {
            var app = get(this, 'controllers.application');
            set(app, 'isLoading', get(app, 'isLoading') + 1);

            return new Ember.RSVP.Promise(function(resolve, reject) {
                $.ajax({
                    url: '/perfdata',
                    type: 'POST',
                    data: {
                        'metric_id': metric_id,
                        'timewindow': JSON.stringify({
                            'start': tstart / 1000,
                            'stop': tend / 1000,
                            'timezone': new Date().getTimezoneOffset()
                        }),
                        'timeserie': JSON.stringify({
                            'aggregation': 'NONE'
                        })
                    }
                }).then(function() {
                    set(app, 'isLoading', get(app, 'isLoading') - 1);

                    resolve.apply(this, arguments);
                }, function() {
                    set(app, 'isLoading', get(app, 'isLoading') - 1);

                    reject.apply(this, arguments);
                });
            });
        },

        fetchMany: function(metrics, tstart, tend) {
            return this.fetch(JSON.stringify(metrics), tstart, tend);
        },

        aggregate: function(metric_id, tstart, tend, method, interval) {
            return new Ember.RSVP.Promise(function(resolve, reject) {
                $.ajax({
                    url: '/perfdata',
                    type: 'POST',
                    data: {
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
                    }
                }).then(resolve, reject);
            });
        },

        aggregateMany: function(metrics, tstart, tend, method, interval) {
            return this.aggregate(JSON.stringify(metrics), tstart, tend, method, interval);
        }
    });


    loader.register('controller:perfdata', controller);

    return controller;
});
