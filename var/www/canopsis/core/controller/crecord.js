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
    'app/mixins/inspectableitem',
    'app/lib/loaders/schemas'
], function(Ember, InspectableItem) {

    var get = Ember.get,
        set = Ember.set;

    var controller = Ember.ObjectController.extend(InspectableItem, {
        remove: function() {
            get(this, "model").deleteRecord();
            get(this, "model").save();
        },

        //This is where to get data from the crecord. It should not be changed, and is for internal use only
        dataAccessKey: "content._data",

        inspectedDataItem: function() {
            return get(this, 'widgetData');
        }.property('widgetData')
    });

    loader.register('controller:crecord', controller);

    return controller;
});
