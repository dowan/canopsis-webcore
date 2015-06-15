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
 *
 * @module canopsis-frontend-core
 */

define([
    'ember',
    'app/lib/formsregistry',
    'app/lib/mixinsregistry',
    'app/lib/factories/mixin'
], function(Ember, formsregistry, mixinsregistry, Mixin) {
// TODO: just make a function from this
    var mixin = Mixin('mixinArray', {

        onInit : function (contentREF , _self){

            function getAndPushMixinNames(classToGet , contentREF){
                var currentClass = mixinsregistry.byClass[classToGet];

                for (var i = 0, l = currentClass.length; i < l ; i++) {
                    var nameMixin = { name : currentClass[i] };
                    contentREF.push(nameMixin);
                }
            }

            var formController = formsregistry.formwrapper.form;
            if ( formController ){
                var classToGet = _self.templateData.keywords.controller.content.model.options.mixinClass;

                if (classToGet !== undefined) {
                    getAndPushMixinNames(classToGet, contentREF);
                }
                else {
                    for ( var attribut in mixinsregistry.byClass ) {
                        if(mixinsregistry.byClass.hasOwnProperty(attribut)) {
                            getAndPushMixinNames(attribut, contentREF);
                        }
                    }
                }
            }
            _self.set("select", 1);
        }
    });


    return mixin;
});
