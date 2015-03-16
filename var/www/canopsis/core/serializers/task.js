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
    'utils'
], function(DS, ApplicationSerializer, EmbeddedRecordSerializerMixin, cutils) {

    var serializer = ApplicationSerializer.extend(
        EmbeddedRecordSerializerMixin,
        {}
    );

    for(var sname in cutils.schemaList) {
        if(sname.indexOf('Task.') === 0) {
            var xtype = sname.slice(5);
            var modelname = xtype[0].toUpperCase() + xtype.slice(1);

            var serializerName = modelname;

            loader.register('serializer:' + serializerName.dasherize(), serializer);

        }
    }

    loader.register('serializer:task', serializer);

    return serializer;
});
