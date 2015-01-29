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
    'ember'
], function(Ember, hash) {

    var get = Ember.get,
        set = Ember.set,
        __ = Ember.String.loc;


    var component = Ember.Component.extend({
        init: function () {
            this._super();

            /*
                Business rules allowing to change attr values at runtime (when this helper is called)
                Applyed rules should be explained below and in which context they are called
            */
            if (!Ember.isNone(get(this, 'attr'))) {

                //copy to avoid side effects
                var attr = Ember.copy(get(this, 'attr').toJson());

                var value = get(this, 'value');

                console.log('testing attr inf forcevaluerenderer component', attr);
                console.log(get(attr, 'options.role'), get(attr, 'options.label'), typeof(value));

                //Allow to call component renderer without recursive stack overflow.
                //It enables to render forced value role as boolen in case the attribute is from event filter is loaded field.
                if (get(attr, 'options.role') === 'forcevalue' && typeof(value) === 'boolean') {
                    console.log('value mutated for is loaded renderer');
                    set(attr, 'options.role', 'boolean');
                }

                set(this, 'attr', attr);
            }

        }
    });

    Ember.Application.initializer({
        name:"component-forcevaluerenderer",
        initialize: function(container, application) {
            application.register('component:component-forcevaluerenderer', component);
        }
    });

    return component;
});
