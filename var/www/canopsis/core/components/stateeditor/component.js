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
        set = Ember.set,
        isNone = Ember.isNone;

    var component = Ember.Component.extend({

        init: function() {
            this._super();
            set(this, 'previousContent', get(this, 'content'));
            if(isNone(get(this, 'hidePrevious'))) {
                //arbitrary default value currently used for change criticity action.
                set(this, 'hidePrevious', true);
            }
        },

        isInfo:function () {
            return get(this, 'content') === 0;
        }.property('content'),

        isMinor:function () {
            return get(this, 'content') === 1;
        }.property('content'),

        isMajor:function () {
            return get(this, 'content') === 2;
        }.property('content'),

        isCritical:function () {
            return get(this, 'content') === 3;
        }.property('content'),


        previousIsInfo:function () {
            return get(this, 'hidePrevious') && get(this, 'previousContent') === 0;
        }.property('previousContent'),

        previousIsMinor:function () {
            return get(this, 'hidePrevious') && get(this, 'previousContent') === 1;
        }.property('previousContent'),

        previousIsMajor:function () {
            return get(this, 'hidePrevious') && get(this, 'previousContent') === 2;
        }.property('previousContent'),

        previousIsCritical:function () {
            return get(this, 'hidePrevious') && get(this, 'previousContent') === 3;
        }.property('previousContent'),


        actions: {
            setState:function (state) {
                set(this, 'content', parseInt(state));
            }
        },

    });

    Application.ComponentStateeditorComponent = component;

    return component;
});
