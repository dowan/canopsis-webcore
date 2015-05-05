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
    'ember-data',
    'app/lib/mappers/adapters',
    'app/lib/mappers/serializers'
], function(DS, adaptersMapper, serializersMapper) {

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
          adapter = container.lookup('adapter:' + adaptersMapper[type.typeKey]) || container.lookup('adapter:' + type.typeKey) || container.lookup('adapter:application');
        }

        return adapter || get(this, 'defaultAdapter');
      },

      serializerFor: function(type) {
        var container = this.container;
        var adapter = this.adapterFor(type);

        type = this.modelFor(type);
        if(container) {
          serializer = container.lookup('serializer:' + serializersMapper[type.typeKey]) || container.lookup('serializer:' + type.typeKey) || container.lookup('serializer:application');
        }

        return serializer || adapter.defaultSerializer || container.lookup('serializer:-default');
      }
    });

    return DS.Store;
});
