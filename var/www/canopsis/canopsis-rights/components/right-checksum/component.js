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
    name:"component-right-checksum",
    after: 'RightsRegistry',
    initialize: function(container, application) {
        var rightsRegistry = container.lookupFactory('registry:rights');

        var get = Ember.get,
            set = Ember.set,
            isNone = Ember.isNone,
            __ = Ember.String.loc;


        var component = Ember.Component.extend({
            init: function() {
                var right = get(this, 'right');

                if(isNone(get(right, 'data'))) {
                    set(right, 'data', Ember.Object.create());
                }

                if(!get(right, 'checksum')) {
                    set(right, 'checksum', 1);
                }

                var checksum = get(right, 'checksum');

                if(checksum >= 8) {
                    checksum -= 8;
                    set(this, 'checksum8flag', true);
                }

                if(checksum >= 4) {
                    checksum -= 4;
                    set(this, 'checksum4flag', true);
                }

                if(checksum >= 2) {
                    checksum -= 2;
                    set(this, 'checksum2flag', true);
                }

                if(checksum >= 1) {
                    checksum -= 1;
                    set(this, 'checksum1flag', true);
                }

                this._super();

                this.recomputeNumericChecksum();
            },

            checksumType: function() {
                var value = get(this, 'right.name');
                var action = rightsRegistry.getByName(value);

                if(!isNone(action) && !isNone(action._data)) {
                    return action._data.type;
                } else {
                    return undefined;
                }
            }.property('right.name'),

            checksumIsRW: function() {
                return get(this, 'checksumType') === 'RW';
            }.property('checksumType'),

            checksumIsCRUD: function() {
                return get(this, 'checksumType') === 'CRUD';
            }.property('checksumType'),

            actions: {
                toggleRightChecksum: function(flagNumber) {
                    var right = get(this, 'right');

                    console.info('toggleRightChecksum action', arguments);

                    var checksumFlagValue = get(this, 'checksum' + flagNumber + 'flag');

                    if(checksumFlagValue) {
                        set(this, 'checksum' + flagNumber + 'flag', false);
                    } else {
                        set(this, 'checksum' + flagNumber + 'flag', true);
                    }

                    var onChecksumChange = get(this, 'onChecksumChange');
                    var onChecksumChangeTarget = get(this, 'onChecksumChangeTarget');
                    if(onChecksumChange && onChecksumChangeTarget) {
                        onChecksumChangeTarget[onChecksumChange](right);
                    }
                }
            },

            checksum8Class: function() {
                if(get(this, 'checksum8flag')) {
                    return 'btn btn-xs btn-success active';
                } else {
                    return 'btn btn-xs btn-danger';
                }
            }.property('checksum8flag'),

            checksum4Class: function() {
                if(get(this, 'checksum4flag')) {
                    return 'btn btn-xs btn-success active';
                } else {
                    return 'btn btn-xs btn-danger';
                }
            }.property('checksum4flag'),

            checksum2Class: function() {
                if(get(this, 'checksum2flag')) {
                    return 'btn btn-xs btn-success active';
                } else {
                    return 'btn btn-xs btn-danger';
                }
            }.property('checksum2flag'),

            checksum1Class: function() {
                if(get(this, 'checksum1flag')) {
                    return 'btn btn-xs btn-success active';
                } else {
                    return 'btn btn-xs btn-danger';
                }
            }.property('checksum1flag'),

            recomputeNumericChecksum: function() {
                var checksum8flag = get(this, 'checksum8flag'),
                    checksum4flag = get(this, 'checksum4flag'),
                    checksum2flag = get(this, 'checksum2flag'),
                    checksum1flag = get(this, 'checksum1flag'),
                    numericChecksum = 0;

                if(checksum8flag) {
                    numericChecksum += 8;
                }

                if(checksum4flag) {
                    numericChecksum += 4;
                }

                if(checksum2flag) {
                    numericChecksum += 2;
                }

                if(checksum1flag) {
                    numericChecksum += 1;
                }

                set(this, 'computedNumericChecksum', numericChecksum);
                set(this, 'right.checksum', numericChecksum);
            }.observes('checksum8flag', 'checksum4flag', 'checksum2flag', 'checksum1flag')
        });
        application.register('component:component-right-checksum', component);
    }
});
