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
    'app/application',
    'canopsis/canopsis-backend-ui-connector/adapters/userview',
    'canopsis/canopsis-rights/objects/rightsregistry',
    'app/lib/utils/data'
], function(Ember, Application, UserviewAdapter, rightsRegistry, dataUtils) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    UserviewAdapter.reopen({
        updateRecord: function(store, type, snapshot) {
            var userview = snapshot;

            formattedViewId = get(userview, 'id').replace('.', '_');

            if(isNone(rightsRegistry.getByName(formattedViewId))) {
                //The right does not exists, assume that the view is brand new

                var right = dataUtils.getStore().createRecord('action', {
                      enable: true,
                      crecord_type: 'action',
                      type: 'RW',
                      _id: formattedViewId,
                      id: formattedViewId,
                      crecord_name: formattedViewId,
                      desc: 'Rights on view : ' + get(userview, 'crecord_name')
                });
                right.save();

                rightsRegistry.add(right, get(right, 'crecord_name'));

                //TODO Add the correct right to the current user, to allow him to display the view
                var loginController = dataUtils.getLoggedUserController();

                var rights = get(loginController, 'record.rights');

                set(rights, formattedViewId, { checksum : 7 });
                var record = get(loginController, 'record');
                record.save();
            } else {
                //TODO the right already exists, it's an update
                //TODO replace the userview name if it has changed
            }

            return this._super.apply(this, arguments);
        },

        deleteRecord: function(store, type, snapshot) {
            var userview = snapshot;

            formattedViewId = get(userview, 'id').replace('.', '_');
            var right = rightsRegistry.getByName(formattedViewId);
            console.log('deleteRecord', formattedViewId, rightsRegistry, right);
            right.deleteRecord();
            right.save();

            //TODO delete user right in payload

            return this._super.apply(this, arguments);
        }
    });

    return UserviewAdapter;
});
