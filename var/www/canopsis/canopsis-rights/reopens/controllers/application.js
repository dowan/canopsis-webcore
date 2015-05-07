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
    'jquery',
    'ember',
    'ember-data',
    'app/controller/application',
    'app/lib/utils/data'
], function(
    $,
    Ember,
    DS,
    Applicationcontroller,
    dataUtils) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone,
        __ = Ember.String.loc;


    Applicationcontroller.reopen({
        didSaveView: function(userview) {
            this._super(userview);

            var formattedViewId = get(userview, 'id').replace('.', '_');

            console.error('didSaveView', userview);

            var right = dataUtils.getStore().createRecord('action', {
                  enable: true,
                  crecord_type: "action",
                  _id: formattedViewId,
                  id: formattedViewId,
                  crecord_name: formattedViewId,
                  desc: 'Rights on view : ' + userview.get('crecord_name')
            });
            right.save();

            //TODO Add the correct right to the current user, to allow him to display the view
            // var loginController = get(this, 'controllers.login');

            // var rights = get(loginController, 'record.rights');

            // set(rights, formattedViewId, { checksum : 7 });
            // var record = get(loginController, 'record');
            // record.save();
        }
    });

    return Applicationcontroller;
});
