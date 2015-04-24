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

define([
    'ember'
], function(Ember, typesUtils) {

    var get = Ember.get,
        set = Ember.set;


    var component = Ember.Component.extend({
        classNames: ['panel-collapse', 'collapse', 'in'],
        formBase: Ember.computed.alias('parentView'),

        onPanelVisibilityChange: function() {
            var contentShown = get(this, 'formBase.contentShown');

            if(contentShown) {
                this.$('.miniformcontent-body').slideDown();
            } else {
                this.$('.miniformcontent-body').slideUp();
            }
        }.observes('formBase.contentShown')
    });

    Ember.Application.initializer({
        name:"component-miniformcontent",
        initialize: function(container, application) {
            application.register('component:component-miniformcontent', component);
        }
    });

    return component;
});
