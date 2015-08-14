/**
 * Copyright (c) 2015 "Capensis" [http://www.capensis.com]
 *
 * This file is part of Canopsis.
 *
 * Canopsis is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Canopsis is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Canopsis. If not, see <http://www.gnu.org/licenses/>.
 */

define([
    'app/mixins/metaserializer',
    'app/mixins/hashserializer',
    'app/lib/utils/notification',
    'app/mixins/embeddedrecordserializer'
], function(MetaSerializerMixin, HashSerializerMixin, notificationUtils, EmbeddedRecordSerializerMixin) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    var serializer = DS.RESTSerializer.extend(
        MetaSerializerMixin,
        HashSerializerMixin,
        EmbeddedRecordSerializerMixin,
        {
            /**
             * @method normalizeId
             * @private
             */
            normalizeId: function(hash) {
                if(isNone(hash.id)) {
                    hash.id = hash._id;
                }
            }
        }
    );

    Ember.Application.initializer({
        name: 'ApplicationSerializer',
        initialize: function(container, application) {
            application.register('serializer:application', serializer);
        }
    });

    return serializer;
});
