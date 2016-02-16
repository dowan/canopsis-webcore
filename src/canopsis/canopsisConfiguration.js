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

define(['ember-lib', 'ember-data-lib'], function () {

    var get = Ember.get;

    Ember.Object.reopen({
        toJson: function() {
            return JSON.parse(JSON.stringify(this));
        },
        json: function() {
            return JSON.parse(JSON.stringify(this));
        }.property()
    });

    var controllerDict = {
        init: function() {
            if(get(this, 'isGenerated')) {
                console.error('Ember is Instantiating a generated controller for "' + get(this, '_debugContainerKey') + '". This practice is not encouraged, as it might also be an underlying requireJS problem.', this);
            }
            this._super.apply(this, arguments);
        }
    };

    Ember.Controller.reopen(controllerDict);
    Ember.ArrayController.reopen(controllerDict);
    Ember.ObjectController.reopen(controllerDict);

    DS.ArrayTransform = DS.Transform.extend({
        deserialize: function(serialized) {
            if (Ember.typeOf(serialized) === 'array') {
                return serialized;
            }

            return [];
        },

        serialize: function(deserialized) {
            var type = Ember.typeOf(deserialized);

            if (type === 'array') {
                return deserialized;
            } else if (type === 'string') {
                return deserialized.split(',').map(function(item) {
                    return jQuery.trim(item);
                });
            }

            return [];
        }
    });

    DS.IntegerTransform = DS.Transform.extend({
        deserialize: function(serialized) {
            if (typeof serialized === "number") {
                return serialized;
            } else {
                // console.warn("deserialized value is not a number as it is supposed to be", arguments);
                return 0;
            }
        },

        serialize: function(deserialized) {
            return Ember.isEmpty(deserialized) ? null : Number(deserialized);
        }
    });

    DS.ObjectTransform = DS.Transform.extend({
        deserialize: function(serialized) {
            if (Ember.typeOf(serialized) === 'object') {
                return Ember.Object.create(serialized);
            }

            return Ember.Object.create({});
        },

        serialize: function(deserialized) {
            var type = Ember.typeOf(deserialized);

            if (type === 'object' || type === 'instance') {
                return Ember.Object.create(deserialized);
            } else {
                console.warn("bad format", type, deserialized);
            }

            return null;
        }
    });

    /*
     * Here is the canopsis UI main configuration file.
     * It is possible to add properies and values that are reachable
     * from the whole application through the namespace Canopsis.conf.PROPERTY
     */
    var canopsisConfiguration = {
        DEBUG: false,
        VERBOSE: 1,
        showPartialslots: false,
        DISPLAY_SCHEMA_MANAGER: true,
        REFRESH_ALL_WIDGETS: true,
        TRANSLATE: true,
        SHOW_TRANSLATIONS: false,
        TITLE: 'Canopsis Sakura',
        SHOWMODULES: false,
    };

    window.canopsisConfiguration = canopsisConfiguration;

    return canopsisConfiguration;
});
