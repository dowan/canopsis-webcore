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
    'jquery',
    'ember'
], function($, Ember) {

    var get = Ember.get,
        set = Ember.set;

    var component = Ember.Component.extend({
        classNames: ['dropdownbuttoncontent', 'dropdownbuttoncontent-default'],
        attributeBindings: ['class'],
        class: 'dropdown-menu'
    });

    Ember.Application.initializer({
        name:"component-dropdownbutton",
        initialize: function(container, application) {
            application.register('component:component-dropdownbutton', component);
        }
    });

    return component;
});

/**
 * commencer l'arborescence avec un yield simple
 * faire un yield pour chaque niveau (je crois) car pas possible autrement
 * gérer le parcours d'arborescence avec parentView() et le style dans component.js quand html inexistant
 **/