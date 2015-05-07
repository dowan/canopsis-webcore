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
    'ember'
], function(Ember, rightsRegistry) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone,
        __ = Ember.String.loc;


    var component = Ember.Component.extend({
        init: function() {
            var right = get(this, 'right');
            console.log('>>> init right', this, right);

            if(isNone(get(right, 'data'))) {
                set(right, 'data', Ember.Object.create());
            }

            if(!get(right, 'checksum')) {
                set(right, 'checksum', 1);
            }

            var checksum = get(right, 'checksum');
            console.log('>>>>>>>>> checksum', checksum);

            if(checksum >= 4) {
                checksum -= 4;
                set(this, 'checksum_R', true);
            }

            if(checksum >= 2) {
                checksum -= 2;
                set(this, 'checksum_W', true);
            }

            if(checksum >= 1) {
                checksum -= 1;
                set(this, 'checksum_X', true);
            }

            this._super();

            this.recomputeNumericChecksum();
        },

        actions: {
            toggleRightChecksum: function(flag) {
                var right = get(this, 'right');

                console.info('toggleRightChecksum action', arguments);

                var checksumFlagValue = get(this, 'checksum_' + flag);

                if(checksumFlagValue) {
                    set(this, 'checksum_' + flag, false);
                } else {
                    set(this, 'checksum_' + flag, true);
                }
            }
        },

        checksumRClass: function() {
            if(get(this, 'checksum_R')) {
                return 'btn btn-sm btn-warning active';
            } else {
                return 'btn btn-sm btn-warning';
            }
        }.property('checksum_R'),

        checksumWClass: function() {
            if(get(this, 'checksum_W')) {
                return 'btn btn-sm btn-warning active';
            } else {
                return 'btn btn-sm btn-warning';
            }
        }.property('checksum_W'),

        checksumXClass: function() {
            if(get(this, 'checksum_X')) {
                return 'btn btn-sm btn-warning active';
            } else {
                return 'btn btn-sm btn-warning';
            }
        }.property('checksum_X'),

        recomputeNumericChecksum: function() {
            var checksum_R = get(this, 'checksum_R'),
                checksum_W = get(this, 'checksum_W'),
                checksum_X = get(this, 'checksum_X'),
                numericChecksum = 0;

            if(checksum_R) {
                numericChecksum += 4;
            }

            if(checksum_W) {
                numericChecksum += 2;
            }

            if(checksum_X) {
                numericChecksum += 1;
            }

            set(this, 'computedNumericChecksum', numericChecksum);
            set(this, 'right.checksum', numericChecksum);
            // get(this, 'rightselector').recomputeValue();
        }.observes('checksum_R', 'checksum_W', 'checksum_X')
    });

    Ember.Application.initializer({
        name:"component-right-checksum",
        initialize: function(container, application) {
            application.register('component:component-right-checksum', component);
        }
    });

    return component;
});
