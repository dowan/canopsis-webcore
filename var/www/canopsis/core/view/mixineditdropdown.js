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
    'jsonselect',
    'app/lib/schemasregistry'
], function(Ember, JSONSelect, schemasRegistry) {

    var set = Ember.set,
        get = Ember.get;


    var view = Ember.View.extend({
        tagName: 'span',
        templateName: 'mixineditdropdown',

        editableEnabledMixins: function () {
            var mixins = get(this, 'mixins');
            var editableMixins = Ember.A();

            if(mixins) {
                for (var i = 0; i < mixins.length; i++) {
                    if(schemasRegistry.getByName(mixins[i].name.camelize())) {
                        editableMixins.pushObject(mixins[i]);
                    }
                }
            }

            return editableMixins;
        }.property('mixins')
    });


    loader.register('view:mixineditdropdown', view);

    return view;
});
