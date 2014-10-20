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
    'ember',
    'app/lib/registries'
], function(Ember, registries) {

    var get = Ember.get;

    //TODO manage element with add and remove methods

    var manager = Ember.Object.extend({
        init: function() {
            this._super.apply(this, arguments);

            //put the initialized registry into the registry list
            var name = get(this, 'name');
            registries[name] = this;
        },

        all: [],
        byClass: {}
    });

    return manager;
});
