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

Ember.Application.initializer({
    name: 'component-wrapper',
    initialize: function(container, application) {
        var get = Ember.get,
            set = Ember.set,
            isNone = Ember.isNone;

        //TODO component-wrapper does not seems to be used anymore, check if it's possible to remove this component
        /**
         * @component wrapper
         */
        var component = Ember.Component.extend({
            /**
             * @property tagName
             * @type string
             * @default
             */
            tagName: 'span',

            /**
             * @method init
             */
            init: function() {
                this._super();
                console.log("init wrapper component");
                console.log("wrapper component type", get(this, 'editor-type'));
                //mock attr
                set(this, 'attr', {
                    model: {
                        options:{}
                    }
                });
            },

            /**
             * @method onContentUpdate
             */
            onContentUpdate: function(){

                var callback = get(this, 'callback');

                var referer = get(this, 'referer');

                if (isNone(referer)) {
                    console.warn('Referer not defined in component template. callbacks cannot work');
                }

                if (!isNone(callback)) {
                    callback(get(this, 'attr.value'), referer);
                } else {
                    console.log('Callback is not valid : ', callback, this);
                }

            }.observes('attr.value'),

            /**
             * @property editorType
             * @type string
             */
            editorType: function() {

                var type = get(this, 'editor-type');

                console.log('editor-type:', type);

                var editorName = 'editor-' + type;

                if (Ember.TEMPLATES[editorName] === undefined) {
                    editorName = 'editor-defaultpropertyeditor';
                }

                return editorName;

            }.property('editor-type'),
        });

        application.register('component:component-wrapper', component);
    }
});
