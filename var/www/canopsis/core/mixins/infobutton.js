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
    'app/lib/factories/mixin'
], function(Ember, Mixin) {

    var get = Ember.get,
        set = Ember.set;


    var mixin = Mixin('infobutton', {
        partials: {
            itemactionbuttons: ['actionbutton-info']
        },

        actions: {
            info: function(record) {
                var list_info_button_pattern = get(this, 'controllers.application.frontendConfig.list_info_button_pattern');

                var template = list_info_button_pattern;
                var context = record._data;
                var compiledUrl = Handlebars.compile(template)(context);

                console.log('info', compiledUrl, record._data);
                window.open(compiledUrl, '_blank');
            }
        }
    });


    loader.register('mixin:infobutton', mixin);

    return mixin;
});
