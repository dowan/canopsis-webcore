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
    'app/components/classifiedcrecordselector/component'
], function(Ember, Application, Classifiedcrecordselector) {

    var get = Ember.get,
        set = Ember.set;


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

    Application.ComponentArrayclassifiedcrecordselectorComponent = component;

    return component;
});
