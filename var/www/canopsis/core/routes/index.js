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
    'app/routes/authenticated',
    'app/lib/utils/actions'
], function(AuthenticatedRoute, actionsUtils) {

    var set = Ember.set,
        get = Ember.get;


    var route = AuthenticatedRoute.extend({
        setupController: function(controller) {
            this.controllerFor('application').onIndexRoute = true;
            actionsUtils.setDefaultTarget(controller);

            console.log('beforemodel');
        }
    });


    loader.register('route:index', route);

    return route;
});
