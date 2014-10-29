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
    'canopsis/canopsisConfiguration',
    'app/lib/loaders/schemas',
    'app/lib/factories/mixin'
], function(Ember, canopsisConfiguration, available_types, Mixin) {

    var get = Ember.get,
        set = Ember.set;


    var mixin = Mixin('schemamanager', {
        configuration: canopsisConfiguration,
        available_types : available_types
    });


    loader.register('mixin:schemamanager', mixin);

    return mixin;
});
