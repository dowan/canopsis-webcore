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
    'app/serializers/application',
    'app/mixins/embeddedrecordserializer',
    'app/lib/loaders/utils'
], function(DS, ApplicationSerializer, EmbeddedRecordSerializerMixin, utils) {

    var serializer = ApplicationSerializer.extend(
        EmbeddedRecordSerializerMixin,
        {}
    );


    Ember.Application.initializer({
        name: 'CserviceSerializer',
        initialize: function(container, application) {

            //TODO don't use utils.schemaList, it is deprecated. Use registries
            for(var sname in utils.schemaList) {
                if(sname.indexOf('Crecord.cservice.') === 0) {
                    var xtype = sname.slice('Crecord.cservice.'.length);
                    var modelname = xtype[0].toUpperCase() + xtype.slice(1);

                    var serializerName = modelname.dasherize();
                    console.log('Add serializer:', serializerName);

                    application.register('serializer:' + serializerName, serializer.extend({}));
                }
            }

            application.register('serializer:cservice', serializer);
        }
    });

    return serializer;
});
