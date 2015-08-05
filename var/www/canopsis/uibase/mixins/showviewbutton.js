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
    'app/lib/utils/routes',
    'app/lib/factories/mixin',
    'app/lib/utils/forms',
], function(routesUtils, Mixin, formsUtils) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;


    var mixin = Mixin('showviewbutton', {
        partials: {
            itemactionbuttons: ['actionbutton-show']
        },

        actions: {
            show: function(id) {
                Ember.assert('There should be an id passed as first argument', !isNone(id));

                console.log("Show action", arguments);
                routesUtils.getCurrentRouteController().send('showView', id);
            },

            viewrights: function(view) {
                formsUtils.showNew('viewrightsform', view, { title: __('Edit view rights') });
            }
        }
    });


    return mixin;
});
