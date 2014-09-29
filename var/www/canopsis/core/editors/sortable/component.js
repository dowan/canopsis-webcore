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
        set = Ember.set;

    var component = Ember.Component.extend({

        directionTypes: ['ASC', 'DESC'],

        init: function () {
            this._super.apply(this, arguments);
            if (!Ember.isNone(this.get('content'))) {
                this.set('property', this.get('content.property'));
                this.set('direction', this.get('content.direction'));
            }
        },

        onUpdate: function() {
            this.set('content', {
                property: this.get('property'),
                direction: this.get('direction')
            });
            console.debug('update sortable content', this.get('content'));
        }.observes('property', 'direction')

    });

    Application.ComponentSortableComponent = component;

    return component;
});
