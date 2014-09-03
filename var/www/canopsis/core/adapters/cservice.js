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
        'app/application',
        'app/adapters/application',
        'utils',
        'app/lib/loaders/schema-manager'
], function(Application, ApplicationAdapter, cutils) {

    console.group('CserviceAdapter');

    Application.CserviceAdapter = ApplicationAdapter.extend({
        buildURL: function(type, id) {
            type = 'cservice';

            return this._super(type, id);
        }
    });

    for(var sname in cutils.schemaList) {
        if(sname.indexOf('Crecord.cservice.') === 0) {
            var xtype = sname.slice('Crecord.cservice.'.length);
            var modelname = xtype[0].toUpperCase() + xtype.slice(1);

            var adapterName = modelname + 'Adapter';
            console.log('Add adapter:', adapterName);

            Application[adapterName] = Application.CserviceAdapter.extend({});
        }
    }

    console.groupEnd();

    return Application.CserviceAdapter;
});
