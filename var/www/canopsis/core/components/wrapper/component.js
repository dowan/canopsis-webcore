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
    'app/application'
], function(Ember, Application) {

//{{component-editor attr=attr form=this}}

    Application.ComponentWrapperComponent = Ember.Component.extend({
        tagName: 'span',
        init: function() {
            this._super();
            console.log("init wrapper component");
            console.log("wrapper component type", this.get('editor-type'));
            //mock attr
            this.set('attr', {
                model: {
                    options:{}
                }
            });
        },

        onContentUpdate: function(){

            var callback = this.get('callback');
            if (!Ember.isNone(callback)) {
                callback(this.get('attr.value'));
            } else {
                console.log('Callback is not valid : ', callback);
            }

        }.observes('attr.value'),

        editorType: function() {

            var type = this.get('editor-type');

            console.log('editor-type:', type);

            var editorName = 'editor-' + type;

            if (Ember.TEMPLATES[editorName] === undefined) {
                editorName = 'editor-defaultpropertyeditor';
            }

            return editorName;

        }.property('editor-type'),

    });

    return Application.ComponentWrapperComponent;
});
