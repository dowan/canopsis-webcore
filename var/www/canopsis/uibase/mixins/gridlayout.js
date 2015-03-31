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
    'app/lib/factories/mixin'
], function(Ember, Mixin) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    var viewMixin = Ember.Mixin.create({
        didInsertElement: function() {

            var wrappers = get(this, 'controller.items.content');
            var haveToSaveView = false;

            for (var i = wrappers.length - 1; i >= 0; i--) {

                //Dynamic mixin values setting
                var currentWrapperMixins = get(wrappers[i], 'mixins');
                if (isNone(currentWrapperMixins)) {
                    set(wrappers[i], 'mixins', []);
                    currentWrapperMixins = get(wrappers[i], 'mixins');
                }

                if (isNone(currentWrapperMixins.findBy('name', 'gridlayout'))) {
                    currentWrapperMixins.pushObject({'name': 'gridlayout'});
                    haveToSaveView = true;
                }

                var classValue = get(this, 'controller').getSection(currentWrapperMixins);

                Ember.setProperties(wrappers[i], {
                    'classValue': classValue
                });
            }

            if (haveToSaveView) {
                get(this, 'controller.viewController.content').save();
            }

            this._super();
        }
    });

    var mixin = Mixin('gridlayout', {
        partials: {
            layout: ['gridlayout']
        },

        init: function() {
            this._super();
            this.addMixinView(viewMixin);
        },

        getSection: function (currentWrapperMixins) {

            var gridLayoutMixin = currentWrapperMixins.findBy('name', 'gridlayout');
            var column = gridLayoutMixin.column || '4';
            var offset = gridLayoutMixin.offset || '0';
            return 'col-md-' + column + ' col-md-offset-' + offset;
        },

    });

    return mixin;
});
