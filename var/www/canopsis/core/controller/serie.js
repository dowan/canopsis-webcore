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
    'app/controller/perfdata'
], function($, Ember, DS, Application) {

    var controller = Ember.ObjectController.extend({
        needs: ['perfdata'],

        perfdata: Ember.computed.alias('controllers.perfdata'),

        init: function() {
            this._super();
        },

        getDataSerie: function(serie, from, to) {
            if(serie.metrics.length > 1 && serie.aggregate_method === 'none') {
                console.group('More than one metric in serie, performing an aggregation');

                console.log('serie:', serie);
                console.log('aggregation: average - 60s');

                serie.aggregate_method = 'average';
                serie.aggregate_interval = 60;

                console.groupEnd();
            }

            if(serie.aggregate_method === 'none') {

                var promise = get(this, 'perfdata').fetchMany(serie.metrics, from, to);

                promise.then(function() {
                    var results = arguments;

                    for(var i = 0, l = results.length; i < l; i++) {
                        var result = results[i];
                    }
                });
            }
            else {
                var promise = get(this, 'perfdata').aggregateMany(
                    serie.metrics,
                    from, to,
                    serie.aggregate_method, serie.aggregate_interval
                );

                promise.then(function() {
                    var results = arguments;

                    for(var i = 0, l = results.length; i < l; i++) {
                        var result = results[i];
                    }
                });
            }
        }
    });

    Application.SerieController = controller;

    return controller;
});
