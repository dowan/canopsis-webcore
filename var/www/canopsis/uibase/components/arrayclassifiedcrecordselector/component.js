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
    'canopsis/uibase/components/classifiedcrecordselector/component'
], function(Ember, Classifiedcrecordselector) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;


    var component = Classifiedcrecordselector.extend({
        multiselect: true,

        setInitialContent: function(initialContent) {
            var valueKey = get(this, 'valueKey');

            console.log('setInitialContent', valueKey, typeof initialContent, initialContent);
            if(initialContent) {
                if(valueKey) {
                    set(this, 'loadingInitialContent', "true");
                } else {
                    var resBuffer = [];

                    var selectionUnprepared = get(this, 'selectionUnprepared');
                    for (var i = 0, l = initialContent.length; i < l; i++) {
                        selectionUnprepared.pushObject({'name': initialContent[i]});
                    }
                }
            }
        },

        selectionChanged: function(){
            this._super();
            //additional code ensuring single item selection and use of possible custom valueKey.
            var selection = get(this, 'selection');

            var valueKey = get(this, 'valueKey');
            if (isNone(valueKey)) {
                valueKey = 'name';
            }

            //simple cache object to avoid duplicates values
            var cache = {};
            //no duplication selection list computation
            var new_selection = [];
            //simple content values computation
            var content = [];

            //iteraing over previous selection in order to recompute it.
            for (var i=0; i<selection.length; i++) {
                var value = get(selection[i], valueKey);
                if (!cache[value]) {
                    cache[value] = 1;
                    content.push(value);
                    new_selection.push(selection[i]);
                }


            }
            set(this, 'selection', new_selection);
            set(this, 'content', content);

        }.observes('selectionUnprepared', 'selectionUnprepared.@each'),

        extractItems: function(items) {
            var valueKey = get(this, 'valueKey');
            var initialContent = get(this, 'content');

            if(valueKey) {
                var resBuffer = [];
                console.log('extractItems', arguments);
                for (var i = 0, l = initialContent.length; i < l; i++) {
                    var currentInitialItem = initialContent[i];

                    var correspondingExtractedItem = items.findBy('id', initialContent);

                    if(correspondingExtractedItem !== undefined) {
                        resBuffer.pushObject({ name: correspondingExtractedItem.get(valueKey)});
                    }
                }
                this.setProperties({
                    selectionUnprepared: resBuffer,
                    loadingInitialContent: false
                });
            }
        }
    });

    Ember.Application.initializer({
        name:"component-arrayclassifiedcrecordselector",
        initialize: function(container, application) {
            application.register('component:component-arrayclassifiedcrecordselector', component);
        }
    });

    return component;
});
