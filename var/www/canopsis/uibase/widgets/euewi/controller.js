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
    name: "EueWidget",
    after: ['Schemas', 'ListWidget', 'WidgetFactory', 'ListlineDetailMixin'],
    initialize: function(container, application) {
        var WidgetFactory = container.lookupFactory('factory:widget');
        var ListController = container.lookupFactory('controller:list');
        var ListlineDetailMixin = container.lookupFactory('mixin:listline-detail');

        var get = Ember.get;

        var listOptions = {
            mixins: [
                ListlineDetailMixin
            ],
            subclass: ListController
        };

        var widget = WidgetFactory('euewi', {
        },listOptions);
    }
});
