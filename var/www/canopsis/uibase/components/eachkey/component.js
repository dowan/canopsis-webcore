/*
# Copyright (c) 2015 "Capensis" [http://www.capensis.com]
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

Ember.Application.initializer({
    name: 'EachKeyComponent',
    initialize: function(container, application) {
        var get = Ember.get;

        /**
         * @class EachKeyComponent
         * Used to render template by looping over object keys.
         */
        var component = Ember.Component.extend({
            iterator: function() {
                var obj = get(this, 'object'),
                    keys = Ember.A();

                $.each(obj, function(key, value) {
                    keys.pushObject({
                        'key': key,
                        'value': value
                    });
                });

                return keys;
            }.property('object')
        });

        application.register('component:component-eachkey');
    }
});
