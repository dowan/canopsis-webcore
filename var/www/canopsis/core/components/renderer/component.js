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
    'ember'
], function(Ember) {

    var get = Ember.get;


    var component = Ember.Component.extend({
        actions: {
            do: function(action) {
                var params = [];
                for (var i = 1, l = arguments.length; i < l; i++) {
                    params.push(arguments[i]);
                }

                get(this, 'parentView.controller').send(action, params);
            }
        },
        tagName: 'span'
    });


    Ember.Application.initializer({
        name:"component-renderer",
        initialize: function(container, application) {
            application.register('component:component-renderer', component);
        }
    });

    return component;
});
