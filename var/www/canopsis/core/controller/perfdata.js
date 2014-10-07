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
    'app/application'
], function($, Ember, DS, Application) {

    var controller = Ember.ObjectController.extend({

        init: function() {
            this._super();
        },

        fetch: function(metric_id, tstart, tend) {
            return new Ember.RSVP.Promise(function(resolve, reject) {
                $.ajax({
                    url: '/perfdata',
                    type: 'POST',
                    data: {
                        'metric_id': metric_id,
                        'timewindow': JSON.stringify({
                            'start': tstart,
                            'stop': tend
                        })
                    }
                }).then(resolve, reject);
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
                            'start': tstart,
                            'stop': tstop
                        }),
                        'timeserie': JSON.stringify({
                            'aggregation': method,
                            'period': interval
                        })
                    }
                }).then(resolve, reject);
            });
        },

        aggregateMany: function(metrics, tstart, tend, method, interval) {
            return this.aggregate(JSON.stringify(metrics), tstart, tend, method, interval);
        }
    });

    Application.PerfdataController = controller;

    return controller;
});
