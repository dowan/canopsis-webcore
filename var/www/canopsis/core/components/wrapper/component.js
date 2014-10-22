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

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    //{{component-editor attr=attr form=this}}

    var component = Ember.Component.extend({
        tagName: 'span',
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

    Application.ComponentWrapperComponent = component;

    return component;
});
