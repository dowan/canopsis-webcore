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
    'app/application',
    'app/lib/formsregistry',
    'app/lib/factories/mixin'
], function(Ember, Application, formsregistry, Mixin) {

    var get = Ember.get,
        set = Ember.set;

    var mixin = Mixin('modelDict', {

        onInit : function ( contentREF , _self ){
            var formController  =  formsregistry.formwrapper.form;
            // not really needed since error should have already been threw
            if (formController) {
                var schemaName = get(formController, 'formContext._data.listed_crecord_type');

                if (schemaName) {
                    schemaName = schemaName.substr(0,1).toUpperCase() + schemaName.substr(1,schemaName.length).toLowerCase();
                    // get model (array of string (field))
                    //var model = Application[schemaName]; var prototypef = model.prototype;
                    var model = Application.allModels[schemaName];
                    //for each field create object with :  name =  field and push them on content
                    for (var attribut in model) {
                        if (model.hasOwnProperty(attribut)) {
                            var template = { name : attribut };
                            contentREF.pushObject(template);
                        }
                    }
                }
                else {
                    console.warn( "schemaName can't be found on modelDictMixin ( list will be empty  for ", _self ," ) "  );
                }
            }
            _self.set("select", 0 );
        }
    });


    return mixin;
});
