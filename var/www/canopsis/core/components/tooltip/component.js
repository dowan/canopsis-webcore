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
        tagName: 'span',

        htmlEnabled: true,
        placement: 'top',
        triggerEvent: 'hover',

        didInsertElement: function() {
            this.$("[data-toggle=popover]").popover();
            var component = this;

            var options = {
                html : get(component, 'htmlEnabled'),
                placement: get(component, 'placement'),
                trigger: get(component, 'triggerEvent'),
            };

            var content = get(component, 'content');

            if (!Ember.isNone(content)) {
                options.content = __(content);
            }

            var title = get(component, 'title');

            if (!Ember.isNone(title)) {
                options.title = __(title);
            }

            this.$().popover(options);
        }
    });

    Application.ComponentTooltipComponent = component;

    return component;
});
