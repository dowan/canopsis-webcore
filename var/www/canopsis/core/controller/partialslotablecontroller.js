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
    'app/lib/utils/widgets',
    'app/lib/helpers/partialslot'
], function($, Ember, Application, widgetUtils) {

    var get = Ember.get,
        set = Ember.set;


    function removeMixinsPartials(widget, mixinName) {
        console.log('removing mixin partials', arguments);

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

        mergedProperties: ['partials'],

        _partials: {},

        refreshPartialsList: function() {
            console.log('refreshPartialsList', get(this, 'partials'));
            var partials = get(this, 'partials');
            set(this, '_partials', partials);
            var mixins = get(this, 'content.mixins');

            if(Ember.isArray(mixins)) {
                for (var i = 0, l = mixins.length; i < l; i++) {
                    partials = this.mergeMixinPartials(mixins[i], partials);
                }
            }

            console.log('set partials for ', this, ' --> ', partials);
            set(this, '_partials', partials);
        },


        mergeMixinPartials: function(Mixin, partials) {
            var me = this;

            console.log("mergeMixinPartials mixin:", Mixin);
            if(Application[Mixin + 'Mixin']) {
                var partialsToAdd = Application[Mixin + 'Mixin'].mixins[0].properties.partials;

                for (var k in partialsToAdd) {
                    if (partialsToAdd.hasOwnProperty(k)) {
                        var partialsArray = partialsToAdd[k];

                        var partialKey = '_partials.' + k;
                        set(this, partialKey, union_arrays(get(this, partialKey), partialsArray));
                    }
                }
                return partials;
            }
        }
    });

    loader.register('controller:partialslot-able', controller);

    return controller;
});
