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
    'app/lib/utils/filterObject',
    'app/lib/formsregistry'
], function(Ember, Application , filterObjectUtils, formsregistry) {
// TODO: just make a function from this

    var mixin = Ember.Mixin.create({
        onInit : function ( contentREF , _self ){
            var formController = formsregistry.formwrapper.form;
            if (formController) {
                filterObjectUtils.getFieldsByPrefix( "_opt_" , formController.formContext , function( attr , result  ){
                    var nameMixin = { name : attr.slice(5) };
                    result.pushObject(nameMixin);
                } , contentREF);
            }
            _self.set("select", 0 );
        }
    });

    Application.TagsoptionfilterMixin = mixin;

    return mixin;
});
