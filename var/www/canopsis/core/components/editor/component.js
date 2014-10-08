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
    'canopsis/canopsisConfiguration',
    'app/lib/utils/debug',
    'app/lib/helpers/validationtextfield'
], function(Ember, Application, canopsisConfiguration, debugUtils) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    var component = Ember.Component.extend({
        tagName: 'span',

        canopsisConfiguration: canopsisConfiguration,
        debug: Ember.computed.alias('canopsisConfiguration.DEBUG'),

        init: function() {
            console.log("init editor compo");

            this._super();

            set(this, 'templateData.keywords.attr', Ember.computed.alias('content'));
        },

        actions: {
            inspect: function() {
                debugUtils.inspectObject(get(this, 'content'));
            }
        },

        editorType: function() {
            console.group('editorType');

            var overrides = get(this, 'editorOverrides');


            var type = get(this, 'content.model.type');
            var role = get(this, 'content.model.options.role');


            console.log('content:', get(this, 'content'));
            console.log('type:', get(this, 'content.field'));
            console.log('type:', type);
            console.log('role:', role);

            var editorName;

            if (role) {
                if(!isNone(overrides) && get(overrides, role)) {
                    editorName = 'editor-' + get(overrides, role);
                } else {
                    editorName = 'editor-' + role;
                }
            } else {
                if(!isNone(overrides) && get(overrides, type)) {
                    editorName = 'editor-' + get(overrides, type);
                } else {
                    editorName = 'editor-' + type;
                }
            }

            if (Ember.TEMPLATES[editorName] === undefined) {
                editorName = 'editor-defaultpropertyeditor';
            }

            console.groupEnd();

            return editorName;
        }.property('content.type', 'content.role'),

        attr: Ember.computed.alias("content")
    });

    Application.ComponentEditorComponent = component;

    return component;
});
