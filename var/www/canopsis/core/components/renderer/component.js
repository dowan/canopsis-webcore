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
    'ember',
    'canopsis/canopsisConfiguration',
    'app/lib/utils/debug'
], function(Ember, canopsisConfiguration, debugUtils) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;


    var component = Ember.Component.extend({

        canopsisConfiguration: canopsisConfiguration,
        debug: Ember.computed.alias('canopsisConfiguration.DEBUG'),

        actions: {
            inspect: function() {
                debugUtils.inspectObject(this);
            },

            do: function(action) {
                var params = [];
                for (var i = 1, l = arguments.length; i < l; i++) {
                    params.push(arguments[i]);
                }

                get(this, 'parentView.controller').send(action, params);
            }
        },
        tagName: 'span',

        attr: function() {
            var shown_columns = get(this, 'shown_columns');
            for (var i = 0, l = shown_columns.length; i < l; i++) {
                if(shown_columns[i].field === get(this, 'field')) {
                    return shown_columns[i];
                }
            }
        }.property('shown_columns'),

        rendererType: function() {
            console.group('rendererType');

            var overrides = get(this, 'rendererOverrides');

            var type = get(this, 'content.model.type');
            var role = get(this, 'content.model.options.role');
            var field = get(this, 'content.field');


            console.log('content:', get(this, 'content'));
            console.log('type:', get(this, 'content.field'));
            console.log('type:', type);
            console.log('role:', role);

            var rendererName;

            if(!isNone(overrides) && !isNone(field) && get(overrides, field)) {
                rendererName = 'renderer-' + get(overrides, field);
            } else {
                if (role) {
                    if(!isNone(overrides) && get(overrides, role)) {
                        rendererName = 'renderer-' + get(overrides, role);
                    } else {
                        rendererName = 'renderer-' + role;
                    }
                } else {
                    if(!isNone(overrides) && get(overrides, type)) {
                        rendererName = 'renderer-' + get(overrides, type);
                    } else {
                        rendererName = 'renderer-' + type;
                    }
                }
            }

            if (Ember.TEMPLATES[rendererName] === undefined) {
                rendererName = undefined;
            }

            console.groupEnd();

            return rendererName;
        }.property('content.type', 'content.role'),

    });


    Ember.Application.initializer({
        name:"component-renderer",
        initialize: function(container, application) {
            application.register('component:component-renderer', component);
        }
    });

    return component;
});
