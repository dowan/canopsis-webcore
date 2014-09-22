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
    'app/lib/formsmanager',
    'app/lib/mixinsmanager'
], function(Ember, Application, formsmanager, mixinsmanager) {
// TODO: just make a function from this
    var mixin = Ember.Mixin.create({

        onInit : function ( contentREF , _self ){

            function getAndPushMixinNames(classToGet , contentREF){
                var currentClass = mixinsmanager.byClass[classToGet];
                for ( var i = 0 ; i < currentClass.length ; i++ ) {
                    var nameMixin = { name : currentClass[i] };
                    contentREF.push(nameMixin);
                }
            }

            var formController  =  formsmanager.formwrapper.form;
            if ( formController ){
                var classToGet = _self.templateData.keywords.controller.content.model.options.mixinClass;

                if (classToGet !== undefined) {
                    getAndPushMixinNames( classToGet , contentREF );
                }
                else {
                    for ( var attribut in mixinsmanager.byClass ) {
                        if ( mixinsmanager.byClass.hasOwnProperty( attribut ) ) {
                            getAndPushMixinNames( attribut , contentREF );
                        }
                    }
                }
            }
            _self.set("select", 1 );
        }
    });

    Application.mixinArrayMixin = mixin;

    return mixin;
});
