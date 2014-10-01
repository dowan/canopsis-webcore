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
], function(Ember, Application) {
    var get = Ember.get,
        set = Ember.set;

    var component = Ember.Component.extend({
        model: function() {
            var model = get(this, 'content.model.options.model');

            var typekeySplit = model.split('.');
            var typekey = typekeySplit[typekeySplit.length - 1].capitalize();

            return typekey;
        }.property('content.model.options.model'),

        value: Ember.computed.alias('content.value'),

        availableModels: function() {
            var store = get(this, 'componentDataStore');
            var model = get(this, 'model');

            return store.findAll(model);
        }.property('content.model.options.model'),

        init: function() {
            this._super.apply(this, arguments);

            set(this, "componentDataStore", DS.Store.create({
                container: get(this, "container")
            }));

            var selectedId = get(this, 'value');

            if(selectedId) {
                set(this, 'selectedModel', selectedId);
            }
            else {
                var promise = get(this, 'availableModels');
                var me = this;

                promise.then(function(result) {
                    var first = result.content[0];

                    set(me, 'selectedModel', first);
                });
            }
        }
    });

    Application.ComponentModelselectComponent = component;
    return component;
});
