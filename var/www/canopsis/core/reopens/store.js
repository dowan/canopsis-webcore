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

var adaptersReplacements = {
    'todo': 'firebase'
};

define(['ember-data'], function(DS) {

    DS.Store.reopen({
      /**
        Returns the adapter for a given type.

        @method adapterFor
        @private
        @param {subclass of DS.Model} type
        @return DS.Adapter
      */
      adapterFor: function(type) {
        var container = this.container, adapter;

        if (container) {
          adapter = container.lookup('adapter:' + adaptersReplacements[type.typeKey]) || container.lookup('adapter:' + type.typeKey) || container.lookup('adapter:application');
        }

        return adapter || get(this, 'defaultAdapter');
      }
    });

    return DS.Store;
});
