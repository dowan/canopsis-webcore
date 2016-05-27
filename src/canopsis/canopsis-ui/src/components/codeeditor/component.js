/*
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
    name: 'componentCodeeditor',
    initialize: function(container, application) {

        var get = Ember.get,
            set = Ember.set;

        /**
         * @component codeeditor
         * @description //TODO
         */
        var component = Ember.Component.extend({
            didInsertElement: function() {
                var component = this;
                var editor = CodeMirror.fromTextArea(this.$('.codemirror')[0], {
                    lineNumbers: true,
                    mode: "css"
                });

                editor.setValue(get(component, 'content'));
                editor.on("change", function(cm, change) {
                    set(component, 'content', cm.getValue());
                });

                setTimeout(function() {
                    editor.refresh();
                }, 400);
            }
        });

        application.register('component:component-codeeditor', component);

    }
});
