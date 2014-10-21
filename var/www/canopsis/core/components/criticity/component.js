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
    'app/application',
], function(Ember, Application) {
    var get = Ember.get,
        set = Ember.set;


    var component = Ember.Component.extend({
        init: function() {
            this._super();
        },

        is00:function () {
            return get(this, 'content') === 0;
        }.property('content'),

        is01:function () {
            return get(this, 'content') === 1;
        }.property('content'),

        is02:function () {
            return get(this, 'content') === 2;
        }.property('content'),

        is10:function () {
            return get(this, 'content') === 10;
        }.property('content'),

        is11:function () {
            return get(this, 'content') === 11;
        }.property('content'),

        is12:function () {
            return get(this, 'content') === 12;
        }.property('content'),

        is20:function () {
            return get(this, 'content') === 20;
        }.property('content'),

        is21:function () {
            return get(this, 'content') === 21;
        }.property('content'),

        is22:function () {
            return get(this, 'content') === 22;
        }.property('content'),

        actions: {
            setCriticity: function (criticity) {
                set(this, 'content', criticity);
            }
        },

    });

    Application.ComponentCriticityComponent = component;

    return component;
});
