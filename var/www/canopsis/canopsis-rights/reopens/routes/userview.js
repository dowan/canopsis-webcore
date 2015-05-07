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
    'app/routes/userview',
    'canopsis/canopsis-rights/lib/utils/rightsflags'
], function(Ember, DS, UserviewRoute, rightsflagsUtils) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;


    UserviewRoute.reopen({
        beforeModel: function(transition) {
            var route = this;

            var applicationController = route.controllerFor('application');
            set(applicationController, 'editMode', false);

            var loginController = route.controllerFor('login');

            var viewId = get(transition, 'params.userview.userview_id');
            viewId = viewId.replace('.', '_');
            var checksum = get(loginController, 'record.rights.' + viewId + '.checksum');
            var userId = get(loginController, 'record._id');

            if(rightsflagsUtils.canRead(checksum) || viewId === 'view.404' || userId === 'root') {
                return this._super(transition);
            } else {
                this.transitionTo('/userview/view.404');
            }
        },
        actions: {
            toggleEditMode: function () {
                var loginController = this.controllerFor('login');
                var viewId = get(this, 'controller.model.id');
                viewId = viewId.replace('.', '_');

                var checksum = get(loginController, 'record.rights.' + viewId + '.checksum');

                if(rightsflagsUtils.canWrite(checksum)) {
                    this._super();
                }
            }
        }
    });

    return UserviewRoute;
});
