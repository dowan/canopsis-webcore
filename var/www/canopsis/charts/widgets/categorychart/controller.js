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
    'ember',
    'ember-data',
    'app/lib/factories/widget',
    'app/controller/serie',
    'app/controller/perfdata'
], function(Ember, DS, WidgetFactory) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    var widgetOptions = {};

    var CategoryChartViewMixin = Ember.Mixin.create({
        didInsertElement: function() {
            var ctrl = get(this, 'controller');

            console.log('category chart init');


            this._super.apply(this, arguments);
        },

        willDestroyElement: function() {

        },

        setDefaultChartOptions: function() {
            //get the timestamp, and not the date object
            var now = +new Date();

            var ctrl = get(this, 'controller');

        }
    });

    var widget = WidgetFactory('categorychart', {
        needs: ['serie', 'perfdata'],

        viewMixins: [
            CategoryChartViewMixin
        ],

        isProgressbar: function () {
            return true;
        }.property(),

        isGauge: function () {
            return true;
        }.property(),

        isPie: function () {
            return true;
        }.property(),

        isDonut: function () {
            return true;
        }.property(),


    }, widgetOptions);


    return widget;
});
