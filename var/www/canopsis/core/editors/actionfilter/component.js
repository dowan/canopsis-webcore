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
    Application.ComponentActionfilterComponent = Ember.Component.extend({


        init: function() {
            this._super();
            //default value on load
            this.set('selectedAction', 'pass');
            console.log(' ! --- > content', this.get('content'));
            //Use a temp variable to avoid content deletion and strange behaviors.
            if (get(this, 'content') === undefined) {
                set(this, 'contentUnprepared', Ember.A());
            } else {
                set(this, 'contentUnprepared', get(this, 'content'));
            }
        },

        selectedAction: 'pwoute',
        availableactions: ['pass','drop','override','remove'],

        isOverride: function () {
            console.log('isOverride', get(this, 'selectedAction'), get(this, 'selectedAction') === 'override');
            return get(this, 'selectedAction') === 'override';
        }.property('selectedAction'),

        isRoute: function () {
            //not used yet
            return false;
            //console.log('isRoute', this.get('selectedAction'), this.get('selectedAction') === 'route');
            //return this.get('selectedAction') === 'route';
        }.property('selectedAction'),

        isRemove: function () {
            console.log('isRemove', get(this, 'selectedAction'), get(this, 'selectedAction') === 'remove');
            return get(this, 'selectedAction') === 'remove';
        }.property('selectedAction'),


        actions : {
            addAction: function () {
                var action = {
                    type: get(this, 'selectedAction')
                };

                if (get(this, 'selectedAction') === 'override') {
                    action.field = get(this, 'field');
                    action.value = get(this, 'value');
                }

                if (get(this, 'selectedAction') === 'remove') {
                    action.key = get(this, 'key');
                }

                console.log('Adding action', action);
                get(this, 'contentUnprepared').pushObject(action);
                set(this, 'content', get(this, 'contentUnprepared'));
            },

            deleteAction: function (action) {
                console.log('Removing action', action);
                get(this, 'contentUnprepared').removeObject(action);
                set(this, 'content', get(this, 'contentUnprepared'));
            }
        }

    });

    return Application.ComponentActionfilterComponent;
});
