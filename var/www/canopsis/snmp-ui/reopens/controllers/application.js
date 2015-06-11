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
    'app/controller/application',
], function(
    Ember,
    Applicationcontroller
    ) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    /**
     * @class ApplicationController
     * @extends PartialslotAbleController
     * @constructor
     * @description ApplicationController reopen
     */
    Applicationcontroller.reopen({
        /**
         * @property rightsRegistry
         * @type Object
         * @description Reference to the rights registry
         */
        init: function(){
            this._super();
            this.enginesviews.push(
                {label: __('Snmp rules'), value: 'view.snmprule'}
            );
        }
    });

    return Applicationcontroller;
});
