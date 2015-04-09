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
    'ember',
], function(Ember) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone,
        __ = Ember.String.loc;


    var component = Ember.Component.extend({
        init: function() {
            this._super();
        },

        didInsertElement: function () {
            //allow display for button onclick menu display.
            //otherwise the menu is locked into the table td element.
            console.log('Inserted element linklist, setting td parent overflow to visible');
            this.$().parents('td').css('overflow-x', 'visible').css('overflow-y', 'visible');
        },

        links: function () {
            var infoLink = this.getInfoLink();
            return [
                {label: __('info link'), url: infoLink},
                {label: 'perdu', url: 'http://perdu.com'},
                {label: 'weekend', url: 'http://estcequecestbientotleweekend.fr'},
                {label: 'uselessweb', url: 'http://theuselessweb.com'},
            ];
        }.property(),

        getInfoLink: function() {

            var record = get(this, 'record');
            var linkInfoPattern = get(this, 'linkInfoPattern');

            var template = linkInfoPattern,
                context = record._data;

            var compiledUrl = Handlebars.compile(template)(context);

            console.log('info', compiledUrl, record._data);

            return compiledUrl;
        }

    });

    Ember.Application.initializer({
        name:"component-linklist",
        initialize: function(container, application) {
            application.register('component:component-linklist', component);
        }
    });

    return component;
});
