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
    'app/application',
    'app/lib/utils/userconfiguration',
    'app/lib/utils/widgets',
    'utils',
    'app/lib/helpers/partialslot'
], function($, Ember, Application, userConfiguration, widgetUtils, utils) {
    var get = Ember.get,
        set = Ember.set;


    function removeMixinsPartials(widget, mixinName) {
        console.error('removing mixin partials', arguments);

        var partials = get(widget, '_partials');

        var partialsToRemove = get(Application, mixinName + 'Mixin.mixins')[0].properties.partials;

        for (var k in partialsToRemove) {
            if (partialsToRemove.hasOwnProperty(k)) {
                for (var i = 0, l = partialsToRemove[k].length; i < l; i++) {
                    get(widget, '_partials')[k].removeObject(partialsToRemove[k][i]);
                }
            }
        }

        set(widget, '_partials', partials);
    }

    //TODO put this in arrayutils
    function union_arrays (x, y) {
        var obj = {};
        for (var i = x.length-1; i >= 0; -- i)
            obj[x[i]] = x[i];
        for (var j = y.length-1; j >= 0; -- j)
            obj[y[j]] = y[j];
        var res = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k))  // <-- optional
                res.push(obj[k]);
        }
        return res;
    }

    var controller = Ember.ObjectController.extend({

        _partials: {},

        mixinsWillChange: function(instance, key) {
            console.error('will', arguments);
            console.error('will2', get(instance, key));

            this.oldMixinsValue = get(instance, key);
        }.observesBefore('content.mixins'),

        mixinsDidChange: function(instance, key) {
            console.error('did', this);

            var oldMixins = get(this, 'oldMixinsValue');
            var newMixins = get(instance, key);
            console.error('did2', oldMixins, newMixins);
            if(newMixins && oldMixins) {
                for (var i = 0, l = oldMixins.length; i < l; i++) {
                    oldMixins = oldMixins.without(newMixins[i]);
                }

                console.error('newMixins', oldMixins);
                for (var j = 0, lj = oldMixins.length; j < lj; j++) {
                    removeMixinsPartials(this, oldMixins[j]);
                }

                console.error('did3', newMixins);
            }

        }.observes('content.mixins'),

        /**
         * Override of willmergemixin to merge mixin's partials with base partials
         */
        willMergeMixin: function(Mixin) {
            this._super.apply(this, arguments);

            var me = this;

            if(Mixin.partials !== undefined) {
                Object.keys(Mixin.partials).forEach(function(key) {
                    console.log(key, Mixin.partials[key]);

                    var partialsKey = '_partials.' + key;

                    if(get(me, partialsKey) === undefined) {
                        set(me, partialsKey, Ember.A());
                    }

                    set(me, partialsKey, union_arrays(get(me, partialsKey), Mixin.partials[key]));
                });
            }
        }
    });

    Application.PartialslotAbleController = controller;

    return controller;
});
