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
    'ember-data',
    'app/routes/application',
], function(Ember, DS, ApplicationRoute) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    /**
     * @class ApplicationRoute
     * @extends AuthenticatedRoute
     * @constructor
     * @description ApplicationRoute reopen
     */
    ApplicationRoute.reopen({
        /**
         * @method beforeModel
         * @param {Transition} transition
         * @return {Promise}
         *
         * Fetch all the registered rights in the backend and fill the rightsRegistry
         */
        beforeModel: function(transition) {
            var route = this;

            var store = DS.Store.create({ container: get(this, "container") });
            var rightsPromise = store.findQuery('action', { limit: 1000 });
            var appController = route.controllerFor('application');

            rightsPromise.then(function(queryResults) {
                for (var i = 0, l = queryResults.content.length; i < l; i++) {
                    var right = queryResults.content[i];
                    appController.rightsRegistry.add(right, get(right, 'crecord_name'));
                }
                store.destroy();
            });

            var superPromise = this._super(transition);

            var promiseArray = Ember.A([
                superPromise,
                rightsPromise
            ]);

            return Ember.RSVP.Promise.all(promiseArray);
        }
    });

    return ApplicationRoute;
});
