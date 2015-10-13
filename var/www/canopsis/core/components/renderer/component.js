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
 */

define([
    'canopsis/canopsisConfiguration'
], function(canopsisConfiguration) {

    Ember.Application.initializer({
        name:"component-renderer",
        after: 'DebugUtils',
        initialize: function(container, application) {
            var debugUtils = container.lookupFactory('utility:debug');

            var get = Ember.get,
                set = Ember.set,
                isNone = Ember.isNone;


            /**
             * Component displaying the correct renderer for an attribute.
             * It is possible to specify the renderer type to use. If not specified, it will try to get the correct type on its own.
             *
             * @class RendererComponent
             */
            var component = Ember.Component.extend({
                /**
                 * @method init
                 */
                init: function() {
                    var record = get(this, 'record'),
                        attrName = get(this, 'attrName');

                    if(!isNone(attrName)) {
                        console.group('Fetch attribute from record');

                        console.log('record:', record);
                        console.log('attrName:', attrName);

                        if(!isNone(record)) {
                            var attr = get(record, 'constructor.attributes.' + attrName),
                                value = get(record, attrName);

                            console.log('attr:', attr);
                            console.log('value:', value);

                            var role;
                            if (!isNone(attr)) {
                                role = get(attr, 'options.role');
                            }

                            if(!isNone(role)) {
                                var renderer = 'renderer-' + role;

                                if(!isNone(Ember.TEMPLATES[renderer])) {
                                    console.log('rendererType:', renderer);
                                    set(this, 'rendererType', renderer);
                                }
                            }

                            set(this, 'attr', attr);
                            set(this, 'value', value);
                        }

                        console.groupEnd();
                    }

                    this._super.apply(this, arguments);
                },

                /**
                 * @property runtimeConfiguration
                 * @see {{#crossLink "CanopsisConfiguration"}}{{/crossLink}}
                 */
                canopsisConfiguration: canopsisConfiguration,

                /**
                 * @property debug
                 * @type boolean
                 */
                debug: Ember.computed.alias('canopsisConfiguration.DEBUG'),

                actions: {
                    /**
                     * @event inspect
                     */
                    inspect: function() {
                        debugUtils.inspectObject(this);
                    },

                    /**
                     * @event do
                     * @param action
                     */
                    do: function(action) {
                        var params = [];
                        for (var i = 1, l = arguments.length; i < l; i++) {
                            params.push(arguments[i]);
                        }

                        get(this, 'parentView.controller').send(action, params);
                    }
                },

                /**
                 * @property tagName
                 * @type string
                 */
                tagName: 'span',

                /**
                 * @property attr
                 */
                attr: function() {
                    var shown_columns = get(this, 'shown_columns');
                    for (var i = 0, l = shown_columns.length; i < l; i++) {
                        if(shown_columns[i].field === get(this, 'field')) {
                            return shown_columns[i];
                        }
                    }
                }.property('shown_columns')
            });

            application.register('component:component-renderer', component);
        }
    });
});
