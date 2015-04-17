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
        classNames: ['dropdown', 'dropdown-default'],
        attributeBindings: ['class', 'id'],
        class: 'dropdown mega-dropdown',
        id: 'myDropdown'
    });

    /*var component = Ember.Component.extend({
        opened: false,
        actions: {
            open: function(){ 
                set(this, 'opened', true);
            },
            close: function(){ 
                set(this, 'opened', false);
            },
        },

        didInsertElement: function(){
            var component = this;

            $('div.dropdown.mega-dropdown button').on('click', function (event) {
                $(this).parent().toggleClass("open");
            });

           $('body').on('click', function (e) {
                if (!$('div.dropdown.mega-dropdown').is(e.target) && $('div.dropdown.mega-dropdown').has(e.target).length === 0 && $('.open').has(e.target).length === 0) {
                    $('div.dropdown.mega-dropdown').removeClass('open');
                }
            });
        }
    });*/

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