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
    'app/lib/abstractclassregistry'
], function(Abstractclassregistry) {

    /**
     * UI actions Registry
     *
     * @class ActionsRegistry
     * @extends Abstractclassregistry
     * @static
     */
    var actionsRegistry = Abstractclassregistry.create({
        name: 'actions',

        all: [{
            name: 'gotoEventView',
            actionData: ['showView', 'view.event']
        },{
            name: 'toggleEditMode',
            actionData: ['toggleEditMode']
        },{
            name: 'promptReloadApplication',
            actionData: ['promptReloadApplication']
        },{
            name: 'showUserProfile',
            actionData: ['showUserProfile']
        },{
            name: 'editConfig',
            actionData: ['editConfig']
        },{
            name: 'addNewView',
            actionData: ['addNewView']
        },{
            name: 'logout',
            actionData: ['logout']
        },{
            name: 'refresh',
            actionData: ['refresh']
        },{
            name: 'toggleFullscreen',
            actionData: ['toggleFullscreen']
        },{
            name: 'toggleDevTools',
            actionData: ['toggleDevTools']
        }],
        byClass: {},
        tableColumns: [{title: 'name', name: 'name'}]
    });

    return actionsRegistry;
});
