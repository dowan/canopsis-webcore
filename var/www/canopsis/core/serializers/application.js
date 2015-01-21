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
    'ember-data',
    'app/mixins/metaserializer',
    'app/mixins/hashserializer',
    'app/lib/utils/notification'
], function(DS, MetaSerializerMixin, HashSerializerMixin, notificationUtils) {

    var get = Ember.get,
        set = Ember.set;

    var serializer = DS.RESTSerializer.extend(
        MetaSerializerMixin,
        HashSerializerMixin,
        {
            /**
             * Add a message to payload's metadata
             */
            addMessage: function(payload, message, logLevel) {
                void(logLevel); //TODO not implemented

                //FIXME not working in here
                notificationUtils.error(message);

                //FIXME metadata does not seems to be handled properly
                if(payload.meta === undefined) {
                    payload.meta = {};
                }
                if(payload.meta.messages === undefined) {
                    payload.meta.messages = [];
                }
                payload.meta.messages.push(message);
            }
        }
    );

    loader.register('serializer:application', serializer);

    return serializer;
});
