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
    'ember',
    'app/application'
], function(Ember, Application) {

    var get = Ember.get,
        set = Ember.set;

    var component = Ember.Component.extend({
        availableSeries: function() {
            var store = get(this, 'componentDataStore');

            return store.findAll('serie');
        }.property(),

        availableCurves: function() {
            var store = get(this, 'componentDataStore');

            return store.findAll('curve');
        }.property(),

        serieChanged: function() {
            var store = get(this, 'componentDataStore');
            var serie_id = get(this, 'selectedSerie');
            var me = this;

            store.find('serie', serie_id).then(function(serie) {
                set(serie, 'xtype', get(serie, 'crecord_type'));
                set(me, 'content.value.serie', serie);
            });
        }.observes('selectedSerie'),

        curveChanged: function() {
            var store = get(this, 'componentDataStore');
            var curve_id = get(this, 'selectedCurve');
            var me = this;

            store.find('curve', curve_id).then(function(curve) {
                set(curve, 'xtype', get(curve, 'crecord_type'));
                set(me, 'content.value.style', curve);
            });
        }.observes('selectedCurve'),

        init: function() {
            this._super(arguments);

            set(this, "componentDataStore", DS.Store.create({
                container: get(this, "container")
            }));

            var defaultSerie = get(this, 'availableSeries')[0];
            var defaultCurve = get(this, 'availableCurves')[0];

            set(this, 'selectedSerie', defaultSerie);
            set(this, 'selectedCurve', defaultCurve);
        }
    });

    Application.ComponentSerieitemComponent = component;

    return component;
});
